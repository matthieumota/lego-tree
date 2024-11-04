import cn from 'classnames'
import React, { MouseEvent } from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (event: MouseEvent) => void,
  children: React.ReactNode,
  className?: string
}

const Button: React.FC<Props> = ({ onClick, children, className, ...props }: Props): JSX.Element => {
  return (
    <button className={cn(`text-xs px-6 py-2 rounded-lg shadow bg-gray-100 hover:bg-gray-50 duration-300 disabled:opacity-50`, className)} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button
