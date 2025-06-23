import type { BasedDbQuery, DbClient, Operator } from '@based/db'
import type { BasedQueryFunction } from '@based/functions'
import type { LangName } from '@based/schema'

// TODO: match these to types in the db
type FilterGroupItem = { field: string; operator: Operator; value: string }
type Filter = {
  operator: 'and' | 'or'
  items: FilterGroupItem[]
  nested?: {
    operator: 'and' | 'or'
    group: Filter
  }
}

type Payload = {
  type?: string
  alias?: any
  id?: number
  sort?: {
    key: string
    direction: 'asc' | 'desc'
  }
  offset?: number
  limit?: number
  include?: string[]
  filter?: Filter
  lang?: string
}

export default (async (based, payload, update) => {
  console.log('query!', payload)
  const db = based.db.v2 as DbClient
  const { type, alias, id, sort, offset, limit, include, filter, lang } =
    payload
  let query: BasedDbQuery

  if (!type) {
    if (id) {
      throw new Error('Missing type')
    }
    query = db.query()
  } else if (alias) {
    query = db.query(type, alias)
  } else if (id) {
    query = db.query(type, Number(id))
  } else {
    query = db.query(type)
  }
  if (include) {
    if (!Array.isArray(include)) {
      throw new Error('Invalid include')
    }
    query = query.include(...include)
  }
  if (lang) {
    query = query.locale(lang as LangName)
  }

  if (sort) {
    query = query.sort(sort.key, sort.direction)
  }
  if (offset) {
    query = query.range(offset, limit)
  }
  if (filter) {
    if (filter.operator === 'and') {
      for (const f of filter.items) {
        query = query.filter(f.field, f.operator, f.value)
      }
    } else if (filter.operator === 'or') {
      if (filter.items.length > 2) {
        const f0 = filter.items[0]
        query = query.filter(f0.field, f0.operator, f0.value).or((fn) => {
          addToFilter(filter.items, filter.items.length, 1, fn)
        })
      } else {
        let i = 0
        for (const f of filter.items) {
          if (i === 0) {
            query = query.filter(f.field, f.operator, f.value)
          } else {
            query = query.or(f.field, f.operator, f.value)
          }
          i++
        }
      }
    } else {
      throw new Error('Unsupported filter operator')
    }
  }

  return query.subscribe((res) => {
    update(res.toObject(), res.checksum)
  })
}) as BasedQueryFunction<Payload>

function addToFilter(
  filterItems: FilterGroupItem[],
  total: number,
  nextIdx: number,
  filterCb: any,
) {
  const f = filterItems[nextIdx]

  if (nextIdx === total - 1) {
    filterCb.filter(f.field, f.operator, f.value)
    return
  }

  filterCb.filter(f.field, f.operator, f.value).or((fn: any) => {
    addToFilter(filterItems, total, nextIdx + 1, fn)
  })
}
