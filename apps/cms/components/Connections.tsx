import { useQuery } from '@based/react'
import { Text } from '@based/ui'
import { styled } from 'inlines'

const Centered = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const Connections = () => {
  const { data = 0, loading } = useQuery('active-users')
  if (loading) {
    return (
      <Centered>
        <Text>Loading...</Text>
      </Centered>
    )
  }
  return (
    <Centered>
      <Text variant="heading-bold">Users connected: {data}</Text>
    </Centered>
  )
}
