'use client'

import React, { useState } from 'react'
import NodeItem from './NodeItem'
import { Node } from '../api/nodes/route'

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

    return node;
  }).filter(n => n != null)
}

const SubTree: React.FC<{
  nodes: Array<NodeClient>, title: string, onToggle: (nodeId: number) => void, onDelete: (nodeId: number) => void
}> = ({ nodes, title, onToggle, onDelete }): JSX.Element => (
  <div>
    <h2 className="mb-3 text-center font-bold text-lg">{title}</h2>
    {nodes.map((node: NodeClient) =>
      <NodeItem
        key={node.node_id}
        node={node}
        level={0}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    )}
  </div>
)

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

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {['Backlog', 'In Progress', 'In Review', 'Done'].map(status =>
        <div key={status}>
          <SubTree nodes={features.filter(f => f.status === status)} title={status} onToggle={toggleOpen} onDelete={handleDelete} />
        </div>
      )}
    </div>
  )
}

export default Tree
