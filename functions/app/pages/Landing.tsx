import { styled } from 'inlines'
import { TopBar } from '../components/TopBar'
import { Voting } from '../components/Voting'

export const Landing = () => {
  return (
    <styled.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        background: '#131313',
      }}
    >
      <styled.div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          width: '100%',
        }}
      >
        <TopBar />
      </styled.div>
      <styled.div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
        }}
      >
        <Voting />
      </styled.div>
    </styled.div>
  )
}
