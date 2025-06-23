import { useQuery } from '@based/react'
import { styled } from 'inlines'
import { FunctionModule } from './FunctionModule'

export const Counter = () => {
  const { data: counter, loading } = useQuery('counter')
  const background: string =
    'linear-gradient(112.33deg,#ff1f85 -11.53%,#4b41ff 93.86%)'

  return (
    <FunctionModule name="'counter' query">
      <styled.h2
        style={{
          fontSize: '200px',
          margin: 0,
          paddingTop: '16px',
          background,
          color: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {loading ? '...' : counter}
      </styled.h2>
    </FunctionModule>
  )
}
