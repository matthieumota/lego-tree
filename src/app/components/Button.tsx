import cn from 'classnames'
import React, { MouseEvent } from 'react'

interface Props {
  onClick: (event: MouseEvent) => void,
  children: React.ReactNode,
  className?: string
}

const Button: React.FC<Props> = ({ onClick, children, className }: Props): JSX.Element => {
  return (
    <button className={cn(`px-6 py-2 rounded-lg shadow`, className)} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
