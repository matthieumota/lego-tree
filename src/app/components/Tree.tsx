'use client'

import React, { useCallback, useRef, useState } from 'react'
import NodeItem from './NodeItem'

let nextId = 106

export interface Node {
  node_id: number
  name: string
  type: string
  status: string
  description: string
  start_date: string
  end_date: string
  childrens: Array<Node>
  open: boolean
}

const nodesEqual = (a: Array<Node>, b: Array<Node>): boolean => {
  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i].open !== b[i].open || a[i].name !== b[i].name) {
      return false
    }

    if (!nodesEqual(a[i].childrens, b[i].childrens)) {
      return false
    }
  }

  return true
}

const updateAllNode = (nodes: Array<Node>, update: Partial<Node>): Array<Node> => {
  return nodes.map((node: Node) => ({
    ...node, ...update , childrens: updateAllNode(node.childrens, update)
  }))
}

const updateNode = (nodes: Array<Node>, id: number, update: (node: Node) => Partial<Node>): Array<Node> => {
  return nodes.map((node: Node) => {
    if (node.node_id === id) {
      return { ...node, ...update(node) }
    }

    if (node.childrens) {
      const updatedChildrens = updateNode(node.childrens, id, update)

      if (!nodesEqual(updatedChildrens, node.childrens)) {
        return { ...node, childrens: updatedChildrens }
      }
    }

    return node
  })
}

const deleteNode = (nodes: Array<Node>, id: number): Array<Node> => {
  return nodes.map((node: Node) => {
    if (node.node_id == id) {
      return null
    }

    if (node.childrens) {
      const deletedChildrens = deleteNode(node.childrens, id)

      if (!nodesEqual(deletedChildrens, node.childrens)) {
        return { ...node, childrens: deletedChildrens }
      }
    }

    return node
  }).filter(n => n != null)
}

const addNode = (nodes: Array<Node>, parent: number | null, newNode: Node): Array<Node> => {
  if (!parent) {
    return [ ...nodes, newNode ]
  }

  return nodes.map((node: Node) => {
    if (node.node_id == parent) {
      return { ...node, childrens: [...node.childrens, newNode] }
    }

    if (node.childrens) {
      const addedChildrens = addNode(node.childrens, parent, newNode)

      if (!nodesEqual(addedChildrens, node.childrens)) {
        return { ...node, childrens: addedChildrens }
      }
    }

    return node
  })
}

const findNode = (nodes: Array<Node>, id: number): Node | null => {
  for (let node of nodes) {
    if (node.node_id == id) {
      return node
    }

    if (node.childrens) {
      const found = findNode(node.childrens, id)

      if (found) {
        return found
      }
    }
  }

  return null
}

const insertNode = (nodes: Array<Node>, target: Node | null, newNode: Node, status: string | null): Array<Node> => {
  if (target === null) {
    newNode.status = status ? status : newNode.status
    return [...nodes, newNode]
  }

  const index = nodes.findIndex(node => node.node_id == target.node_id)

  if (index != -1) {
    const newNodes = [ ...nodes ]
    if (newNode.type === 'Feature') {
      newNode.status = target.status
    }
    newNodes.splice(index, 0, newNode)

    return newNodes
  }

  return nodes.map((node: Node) => {
    if (node.childrens) {
      const insertedChildrens = insertNode(node.childrens, target, newNode, status)

      if (!nodesEqual(insertedChildrens, node.childrens)) {
        return { ...node, childrens: insertedChildrens }
      }
    }

    return node
  })
}

const moveNode = (nodes: Array<Node>, node: Node, target: Node | null, status: string | null): Array<Node> => {
  return insertNode(deleteNode(nodes, node.node_id), target ? target : null, node, status)
}

interface Props {
  nodes: Array<Node>
}

const Tree: React.FC<Props> = ({ nodes }: Props): JSX.Element => {
  const [features, setFeatures] = useState<Node[]>(updateAllNode(nodes, { open: false }))
  const dragged = useRef<Node>()

  const toggleOpen = useCallback((nodeId: number) => {
    setFeatures(f => updateNode(f, nodeId, (node) => ({
      open: !node.open,
    })))
  }, [])

  const handleDelete = useCallback((nodeId: number) => {
    setFeatures(f => deleteNode(f, nodeId))
  }, [])

  const handleEdit = useCallback((nodeId: number, newNode: Partial<Node>) => {
    setFeatures(f => updateNode(f, nodeId, () => (newNode)))
  }, [])

  const handleDragStart = useCallback((node: Node) => {
    dragged.current = node
  }, [])

  const handleDrop = useCallback((node: Node | null, status: string | null = null) => {
    if (dragged.current && dragged.current.node_id !== node?.node_id) {
      setFeatures(f => moveNode(f, dragged.current as Node, node, status))
    }
  }, [])

  const handleAdd = (parent: number | null, newNode: Node) => {
    setFeatures(addNode(features, parent, newNode))
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {['Backlog', 'In Progress', 'In Review', 'Done'].map(status =>
          <div key={status}
            onDrop={(e) => {
              e.preventDefault()
              if (features.filter(f => f.status === status).length === 0) {
                handleDrop(null, status)
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <h2 className="mb-3 text-center font-bold text-lg">{status}</h2>
            {features.filter(f => f.status === status).map((node: Node) =>
              <NodeItem
                key={node.node_id}
                node={node}
                level={0}
                onToggle={toggleOpen}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
              />
            )}
          </div>
        )}
      </div>
      <button onClick={() => handleAdd(null, { name: 'test', node_id: nextId++, type: 'Feature', description: 'ok', childrens: [], start_date: '', end_date: '', status: "Backlog", open: true })}>Ajouter</button>
    </>
  )
}

export default Tree
