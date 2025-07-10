import { ComponentRender } from '@based/docs'
import { Button } from './Button'

export const meta: Based.Stories.MetaDescriptor = {
  name: 'Button',
  group: 'Components',
  section: 'components',
  icon: 'edit',
  component: Button,
  subtitle: 'Primary button component with hover and disabled states.',
  showApi: true,
  importSource: '@functions/app',
}

export const blocks: Based.Stories.BlocksDescriptor[] = [
  {
    name: 'Default',
    description: 'Standard button with default styling.',
    style: {
      size: 'small',
    },
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Button>Click me</Button>
        </ComponentRender>
      )
    },
  },
  {
    name: 'Disabled',
    description: 'Button in disabled state.',
    style: {
      size: 'small',
    },
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Button disabled>Disabled</Button>
        </ComponentRender>
      )
    },
  },
  {
    name: 'Custom Styles',
    description: 'Button with custom inline styles.',
    style: {
      size: 'small',
    },
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Button
            style={{
              backgroundColor: '#28a745',
              padding: '1rem 2rem',
              fontSize: '1.2rem',
            }}
          >
            Custom Button
          </Button>
        </ComponentRender>
      )
    },
  },
  {
    name: 'With onClick',
    description: 'Button with click handler.',
    style: {
      size: 'small',
    },
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Button onClick={() => alert('Button clicked!')}>Click me!</Button>
        </ComponentRender>
      )
    },
  },
]
