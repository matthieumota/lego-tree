'use client'

import cn from 'classnames'
import React from 'react'
import { Node } from './Tree'
import Badge from './Badge'
import Button from './Button'

interface Props {
  node: Node,
  level: number,
  onToggle: (nodeId: number) => void,
  onDelete: (nodeId: number) => void,
  onEdit: (nodeId: number, node: Partial<Node>) => void,
  onDragStart: (node: Node) => void,
  onDrop: (node: Node, asParent: boolean) => void,
}

const NodeItem: React.FC<Props> = React.memo(({ node, level, onToggle, onDelete, onEdit, onDragStart, onDrop }: Props): JSX.Element => {
  console.log(`RENDU ${node.node_id}`)

  return (
    <>
      <div className={cn(`border shadow rounded-lg mb-4`, {
        'ml-0': level == 0,
        'ml-8': level == 1,
        'ml-16': level == 2,
      })}>
        <div onClick={() => onToggle(node.node_id)} className="p-4 cursor-pointer flex justify-between"
          draggable
          onDragStart={() => onDragStart(node)}
          onDrop={() => onDrop(node, false)}
          onDragOver={(e) => e.preventDefault()}
        >
          <div>
            {node.open ? '-' : '+'}{' '}
            {node.name}{' '}
          </div>
          <div>
            <Badge status={node.status} />
          </div>
        </div>

        {node.open &&
          <div className="p-4" onDrop={() => onDrop(node, true)} onDragOver={(e) => e.preventDefault()}>
            <div className="mb-4">
              <p className="text-gray-500 text-center">{node.description}</p>
              <p className="text-sm text-gray-500 text-center">{node.start_date} - {node.end_date}</p>
            </div>

            <div className="text-center flex gap-4 justify-center">
              <Button onClick={() => onEdit(node.node_id, { name: 'test' })}>Modifier</Button>
              <Button className="bg-red-400" onClick={() => onDelete(node.node_id)}>X</Button>
            </div>
          </div>
        }
      </div>

      {node.childrens.length > 0 && node.open &&
        <>
          {node.childrens.map((child) => (
            <NodeItem key={child.node_id} node={child} level={level + 1} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} onDragStart={onDragStart} onDrop={onDrop} />
          ))}
        </>
      }
    </>
  )
})

export default NodeItem
