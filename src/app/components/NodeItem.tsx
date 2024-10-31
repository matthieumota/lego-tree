'use client'

import cn from 'classnames'
import React from 'react'
import { NodeClient } from './Tree'
import Badge from './Badge'

interface Props {
  node: NodeClient,
  level: number,
  onToggle: (nodeId: number) => void,
  onDelete: (nodeId: number) => void,
}

const NodeItem: React.FC<Props> = ({ node, level, onToggle, onDelete }: Props): JSX.Element => {
  return (
    <>
      <div className={cn(`border shadow rounded-lg mb-4`, {
        'ml-0': level == 0,
        'ml-8': level == 1,
        'ml-16': level == 2,
      })}>
        <div className="p-4 cursor-pointer flex justify-between">
          <div onClick={() => onToggle(node.node_id)} className="flex-1">
            {node.open ? '-' : '+'}{' '}
            {node.name}{' '}
          </div>
          <div>
            <Badge status={node.status} />
            <button onClick={() => onDelete(node.node_id)}>X</button>
          </div>
        </div>

        {node.open &&
          <div className="p-4">
            <p>{node.description}</p>
            <p>{node.start_date} - {node.end_date}</p>
          </div>
        }
      </div>

      {node.childrens.length > 0 && node.open &&
        <>
          {node.childrens.map((child) => (
            <NodeItem key={child.node_id} node={child} level={level + 1} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </>
      }
    </>
  )
}

export default NodeItem
