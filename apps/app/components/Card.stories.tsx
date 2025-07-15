import { ComponentRender } from '@based/docs'
import { Card } from './Card'

export const meta: Based.Stories.MetaDescriptor = {
  name: 'Card',
  group: 'Components',
  section: 'components',
  icon: 'edit',
  component: Card,
  subtitle:
    'Eurovision contestant card displaying artist information and lyrics.',
  showApi: true,
  importSource: '@functions/app',
}

export const blocks: Based.Stories.BlocksDescriptor[] = [
  {
    name: 'Default',
    description: 'Standard card with typical contestant information.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Card
            name="John Doe"
            song="Amazing Song"
            nationality="Sweden"
            lyrics="These are the lyrics to an amazing song that will win Eurovision. The melody is catchy and the performance is stunning."
          />
        </ComponentRender>
      )
    },
  },
  {
    name: 'Long Lyrics',
    description: 'Card with extensive lyrics showing truncation.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Card
            name="Maria Garcia"
            song="Dreams Come True"
            nationality="Spain"
            lyrics="Verse 1: In the morning light, I see the world anew, Every dream I had is coming into view. The stars aligned, the moment is here, With every heartbeat, I conquer my fear. Chorus: Dreams come true when you believe, In the magic that you can achieve. Rise above, reach for the sky, On wings of hope, we learn to fly. Verse 2: Through the darkest nights, I kept the faith alive, Now I stand here strong, ready to thrive."
          />
        </ComponentRender>
      )
    },
  },
  {
    name: 'Minimal Info',
    description: 'Card with minimal contestant information.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Card
            name="Alex"
            song="Untitled"
            nationality="TBD"
            lyrics="Lyrics not available."
          />
        </ComponentRender>
      )
    },
  },
  {
    name: 'Special Characters',
    description: 'Card with special characters and emojis.',
    render: ({ meta, blocks, block }) => {
      return (
        <ComponentRender meta={meta} blocks={blocks} block={block}>
          <Card
            name="Björk Guðmundsdóttir"
            song="❤️ Love & Peace ☮️"
            nationality="Iceland 🇮🇸"
            lyrics="♪ ♫ Music speaks where words fail ♬ ♭"
          />
        </ComponentRender>
      )
    },
  },
]
