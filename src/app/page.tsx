import Tree, { Node } from './components/Tree'

export default async function Home() {
  const { data }: { data: Array<Node> } = await fetch('http://localhost:3000/api/nodes').then(r => r.json())

  return (
    <div className="font-[family-name:var(--font-geist-sans)] max-w-full mx-auto lg:p-20 p-10">
      <Tree nodes={data} />
    </div>
  )
}
