import { styled } from 'inlines'

export const Button = styled('button', {
  fontFamily: `"Inter", Arial, Helvetica, sans-serif`,
  padding: '0.75rem 1.5rem',
  backgroundColor: 'rgb(61, 138, 247)',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '500',
  transition: 'background-color 0.15s',
  marginTop: '1rem',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  },
  '@media (max-width: 480px)': {
    padding: '0.6rem 1rem',
    fontSize: '0.9rem',
  },
})
