import React, { useState } from 'react'
import { styled } from 'inlines'
import { useQuery } from '@based/react'

const VotingContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  backgroundColor: 'white',
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
  transition: 'background-color 0.2s',
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
})

export const Voting: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('')
  const { data, loading } = useQuery('contestants')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value)
  }

  return (
    <VotingContainer>
      <Title>Cast Your Vote</Title>
      <RadioGroup>
        {data?.map(({ name }) => (
          <RadioLabel key={name}>
            <RadioInput
              type="radio"
              name="voting"
              value={name}
              checked={selectedOption === name}
              onChange={handleChange}
            />
            {name}
          </RadioLabel>
        ))}
      </RadioGroup>
    </VotingContainer>
  )
}
