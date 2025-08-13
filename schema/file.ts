import type { SchemaType } from '@based/schema'

export const file: SchemaType = {
  name: 'string',
  src: {
    type: 'string',
    format: 'URL',
  },
  mimeType: 'string',
  description: 'string',
  progress: {
    type: 'number',
    display: 'ratio',
  },
  status: ['uploading', 'transcoding', 'ready', 'error'],
  statusText: 'string',
  size: 'int32',
  createdAt: {
    type: 'timestamp',
    on: 'create',
  },
  updatedAt: {
    type: 'timestamp',
    on: 'update',
  },
  thumbnail: {
    type: 'string',
    format: 'URL',
  },
  hls: {
    type: 'string',
    format: 'URL',
  },
  dash: {
    type: 'string',
    format: 'URL',
  },
  videoPreview: {
    type: 'string',
    format: 'URL',
  },
  selvaId: {
    type: 'alias',
    readOnly: true,
  }, // TODO: remove this once we stop relying on selva for file upload
}
