import { styled } from 'inlines'

export const RadioGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  margin: '1rem 0',
})

export const RadioLabel = styled('label', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '6px',
  transition: 'background-color 0.15s',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
})

export const RadioInput = styled('input', {
  cursor: 'pointer',
})
