import { styled } from 'inlines'
import { Logo } from './Logo.js'
import { Button } from './Button.js'
import { useLocation } from 'wouter'

export const TopBar = () => {
  const [, setLocation] = useLocation()

  return (
    <styled.div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 80,
        width: '100%',
        padding: '0 30px',
        background: '#131313',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        boxSizing: 'border-box',
        '@media (max-width: 480px)': {
          padding: '0 15px',
        },
        borderBottom: '1px solid grey',
      }}
    >
      <Logo />
      <styled.div
        style={{
          display: 'flex',
          gap: '1rem',
          flexShrink: 0,
          alignItems: 'center',
          '@media (max-width: 480px)': {
            gap: '0.5rem',
          },
        }}
      >
        <Button style={{ marginTop: 0 }} onClick={() => setLocation('/vote')}>
          Vote now
        </Button>
        <Button
          style={{ marginTop: 0 }}
          onClick={() => setLocation('/contestant-cards')}
        >
          Contestants
        </Button>
      </styled.div>
    </styled.div>
  )
}
