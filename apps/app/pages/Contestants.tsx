import { styled } from 'inlines'
import { useQuery } from '@based/react'
import { TopBar } from '../components/TopBar'
import { Card } from '../components/Card'
import { Title } from '../components/Title'

export const Contestants = () => {
  const { data, loading } = useQuery('contestants')

  return (
    <styled.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#131313',
        width: '100%',
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
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
        }}
      >
        <styled.div
          style={{
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Title variant="h1" align="center" color="#bbb">
            Contestants
          </Title>
          {loading ? (
            <styled.div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                fontSize: '1.2rem',
                color: '#666',
                fontFamily: `"Inter", Arial, Helvetica, sans-serif`,
              }}
            >
              Loading contestants...
            </styled.div>
          ) : (
            <styled.div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
                '@media (max-width: 640px)': {
                  gridTemplateColumns: '1fr',
                },
              }}
            >
              {data?.map((contestant) => (
                <Card
                  key={contestant.id}
                  name={contestant.name}
                  song={contestant.song}
                  nationality={contestant.nationality}
                  lyrics={contestant.lyrics.en}
                />
              ))}
            </styled.div>
          )}
        </styled.div>
      </styled.div>
    </styled.div>
  )
}
