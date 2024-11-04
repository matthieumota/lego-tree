import { createContext } from 'react'
import { Node } from '../components/Tree'

export interface TreeContextType {
  onToggle: (nodeId: number) => void,
  onDelete: (node: Node) => void,
  onEdit: (node: Node) => void,
  onDragStart: (node: Node) => void,
  onDrop: (node: Node, asParent: boolean) => void,
  onSelect: (node: Node, parent: Node | null) => void,
}

export const TreeContext = createContext<TreeContextType>({
  onToggle: () => {},
  onDelete: () => {},
  onEdit: () => {},
  onDragStart: () => {},
  onDrop: () => {},
  onSelect: () => {},
})

export interface GlobalContextType {
  nodeOpened: Node | null,
}

export const GlobalContext = createContext<GlobalContextType>({
  nodeOpened: null,
})
