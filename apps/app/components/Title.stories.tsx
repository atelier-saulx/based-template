import { ComponentRender } from '@based/docs'
import { Title } from './Title'

export const meta: Based.Stories.MetaDescriptor = {
  name: 'Title',
  group: 'Components',
  section: 'components',
  icon: 'edit',
  component: Title,
  subtitle: 'Flexible title component with variant and alignment options.',
  showApi: true,
  importSource: '@functions/app',
}

export const blocks: Based.Stories.BlocksDescriptor[] = [
  {
    name: 'H2 Default',
    description: 'Default h2 title.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Title>Default Heading</Title>
        </ComponentRender>
      )
    },
  },
  {
    name: 'H1 Variant',
    description: 'Large h1 title.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Title variant="h1">Primary Heading</Title>
        </ComponentRender>
      )
    },
  },
  {
    name: 'Left Aligned',
    description: 'Title aligned to the left.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Title align="left">Left Aligned Title</Title>
        </ComponentRender>
      )
    },
  },
  {
    name: 'Center Aligned',
    description: 'Title aligned to the center.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Title align="center">Center Aligned Title</Title>
        </ComponentRender>
      )
    },
  },
  {
    name: 'Right Aligned',
    description: 'Title aligned to the right.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Title align="right">Right Aligned Title</Title>
        </ComponentRender>
      )
    },
  },
  {
    name: 'Custom Color',
    description: 'Title with custom color.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Title color="#3498db">Colored Title</Title>
        </ComponentRender>
      )
    },
  },
  {
    name: 'Custom Styles',
    description: 'Title with custom inline styles.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Title
            style={{
              textTransform: 'uppercase',
              letterSpacing: '2px',
              borderBottom: '2px solid #333',
              paddingBottom: '0.5rem',
            }}
          >
            Styled Title
          </Title>
        </ComponentRender>
      )
    },
  },
  {
    name: 'All Options',
    description: 'Title with all customization options.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Title
            variant="h1"
            align="center"
            color="#e74c3c"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            My song contest
          </Title>
        </ComponentRender>
      )
    },
  },
]
