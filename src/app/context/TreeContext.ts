import { createContext } from 'react'
import { Node } from '../components/Tree'

export interface TreeContextType {
  onToggle: (nodeId: number) => void,
  onDelete: (node: Node) => void,
  onEdit: (node: Node) => void,
  onDragStart: (node: Node) => void,
  onDrop: (node: Node, asParent: boolean) => void,
  onSelect: (node: Node) => void,
  nodeOpened: Node | null
}

export const TreeContext = createContext<TreeContextType>({
  onToggle: () => {},
  onDelete: () => {},
  onEdit: () => {},
  onDragStart: () => {},
  onDrop: () => {},
  onSelect: () => {},
  nodeOpened: null,
})
