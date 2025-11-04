import { useClient } from '@based/sdk'
import { memo, useEffect } from 'react'

export const Passkeys = memo(() => {
  const client = useClient()

  useEffect(() => {
    console.log('running passkeys test')
  }, [])
  return (
    <div
      onClick={async () => {
        console.log('getting config')
        const res = await client.call('passkeys-config')
        console.log({ res })
      }}
    >
      wawwa
    </div>
  )
})
