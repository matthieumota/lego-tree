'use client'

import cn from 'classnames'
import React, { DragEvent, useContext } from 'react'
import { Node } from './Tree'
import Badge from './Badge'
import Button from './Button'
import { GlobalContext } from '../context/TreeContext'

interface Props {
  node: Node,
  level: number,
  onToggle: (nodeId: number) => void,
  onDelete: (node: Node) => void,
  onEdit: (node: Node) => void,
  onDragStart: (node: Node) => void,
  onDrop: (node: Node, asParent: boolean) => void,
  onSelect: (node: Node, parent: Node | null) => void,
}

const NodeState: React.FC<{ node: Node }> = React.memo(({ node }) => {
  const { nodeOpened } = useContext(GlobalContext)

  return (
    <>
      {nodeOpened && nodeOpened.node_id === node.node_id ? 'Fermer' : 'Ouvrir'}
    </>
  )
})

NodeState.displayName = 'NodeState'

const NodeItem: React.FC<Props> = React.memo(({ node, level, onToggle, onDelete, onEdit, onDragStart, onDrop, onSelect }: Props): JSX.Element => {
  console.log(`RENDU ${node.node_id}`)

  const handleDrop = (event: DragEvent<Element>, asParent: boolean) => {
    event.stopPropagation()

    if (level === 2 && asParent) {
      return
    }

    onDrop(node, asParent)
  }

  return (
    <>
      <div className={cn(`border shadow rounded-lg mb-4`, {
        'bg-slate-50': node.type === 'Feature',
        'bg-green-50': node.type === 'User Story',
        'bg-blue-50': node.type === 'Task',
      })}>
        <div onClick={() => onToggle(node.node_id)} className="p-4 cursor-pointer flex items-center justify-between"
          draggable
          onDragStart={() => onDragStart(node)}
          onDrop={(e) => handleDrop(e, false)}
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
          <div className="p-4" onDrop={(e) => handleDrop(e, true)} onDragOver={(e) => e.preventDefault()}>
            <div className="mb-4">
            <p className="text-gray-500 text-center">{node.type}</p>
              <p className="text-gray-500 text-center">{node.description}</p>
              <p className="text-sm text-gray-500 text-center">{node.start_date} - {node.end_date}</p>
              <div className="text-center mt-4">
                <Button onClick={() => onSelect(node)}>
                  <NodeState node={node} />
                </Button>
              </div>
            </div>

            <div className="text-center flex gap-4 justify-center">
              <Button onClick={() => onEdit(node)}>Modifier</Button>
              <Button className="!bg-red-600 hover:!bg-red-500 text-white" onClick={() => onDelete(node)}>Supprimer</Button>
            </div>
          </div>
        }
      </div>

      {node.childrens.length > 0 && node.open &&
        <>
          {node.childrens.map((child) => (
            <NodeItem key={child.node_id} node={child} level={level + 1} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} onDragStart={onDragStart} onDrop={onDrop} onSelect={onSelect} />
          ))}
        </>
      }
    </>
  )
})

NodeItem.displayName = 'NodeItem'

export default NodeItem
