import cn from 'classnames'
import React from 'react'

interface Props {
  status: string,
}

const Badge: React.FC<Props> = ({ status }: Props): JSX.Element => {
  return (
    <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
      <svg className={cn(`h-1.5 w-1.5`, {
      'fill-gray-400': status === 'To Do',
      'fill-blue-400': status === 'Backlog',
      'fill-slate-400': status === 'In Progress',
      'fill-red-500': status === 'In Review',
      'fill-green-400': status === 'Done',
    })} viewBox="0 0 6 6" aria-hidden="true">
        <circle cx="3" cy="3" r="3" />
      </svg>
      {status}
    </span>
  )
}

export default Badge
