import { styled } from 'inlines'
import type { Style } from 'inlines'

type TitleProps = {
  variant?: 'h1' | 'h2'
  align?: 'left' | 'center' | 'right'
  color?: string
  style?: Style
  children?: React.ReactNode
}

export const Title = ({ variant = 'h2', align, color, style, children, ...props }: TitleProps) => {
  const baseStyles: Style = {
    marginBottom: '1.5rem',
    color: color || '#333',
    fontFamily: `"Inter", Arial, Helvetica, sans-serif`,
    textAlign: align,
    ...(variant === 'h1' && {
      fontSize: '2.5rem',
      fontWeight: '700',
    }),
    ...style,
  }

  const Component = variant === 'h1' ? styled.h1 : styled.h2
  
  return <Component style={baseStyles} {...props}>{children}</Component>
}
