import { ComponentRender } from '@based/docs'
import { Logo } from './Logo'

export const meta: Based.Stories.MetaDescriptor = {
  name: 'Logo',
  group: 'Components',
  section: 'components',
  icon: 'edit',
  component: Logo,
  subtitle: 'Based.io logo component.',
  showApi: true,
  importSource: '@functions/app',
}

export const blocks: Based.Stories.BlocksDescriptor[] = [
  {
    name: 'Default',
    description: 'Standard logo display.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Logo />
        </ComponentRender>
      )
    },
  },
  {
    name: 'Dark Background',
    description: 'Logo on dark background.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender
          meta={meta}
          blocks={blocks}
          block={block}
          style={{ backgroundColor: '#131313' }}
        >
          <Logo />
        </ComponentRender>
      )
    },
  },
  {
    name: 'Light Background',
    description: 'Logo on light background.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender
          meta={meta}
          blocks={blocks}
          block={block}
          style={{ backgroundColor: '#f5f5f5' }}
        >
          <Logo />
        </ComponentRender>
      )
    },
  },
]
