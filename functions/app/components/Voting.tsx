import React, { useEffect, useState, useRef } from 'react'
import { styled } from 'inlines'
import { useClient, useQuery } from '@based/react'
import { Button } from './Button'
import { Title } from './Title'
import { RadioGroup, RadioInput, RadioLabel } from './Radio'

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

const DEFAULT_BUTTON_TEXT = 'Submit vote'

export const Voting: React.FC = () => {
  const [buttonText, setButtonText] = useState(DEFAULT_BUTTON_TEXT)
  const [selectedOption, setSelectedOption] = useState('')
  const [email, setEmail] = useState('')
  const client = useClient()
  const { data, loading } = useQuery('contestants')
  const timerRef = useRef<NodeJS.Timeout>(null)

  useEffect(() => {
    if (buttonText !== DEFAULT_BUTTON_TEXT) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        setButtonText(DEFAULT_BUTTON_TEXT)
        timerRef.current = null
      }, 2000)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [buttonText])

  return (
    <styled.div
      style={{
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
      }}
    >
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
        disabled={!email || !selectedOption}
        onClick={(e) => {
          e.preventDefault()
          client
            .call('submit-vote', { email, choice: Number(selectedOption) })
            .then(() => {
              setSelectedOption('')
              setEmail('')
              setButtonText('Thank you! 🤗')
            })
        }}
      >
        {buttonText}
      </Button>
    </styled.div>
  )
}
