import cn from 'classnames'
import React from 'react'

interface Props {
  status: string,
}

const Badge: React.FC<Props> = ({ status }: Props): JSX.Element => {
  return (
    <span className={cn(`px-6 py-2 rounded-full shadow`, {
      'bg-gray-400': status === 'To Do',
      'bg-blue-400': status === 'Backlog',
      'bg-slate-400': status === 'In Progress',
      'bg-red-400': status === 'In Review',
      'bg-green-400': status === 'Done',
    })}>
      {status}
    </span>
  )
}

export default Badge
