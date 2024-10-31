import cn from 'classnames'
import React from 'react'

interface Props {
  status: string,
}

const Badge: React.FC<Props> = ({ status }: Props): JSX.Element => {
  return (
    <span className={cn(`px-6 py-2 rounded-full shadow`, {
      'bg-green-400': status === 'Done',
    })}>
      {status}
    </span>
  )
}

export default Badge
