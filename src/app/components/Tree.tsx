'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import NodeItem from './NodeItem'
import Button from './Button'
import DeleteModal from './DeleteModal'
import NodeModal from './NodeModal'
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual'
import cn from 'classnames'
import NodeDisplay from './NodeDisplay'
import { GlobalContext, GlobalContextType, TreeContext, TreeContextType } from '../context/TreeContext'

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
    if (a[i].name !== b[i].name ||
        a[i].type !== b[i].type ||
        a[i].status !== b[i].status ||
        a[i].description !== b[i].description ||
        a[i].start_date !== b[i].start_date ||
        a[i].end_date !== b[i].end_date ||
        a[i].open !== b[i].open) {
      return false
    }

    if (!nodesEqual(a[i].childrens, b[i].childrens)) {
      return false
    }
  }

  return true
}

const findNode = (nodes: Array<Node>, id: number): Node | null => {
  for (const node of nodes) {
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

export const findParentNode = (nodes: Array<Node>, id: number): Node | null => {
  for (const node of nodes) {
    if (node.childrens.some(child => child.node_id === id)) {
      return node
    }

    const parent = findParentNode(node.childrens, id)
    if (parent) {
      return parent
    }
  }

  return null
}

const updateAllNode = (nodes: Array<Node>, update: Partial<Node>): Array<Node> => {
  return nodes.map((node: Node) => ({
    ...node, ...update , childrens: updateAllNode(node.childrens, update)
  }))
}

const updateNode = (nodes: Array<Node>, ids: Array<number>, update: (node: Node) => Partial<Node>): Array<Node> => {
  return nodes.map((node: Node) => {
    const updatedNode = (ids.includes(node.node_id)) ? { ...node, ...update(node) } : node

    if (updatedNode.childrens) {
      const updatedChildrens = updateNode(node.childrens, ids, update)

      if (!nodesEqual(updatedChildrens, node.childrens)) {
        return { ...updatedNode, childrens: updatedChildrens }
      }
    }

    return updatedNode
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

const findNodeIndex = (nodes: Array<Node>, id: number): number => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].node_id === id) {
      return i
    }

    const childIndex = findNodeIndex(nodes[i].childrens, id)
    if (childIndex !== -1) {
      return childIndex
    }
  }

  return -1
}

const insertNode = (nodes: Array<Node>, target: Node | null, newNode: Node, isAbove: boolean = false): Array<Node> => {
  if (target === null) {
    return [...nodes, newNode]
  }

  const index = nodes.findIndex(node => node.node_id == target.node_id)

  if (index != -1) {
    const newNodes = [ ...nodes ]
    newNodes.splice(isAbove ? index : index + 1, 0, newNode)

    return newNodes
  }

  return nodes.map((node: Node) => {
    if (node.childrens) {
      const insertedChildrens = insertNode(node.childrens, target, newNode, isAbove)

      if (!nodesEqual(insertedChildrens, node.childrens)) {
        return { ...node, childrens: insertedChildrens }
      }
    }

    return node
  })
}

const isChild = (nodes: Array<Node>, target: Node | null): boolean => {
  if (!target) {
    return false
  }

  for (const node of nodes) {
    if (node.node_id === target.node_id) {
      return true
    }

    if (node.childrens) {
      if (isChild(node.childrens, target)) {
        return true
      }
    }
  }

  return false
}

const isFirst = (nodes: Array<Node>, node: Node | null): boolean => {
  if (!node) {
    return true
  }

  for (const n of nodes) {
    if (n.node_id === node.node_id) {
      return true
    }
  }

  return false
}

const moveNode = (nodes: Array<Node>, node: Node, target: Node | null, asParent: boolean = false, isAbove: boolean = false): Array<Node> => {
  if (isChild(node.childrens, target)) {
    return nodes
  }

  if (asParent) {
    return addNode(deleteNode(nodes, node.node_id), target ? target.node_id : null, node)
  }

  return insertNode(deleteNode(nodes, node.node_id), target ? target : null, node, isAbove)
}

interface Props {
  nodes: Array<Node>
}

const Tree: React.FC<Props> = ({ nodes }: Props): JSX.Element => {
  const [features, setFeatures] = useState<Node[]>(updateAllNode(nodes, { open: false }))
  const parentRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const dragged = useRef<Node>()
  const [nodeToBeEdited, setNodeToBeEdited] = useState<Node | null>(null)
  const [nodeToBeDeleted, setNodeToBeDeleted] = useState<Node | null>(null)
  const [nodeOpened, setNodeOpened] = useState<Node | null>(null)
  const [parentNode, setParentNode] = useState<Node | null>(null)

  useEffect(() => {
    setNodeOpened(n => {
      if (n) {
        const updatedNode = findNode(features, n.node_id)

        if (updatedNode) {
          return updatedNode
        }
      }

      return n
    })
  }, [features])

  const toggleOpen = useCallback((nodeId: number) => {
    setFeatures(f => updateNode(f, [nodeId], (node) => ({
      open: !node.open,
    })))
  }, [])

  const handleDelete = useCallback((node: Node) => {
    setNodeToBeDeleted(node)
  }, [])

  const handleEdit = useCallback((node: Node) => {
    setNodeToBeEdited(node)
  }, [])

  const handleDragStart = useCallback((node: Node) => {
    dragged.current = node
  }, [])

  const handleDrop = useCallback((node: Node | null, asParent: boolean = false, status: string | null = null) => {
    if (dragged.current && dragged.current.node_id !== node?.node_id) {
      const sourceNode = dragged.current

      setFeatures(f => {
        if (!asParent && isFirst(f, node)) {
          sourceNode.status = node?.status || status || sourceNode.status
        }

        let isAbove = true

        if (node) {
          const sourceIndex = findNodeIndex(f, sourceNode.node_id)
          const nodeIndex = findNodeIndex(f, node.node_id)

          if (sourceIndex < nodeIndex) {
            isAbove = false
          }
        }

        return moveNode(f, sourceNode, node, asParent, isAbove)
      })
    }
  }, [])

  const handleSelect = useCallback((node: Node, parent: Node | null) => {
    setNodeOpened(n => n && n.node_id === node.node_id ? null : node)
    setParentNode(parent)
  }, [])

  const handleParent = (node: Node) => {
    const parent = findParentNode(features, node.node_id)
    setNodeOpened(node)
    setParentNode(parent)
  }

  const handleClose = () => {
    setNodeOpened(null)
    setParentNode(null)
  }

  const handleAdd = (parent: number | null, newNode: Node) => {
    setFeatures(addNode(features, parent, newNode))
  }

  const filteredNodes = useMemo(() => (
    ['Backlog', 'In Progress', 'In Review', 'Done'].map(status => ({
      status,
      nodes: features.filter(f => f.status === status),
    }))
  ), [features])

  const confirmEdit = (newNode: Partial<Node>) => {
    if (nodeToBeEdited) {
      setFeatures(f => updateNode(f, [nodeToBeEdited.node_id], () => (newNode)))
      setNodeToBeEdited(null)
    } else if (nodeOpened) {
      setFeatures(f => updateNode(f, [nodeOpened.node_id], () => (newNode)))
    }
  }

  const cancelEdit = () => {
    setNodeToBeEdited(null)
  }

  const confirmDelete = () => {
    if (nodeToBeDeleted) {
      setFeatures(f => deleteNode(f, nodeToBeDeleted.node_id))
      setNodeToBeDeleted(null)
    }
  }

  const estimateSize = (node: Node) => {
    const baseSize = node.open ? 270 : 80
    let totalSize = baseSize

    if (node.open) {
      totalSize += node.childrens.reduce((t, n) => t + estimateSize(n), 0)
    }

    return totalSize
  }

  interface VirtualizerRef {
    getVirtualItems: () => VirtualItem[]
    measureElement: (element: HTMLElement) => void
    getTotalSize: () => number
    measure: () => void
  }

  const virtualizers = useRef<Record<string, VirtualizerRef>>({})

  filteredNodes.forEach(({ status, nodes }) => {
    virtualizers.current[status] = useVirtualizer({
      count: nodes.length,
      getScrollElement: () => parentRefs.current[status],
      estimateSize: (index) => estimateSize(nodes[index]),
    })
  })

  useEffect(() => {
    Object.keys(virtualizers.current).forEach(status => {
      virtualizers.current[status].measure()
    })
  }, [filteredNodes])

  const globalContext: GlobalContextType = useMemo(() => ({
    nodeOpened
  }), [nodeOpened])

  const treeContext: TreeContextType = useMemo(() => ({
    onToggle: toggleOpen,
    onDelete: handleDelete,
    onEdit: handleEdit,
    onDragStart: handleDragStart,
    onDrop: handleDrop,
    onSelect: handleSelect,
  }), [toggleOpen, handleDelete, handleEdit, handleDragStart, handleDrop, handleSelect])

  return (
    <>
      <GlobalContext.Provider value={globalContext}>
        <TreeContext.Provider value={treeContext}>
          <div className={cn({'grid lg:grid-cols-8 gap-12': nodeOpened})}>
            <div className="col-span-6">
              <h1 className="text-center mb-12 text-3xl font-bold">LEGO Tree Challenge</h1>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNodes.map(({ status, nodes }) => {
                  return (
                    <div key={status}
                      onDrop={(e) => {
                        e.preventDefault()
                        handleDrop(null, false, status)
                      }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <h2 className="mb-3 text-center font-bold text-lg">{status}</h2>
                      <div ref={(el) => parentRefs.current[status] = el} style={{ height: 550, overflow: 'auto' }}>
                        <div style={{
                          height: `${virtualizers.current[status].getTotalSize()}px`,
                          position: 'relative',
                        }}>
                          {virtualizers.current[status].getVirtualItems().map((virtualItem: VirtualItem) => {
                            const node = nodes[virtualItem.index]

                            return (
                              <div
                                key={virtualItem.key}
                                ref={virtualizers.current[status].measureElement}
                                data-index={virtualItem.key}
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: `${virtualItem.size}px`,
                                  transform: `translateY(${virtualItem.start}px)`,
                                }}
                              >
                                <NodeItem
                                  node={node}
                                  level={0}
                                  onToggle={toggleOpen}
                                  onDelete={handleDelete}
                                  onEdit={handleEdit}
                                  onDragStart={handleDragStart}
                                  onDrop={handleDrop}
                                  onSelect={handleSelect}
                                />
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {status === 'Backlog' &&
                        <Button className="block w-full" onClick={() => handleAdd(null, { name: 'test', node_id: nextId++, type: 'Feature', description: 'ok', childrens: [], start_date: '', end_date: '', status: "Backlog", open: true })}>
                          Ajouter
                        </Button>
                      }
                    </div>
                  )
                })}
              </div>
            </div>

            {nodeOpened &&
              <div className="col-span-2">
                <NodeDisplay node={nodeOpened} parent={parentNode} onConfirm={confirmEdit} onAdd={handleAdd} onParentOpened={handleParent} onClose={handleClose} />
              </div>
            }
          </div>
        </TreeContext.Provider>
      </GlobalContext.Provider>

      {nodeToBeEdited && <NodeModal node={nodeToBeEdited} onClose={cancelEdit} onConfirm={confirmEdit} />}
      {nodeToBeDeleted && <DeleteModal node={nodeToBeDeleted} onClose={() => setNodeToBeDeleted(null)} onConfirm={confirmDelete} />}
    </>
  )
}

export default Tree
