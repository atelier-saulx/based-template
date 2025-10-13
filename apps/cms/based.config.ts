import type { BasedFunctionConfig } from '@based/sdk/functions'

const config: BasedFunctionConfig = {
  type: 'app',
  name: 'cms',
  public: true,
  main: './app.tsx',
  path: '/cms/:path*',
  favicon: './favicon.ico',
}

export default config
