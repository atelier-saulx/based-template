import type { BasedClient } from '@based/client'
import { useClient } from '@based/react'
import { useEffect, useState } from 'react'
import { FunctionModule } from './FunctionModule'
import { styled } from 'inlines'

export const Greetings = () => {
  const [stateValue, setStateValue] = useState('')
  const [loaded, setLoaded] = useState(false)
  const based: BasedClient = useClient()

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement> | null,
  ) => {
    const result: string = await based.call('hello', event?.target.value ?? '')

    setStateValue(result)
  }

  useEffect(() => {
    if (!loaded) {
      handleChange(null)
    }

    setLoaded(true)
  })

  return (
    <FunctionModule name="'hello' function">
      <styled.h2
        style={{
          color: '#bbbbbb',
          fontSize: '20pt',
          margin: '16px',
          height: '70px',
        }}
      >
        {stateValue}
      </styled.h2>
      <styled.input
        type="text"
        onChange={handleChange}
        placeholder="Whats your name?"
        style={{
          borderRadius: '16px',
          border: 0,
          color: '#000000',
          textAlign: 'center',
          padding: '16px',
          fontSize: '20px',
        }}
      />
    </FunctionModule>
  )
}
