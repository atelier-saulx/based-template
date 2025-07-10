import { styled } from 'inlines'

type CardProps = {
  name: string
  song: string
  nationality: string
  lyrics: string
}

export const Card = ({ name, song, nationality, lyrics }: CardProps) => {
  return (
    <styled.div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <styled.h3
        style={{
          fontFamily: `"Inter", Arial, Helvetica, sans-serif`,
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
          color: '#333',
        }}
      >
        {name}
      </styled.h3>
      <styled.p
        style={{
          fontFamily: `"Inter", Arial, Helvetica, sans-serif`,
          fontSize: '1rem',
          color: '#666',
          marginBottom: '0.25rem',
        }}
      >
        <styled.span style={{ fontWeight: '500' }}>Song:</styled.span> {song}
      </styled.p>
      <styled.p
        style={{
          fontFamily: `"Inter", Arial, Helvetica, sans-serif`,
          fontSize: '0.9rem',
          color: '#666',
          marginBottom: '1rem',
        }}
      >
        <styled.span style={{ fontWeight: '500' }}>Country:</styled.span> {nationality}
      </styled.p>
      <styled.div
        style={{
          borderTop: '1px solid #eee',
          paddingTop: '1rem',
        }}
      >
        <styled.p
          style={{
            fontFamily: `"Inter", Arial, Helvetica, sans-serif`,
            fontSize: '0.875rem',
            color: '#999',
            fontWeight: '500',
            marginBottom: '0.5rem',
          }}
        >
          Lyrics:
        </styled.p>
        <styled.p
          style={{
            fontFamily: `"Inter", Arial, Helvetica, sans-serif`,
            fontSize: '0.875rem',
            color: '#555',
            lineHeight: '1.5',
            maxHeight: '100px',
            overflow: 'hidden',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '30px',
              background: 'linear-gradient(transparent, white)',
            },
          }}
        >
          {lyrics}
        </styled.p>
      </styled.div>
    </styled.div>
  )
}