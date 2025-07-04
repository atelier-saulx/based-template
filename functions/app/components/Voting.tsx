import React, { useState } from 'react'
import { styled } from 'inlines'
import { useClient, useQuery } from '@based/react'

const VotingContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  backgroundColor: 'rgb(214, 214, 214)',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  width: '90%',
  maxWidth: '500px',
  margin: '2rem auto',
  '@media (max-width: 768px)': {
    width: '100%',
    height: '100vh',
    margin: '0',
    borderRadius: '0',
  },
})

const RadioGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  margin: '1rem 0',
})

const RadioLabel = styled('label', {
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

const RadioInput = styled('input', {
  cursor: 'pointer',
})

const Title = styled('h2', {
  marginBottom: '1.5rem',
  color: '#333',
  fontFamily: `"Inter", Arial, Helvetica, sans-serif`,
})

const Button = styled('button', {
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
  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  },
})

const InputContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  margin: '1rem 0',
  fontFamily: `"Inter", Arial, Helvetica, sans-serif`,
})

const InputLabel = styled('label', {
  marginBottom: '0.5rem',
  color: '#333',
  fontFamily: `"Inter", Arial, Helvetica, sans-serif`,
})

const EmailInput = styled('input', {
  fontFamily: `"Inter", Arial, Helvetica, sans-serif`,
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box',
  '&:focus': {
    borderColor: '#007bff',
    outline: 'none',
  },
})

export const Voting: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('')
  const [email, setEmail] = useState('')
  const client = useClient()
  const { data, loading } = useQuery('contestants')

  return (
    <VotingContainer>
      <Title>Cast Your Vote!</Title>
      <InputContainer>
        <InputLabel htmlFor="email">Email Address</InputLabel>
        <EmailInput
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </InputContainer>
      <RadioGroup>
        {loading
          ? 'loading...'
          : data?.map(({ name, id }) => (
              <RadioLabel key={id}>
                <RadioInput
                  type="radio"
                  name="voting"
                  value={id}
                  checked={Number(selectedOption) === id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSelectedOption(e.target.value)
                  }}
                />
                {name}
              </RadioLabel>
            ))}
      </RadioGroup>
      <Button
        onClick={(e) => {
          e.preventDefault()
          console.log('selected', selectedOption)
          client.call('submit-vote', { email, choice: Number(selectedOption) })
        }}
      >
        Submit Vote
      </Button>
    </VotingContainer>
  )
}
