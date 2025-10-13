import type { DbClient } from '@based/sdk/db'
import type {
  BasedFunctionClient,
  BasedStreamFunction,
  BasedChannelPublishFunction,
} from '@based/sdk/functions'

enum FileStatus {
  // taken from based-cloud, would be nice to import it one day
  UPLOADING = 1,
  TRANSCODING = 2,
  READY = 3,
  ERROR = 4,
}

let liveSubs = 0

const subToUpdates = (
  based: BasedFunctionClient,
  selvaId: string,
  basedDbId: number,
  db: DbClient,
) => {
  liveSubs++
  console.info('added new sub, total subs:', liveSubs) // leave these logs in for a while to check for leaks
  const close = based
    .query('db', {
      $id: selvaId,
      progress: true,
      status: true,
      statusText: true,
    })
    .subscribe(async (data) => {
      const { progress, status, statusText } = data as {
        id: number
        progress: number
        status: FileStatus
        statusText: string
      }

      let statusEnum: string

      switch (status) {
        case FileStatus.READY:
          statusEnum = 'ready'
          break
        case FileStatus.TRANSCODING:
          statusEnum = 'transcoding'
          break
        case FileStatus.UPLOADING:
          statusEnum = 'uploading'
          break
        case FileStatus.ERROR:
          statusEnum = 'error'
          break
        default:
          statusEnum = 'error'
      }

      try {
        await db.update('file', basedDbId, {
          progress,
          statusText,
          status: statusEnum,
        })
        if (status === FileStatus.READY || status === FileStatus.ERROR) {
          liveSubs--
          console.info('removed sub, total subs:', liveSubs)
          close()
        }
      } catch (err) {
        console.error('error with file upload sub', err)
      }
    })
}

export default (async (based, streamPayload, ctx) => {
  const db = based.db
  const { stream, mimeType, size, fileName } = streamPayload
  const { id, src, hlsManifest, dashManifest, videoPreview, thumb } =
    await based.stream(
      'db:file-upload',
      { ...streamPayload, contents: stream },
      ctx,
    )

  const basedDbId = await db.create('file', {
    name: fileName,
    size,
    progress: 0,
    status: 'uploading',
    statusText: 'uploading',
    mimeType,
    src,
    hls: hlsManifest || undefined,
    dash: dashManifest || undefined,
    videoPreview: videoPreview || undefined,
    thumbnail: thumb || undefined,
    selvaId: id,
  })

  subToUpdates(based, id, basedDbId, db)
}) as BasedStreamFunction
