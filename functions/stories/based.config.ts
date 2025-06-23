import type { BasedFunctionConfig } from '@based/functions'
import { storiesPlugin } from '@based/stories'

const config: BasedFunctionConfig = {
  type: 'app',
  name: 'stories',
  public: true,
  main: './app.tsx',
  path: '/stories/:path*',
  plugins: [
    storiesPlugin({
      debug: false,
    }),
  ],
}

export default config
