import { ComponentRender } from '@based/docs'
import { RadioGroup, RadioLabel, RadioInput } from './Radio'

export const meta: Based.Stories.MetaDescriptor = {
  name: 'Radio',
  group: 'Components',
  section: 'components',
  icon: 'edit',
  component: RadioGroup,
  subtitle: 'Radio button components for single selection.',
  showApi: true,
  importSource: '@functions/app',
}

export const blocks: Based.Stories.BlocksDescriptor[] = [
  {
    name: 'Single Option',
    description: 'Radio group with single option.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <RadioGroup>
            <RadioLabel>
              <RadioInput type="radio" name="option" value="single" />
              Single Option
            </RadioLabel>
          </RadioGroup>
        </ComponentRender>
      )
    },
  },
  {
    name: 'Multiple Options',
    description: 'Radio group with multiple options.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="choice"
                value="option1"
                defaultChecked
              />
              Option 1
            </RadioLabel>
            <RadioLabel>
              <RadioInput type="radio" name="choice" value="option2" />
              Option 2
            </RadioLabel>
            <RadioLabel>
              <RadioInput type="radio" name="choice" value="option3" />
              Option 3
            </RadioLabel>
          </RadioGroup>
        </ComponentRender>
      )
    },
  },
  {
    name: 'Disabled Options',
    description: 'Radio group with disabled options.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <RadioGroup>
            <RadioLabel>
              <RadioInput type="radio" name="disabled" value="enabled" />
              Enabled Option
            </RadioLabel>
            <RadioLabel style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              <RadioInput
                type="radio"
                name="disabled"
                value="disabled"
                disabled
              />
              Disabled Option
            </RadioLabel>
          </RadioGroup>
        </ComponentRender>
      )
    },
  },
  {
    name: 'Custom Styling',
    description: 'Radio group with custom styles.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <RadioGroup style={{ gap: '2rem' }}>
            <RadioLabel style={{ padding: '1rem', backgroundColor: '#e3f2fd' }}>
              <RadioInput type="radio" name="styled" value="blue" />
              Blue Theme
            </RadioLabel>
            <RadioLabel style={{ padding: '1rem', backgroundColor: '#f3e5f5' }}>
              <RadioInput type="radio" name="styled" value="purple" />
              Purple Theme
            </RadioLabel>
          </RadioGroup>
        </ComponentRender>
      )
    },
  },
]
