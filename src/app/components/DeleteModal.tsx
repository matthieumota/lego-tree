import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React from 'react'
import { Node } from './Tree'
import Button from './Button'

interface Props {
  node: Node | null,
  onClose: () => void,
  onConfirm: () => void,
}

const DeleteModal: React.FC<Props> = ({ node, onClose, onConfirm }: Props): JSX.Element => {
  return (
    <>
      <Dialog
        open={!!node}
        onClose={onClose}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-6 rounded-xl shadow-xl">
            <DialogTitle className="font-bold">Supprimer le noeud</DialogTitle>
            <Description>Êtes-vous sûr de vouloir supprimer ce noeud et ses enfants?</Description>
            <div className="flex gap-4 flex-row-reverse">
              <Button onClick={onConfirm} className="bg-red-600 hover:!bg-red-500 text-white">Supprimer</Button>
              <Button onClick={onClose}>Annuler</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

export default DeleteModal
