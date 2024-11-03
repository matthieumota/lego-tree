import csvParser from 'csv-parser'
import fs from 'fs'
import path from 'path'

export interface Node {
  node_id: number
  name: string
  type: string
  status: string
  description: string
  start_date: string
  end_date: string
  childrens: Array<Node>
}

export interface Relationship {
  parent_id: number
  child_id: number
}

async function readCSV<T>(filename: string): Promise<T[]> {
  const file: string = path.join(process.cwd(), 'fixtures', filename)
  const results: Array<T> = []

  return await new Promise<Array<T>>((resolve, reject) => {
    fs.createReadStream(file)
      .on('error', (err) => reject(err))
      .pipe(csvParser())
      .on('data', (data: T) => results.push({ ...data, childrens: [] }))
      .on('end', () => resolve(results))
  })
}

const countChildrens = (node: Node): number => {
  let count = 1

  node.childrens.forEach(child => {
    count += countChildrens(child)
  })

  return count
}

export async function GET(): Promise<Response> {
  try {
    let nodes = await readCSV<Node>('nodes.csv')
    const relations = await readCSV<Relationship>('relationships.csv')

    const nodeMap = new Map<number, Node>()
    nodes.forEach(node => nodeMap.set(node.node_id, node))
    relations.forEach(({ parent_id, child_id }) => {
      const parent = nodeMap.get(parent_id)
      const child = nodeMap.get(child_id)

      if (parent && child) {
        parent.childrens.push(child)
      }
    })

    // let nextId = 106
    // for (let i = 0; i < 0; i++) {
    //   nodes = nodes.concat(nodes.map(n => ({ ...n, node_id: nextId++ })))
    // }

    const features = nodes.filter(n => n.type === 'Feature')

    let total = 0
    features.forEach(feature => {
      total += countChildrens(feature)
    })
  
    return Response.json({ data: features, meta: { total } })
  } catch {
    return Response.json({
      status: 500,
      details: 'API not available',
    })
  }
}
