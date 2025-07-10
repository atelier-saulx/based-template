import { ComponentRender } from '@based/docs'
import { TopBar } from './TopBar'

export const meta: Based.Stories.MetaDescriptor = {
  name: 'TopBar',
  group: 'Components',
  section: 'components',
  icon: 'edit',
  component: TopBar,
  subtitle: 'Navigation bar with logo and action buttons.',
  showApi: true,
  importSource: '@functions/app',
}

export const blocks: Based.Stories.BlocksDescriptor[] = [
  {
    name: 'Default',
    description: 'Standard topbar with navigation buttons.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <TopBar />
        </ComponentRender>
      )
    },
  },
  {
    name: 'Mobile View',
    description: 'Topbar responsive behavior on mobile.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender
          meta={meta}
          blocks={blocks}
          block={block}
          style={{ maxWidth: '480px' }}
        >
          <TopBar />
        </ComponentRender>
      )
    },
  },
  {
    name: 'Full Width',
    description: 'Topbar spanning full container width.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender
          meta={meta}
          blocks={blocks}
          block={block}
          style={{ width: '100%' }}
        >
          <TopBar />
        </ComponentRender>
      )
    },
  },
]
