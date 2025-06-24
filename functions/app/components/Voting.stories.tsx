import { useState } from 'react'
import { ComponentRender } from '@based/docs'
import { Voting } from './Voting'

export const meta: Based.Stories.MetaDescriptor = {
  name: 'Voting',
  group: 'Primitives',
  section: 'components',
  icon: 'edit',
  component: Voting,
  subtitle:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  showApi: true,
  //  showUsage: true,
  importSource: '@based/ui',
}

export const blocks: Based.Stories.BlocksDescriptor<typeof Voting>[] = [
  {
    name: 'Default',
    description: 'Et harum quidem rerum facilis est et expedita distinctio.',
    props: {},
    style: {
      size: '100%',
      frame: { inner: false },
      flex: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  },
]
