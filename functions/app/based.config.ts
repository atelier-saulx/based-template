import type { BasedFunctionConfig } from '@based/functions'

const config: BasedFunctionConfig = {
  type: 'app',
  name: 'app',
  public: true,
  main: './app.tsx',
  path: '/:path*',
}

export default config
