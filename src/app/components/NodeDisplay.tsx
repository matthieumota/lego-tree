import { ChangeEvent, useEffect, useState } from 'react'
import { Node } from './Tree'

interface Props {
  node: Node | null,
  onConfirm: (newNode: Partial<Node>) => void,
}

const NodeDisplay: React.FC<Props> = ({ node, onConfirm }: Props): JSX.Element | null => {
  const [newNode, setNewNode] = useState<Node | null>(node)

  useEffect(() => {
    setNewNode(node)
  }, [node])

  if (!newNode) {
    return null
  }

  const handleChange = (e: ChangeEvent, name: string) => {
    const n = { ...newNode, [name]: (e.target as HTMLInputElement).value }
    setNewNode(n)
    onConfirm(n)
  }

  return (
    <div>
      <h2 className="font-bold">Noeud {node?.node_id}</h2>

      <form onSubmit={() => onConfirm(newNode)}>
        <div className="mb-3">
          <label htmlFor="name" className="block mb-2">Nom</label>
          <input className="w-full" type="text" id="name" value={newNode.name} onChange={(e) => handleChange(e, 'name')} />
        </div>

        <div className="mb-3">
          <label htmlFor="type" className="block mb-2">Type</label>
          <select className="w-full" id="type" value={newNode.type} onChange={(e) => handleChange(e, 'type')}>
            {['Feature', 'User Story', 'Task'].map((name) =>
              <option key={name} value={name}>{name}</option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="block mb-2">Statut</label>
          <select className="w-full" id="status" value={newNode.status} onChange={(e) => handleChange(e, 'status')}>
            {['To Do', 'Backlog', 'In Progress', 'In Review', 'Done'].map((name) =>
              <option key={name} value={name}>{name}</option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="block mb-2">Description</label>
          <textarea className="w-full" id="description" value={newNode.description} onChange={(e) => handleChange(e, 'description')}></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="start_date" className="block mb-2">Date de début</label>
          <input className="w-full" type="date" id="start_date" value={newNode.start_date} onChange={(e) => handleChange(e, 'start_date')} />
        </div>

        <div className="mb-8">
          <label htmlFor="end_date" className="block mb-2">Date de fin</label>
          <input className="w-full" type="date" id="end_date" value={newNode.end_date} onChange={(e) => handleChange(e, 'end_date')} />
        </div>

        <div className="flex gap-4 flex-row-reverse">
        </div>
      </form>
    </div>
  )
}

export default NodeDisplay
