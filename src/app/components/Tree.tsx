'use client'

import React, { useState } from 'react'
import NodeItem from './NodeItem'
import { Node } from '../api/nodes/route'

let nextId = 106

export interface NodeClient extends Node {
  childrens: Array<NodeClient>
  open: boolean
}

const updateAllNode = (nodes: Array<NodeClient>, update: Partial<NodeClient>): Array<NodeClient> => {
  return nodes.map((node: NodeClient) => ({
    ...node, ...update , childrens: updateAllNode(node.childrens, update)
  }))
}

const updateNode = (nodes: Array<NodeClient>, id: number, update: (node: NodeClient) => Partial<NodeClient>): Array<NodeClient> => {
  return nodes.map((node: NodeClient) => {
    if (node.node_id === id) {
      return { ...node, ...update(node) }
    }

    if (node.childrens) {
      return { ...node, childrens: updateNode(node.childrens, id, update) }
    }

    return node
  })
}

const deleteNode = (nodes: Array<NodeClient>, id: number): Array<NodeClient> => {
  return nodes.map((node: NodeClient) => {
    if (node.node_id === id) {
      return null
    }

    if (node.childrens) {
      return { ...node, childrens: deleteNode(node.childrens, id) }
    }

    return node
  }).filter(n => n != null)
}

const addNode = (nodes: Array<NodeClient>, parentId: number | null, newNode: NodeClient): Array<NodeClient> => {
  if (!parentId) {
    return [ ...nodes, newNode ]
  }

  return nodes.map((node: NodeClient) => {
    if (node.node_id == parentId) {
      return { ...node, childrens: [...node.childrens, newNode] }
    }

    if (node.childrens) {
      return { ...node, childrens: addNode(node.childrens, parentId, newNode) }
    }

    return node
  })
}

interface Props {
  nodes: Array<NodeClient>
}

const Tree: React.FC<Props> = ({ nodes }: Props): JSX.Element => {
  const [features, setFeatures] = useState<NodeClient[]>(updateAllNode(nodes, { open: false }))

  const toggleOpen = (nodeId: number) => {
    setFeatures(updateNode(features, nodeId, (node) => ({
      open: !node.open,
    })))
  }

  const handleDelete = (nodeId: number) => {
    setFeatures(deleteNode(features, nodeId))
  }

  const handleEdit = (nodeId: number, newNode: Partial<NodeClient>) => {
    setFeatures(updateNode(features, nodeId, () => (newNode)))
  }

  const handleAdd = (parent: number | null, newNode: NodeClient) => {
    setFeatures(addNode(features, parent, newNode))
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {['Backlog', 'In Progress', 'In Review', 'Done'].map(status =>
        <div key={status}>
          <h2 className="mb-3 text-center font-bold text-lg">{status}</h2>
          {features.filter(f => f.status === status).map((node: NodeClient) =>
            <NodeItem
              key={node.node_id}
              node={node}
              level={0}
              onToggle={toggleOpen}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
          <button onClick={() => handleAdd(45, { name: 'test', node_id: nextId++, type: 'Feature', description: 'ok', childrens: [], start_date: '', end_date: '', status, open: true })}>Ajouter</button>
        </div>
      )}
    </div>
  )
}

export default Tree
