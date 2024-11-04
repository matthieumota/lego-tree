import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Node } from './Tree'
import Button from './Button'

interface Props {
  node: Node | null,
  onClose: () => void,
  onConfirm: (newNode: Partial<Node>) => void,
}

const NodeModal: React.FC<Props> = ({ node, onClose, onConfirm }: Props): JSX.Element | null => {
  const [newNode, setNewNode] = useState<Node | null>(node)
  const [errors, setErrors] = useState<Record<string, string> | null>(null)

  const valid = useMemo(() => errors === null || Object.keys(errors).length === 0, [errors])

  useEffect(() => {
    if (newNode) {
      setErrors(validate(newNode))
    }
  }, [newNode])

  if (!newNode) {
    return null
  }

  const validate = (n: Node): Record<string, string> | null => {
    const errors = {} as Record<string, string>

    if (n.name.trim() === '') {
      errors.name = 'Le nom est requis'
    }

    if (n.description.trim() === '') {
      errors.description = 'La description est requise'
    }

    if (n.start_date === '') {
      errors.start = 'La date de début est requise'
    }

    if (n.end_date === '') {
      errors.end = 'La date de fin est requise'
    }

    const start = new Date(n.start_date)
    const end = new Date(n.end_date)

    if (start > end) {
      errors.start = 'La date de début doit être antérieure à la date de fin'
    }

    if (Object.keys(errors).length === 0) {
      return null
    }

    return errors
  }

  const handleChange = (e: ChangeEvent, name: string) => {
    setNewNode({ ...newNode, [name]: (e.target as HTMLInputElement).value })
  }

  return (
    <>
      <Dialog
        open={!!node}
        onClose={onClose}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-screen-md w-screen space-y-4 border bg-white p-6 rounded-xl shadow-xl">
            <DialogTitle className="font-bold">{newNode.type} {node?.node_id}</DialogTitle>
            <form onSubmit={() => onConfirm(newNode)}>
              <div className="mb-3">
                <label htmlFor="name" className="block mb-2">Nom</label>
                <input className="w-full" type="text" id="name" value={newNode.name} onChange={(e) => handleChange(e, 'name')} />
                {errors?.name && <p className="text-red-500 mt-2">{errors?.name}</p>}
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
                {errors?.description && <p className="text-red-500 mt-2">{errors?.description}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="start_date" className="block mb-2">Date de début</label>
                <input className="w-full" type="date" id="start_date" value={newNode.start_date} onChange={(e) => handleChange(e, 'start_date')} />
                {errors?.start && <p className="text-red-500 mt-2">{errors?.start}</p>}
              </div>

              <div className="mb-8">
                <label htmlFor="end_date" className="block mb-2">Date de fin</label>
                <input className="w-full" type="date" id="end_date" value={newNode.end_date} onChange={(e) => handleChange(e, 'end_date')} />
                {errors?.end && <p className="text-red-500 mt-2">{errors?.end}</p>}
              </div>

              <div className="flex gap-4 flex-row-reverse">
                <Button className="!bg-slate-600 hover:!bg-slate-500 text-white" disabled={!valid}>Confirmer</Button>
                <Button onClick={onClose}>Annuler</Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

export default NodeModal
