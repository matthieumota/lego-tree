import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React, { useState } from 'react'
import { Node } from './Tree'
import Button from './Button'

interface Props {
  node: Node | null,
  onClose: () => void,
  onConfirm: (newNode: Partial<Node>) => void,
}

const NodeModal: React.FC<Props> = ({ node, onClose, onConfirm }: Props): JSX.Element | null => {
  const [newNode, setNewNode] = useState<Node | null>(node)

  if (!newNode) {
    return null
  }

  const handleForm = () => {
    onConfirm(newNode)
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
          <DialogPanel className="max-w-screen-xl w-screen space-y-4 border bg-white p-6 rounded-xl shadow-xl">
            <DialogTitle className="font-bold">Noeud {node?.node_id}</DialogTitle>
            <Description>Êtes-vous sûr de vouloir supprimer ce noeud et ses enfants?</Description>
            <form onSubmit={handleForm}>
              <label htmlFor="name">Nom</label>
              <input type="text" value={newNode.name} onChange={(e) => setNewNode({ ...newNode, name: e.target.value })} />

              <div className="flex gap-4 flex-row-reverse">
                <Button className="bg-slate-600 hover:!bg-slate-500 text-white">Confirmer</Button>
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
