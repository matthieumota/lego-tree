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
  onDelete: (node: Node) => void,
  onEdit: (node: Node) => void,
  onDragStart: (node: Node) => void,
  onDrop: (node: Node, asParent: boolean) => void,
}

const NodeItem: React.FC<Props> = React.memo(({ node, level, onToggle, onDelete, onEdit, onDragStart, onDrop }: Props): JSX.Element => {
  console.log(`RENDU ${node.node_id}`)

  const handleDrop = (asParent: boolean) => {
    if (level === 2 && asParent) {
      return
    }

    onDrop(node, asParent)
  }

  return (
    <>
      <div className={cn(`border shadow rounded-lg mb-4`, {
        'ml-0': level == 0,
        'ml-8': level == 1,
        'ml-16': level == 2,
      })}>
        <div onClick={() => onToggle(node.node_id)} className="p-4 cursor-pointer flex items-center justify-between"
          draggable
          onDragStart={() => onDragStart(node)}
          onDrop={() => handleDrop(false)}
          onDragOver={(e) => e.preventDefault()}
        >
          <div>
            <span className="text-xl">{node.open ? '-' : '+'}{' '}</span>
            {node.name}{' '}
          </div>
          <div>
            <Badge status={node.status} />
          </div>
        </div>

        {node.open &&
          <div className="p-4" onDrop={() => handleDrop(true)} onDragOver={(e) => e.preventDefault()}>
            <div className="mb-4">
              <p className="text-gray-500 text-center">{node.description}</p>
              <p className="text-sm text-gray-500 text-center">{node.start_date} - {node.end_date}</p>
            </div>

            <div className="text-center flex gap-4 justify-center">
              <Button onClick={() => onEdit(node)}>Modifier</Button>
              <Button className="bg-red-600 hover:!bg-red-500 text-white" onClick={() => onDelete(node)}>Supprimer</Button>
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
