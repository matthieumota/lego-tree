# LEGO Tree Challenge

This project is a technical test. We start with create a Next JS project.

## Getting Started

You can run development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Explanations

We need to implement functionalities on that test :

- Parse data from CSV
- Display that data on a tree
- Interactions with nodes on that tree
- CRUD on that tree (add / edit / delete)
- Show metada from each node

## Parse data

Our first task is to parse data from csv source. We're going to parse data from server. We use stream to potentially read file with chunks for optimization (`createReadStream`). We use [csv-parser](https://www.npmjs.com/package/csv-parser) for that.

## Display data

We start from endpoint with nodes. At that point, we group result with features at first level. Next, we pass data to a component `Tree` who pass nodes to `Node` component recursively. We group features in four groups by status for visibility.

We prepare abilities to manage nodes in a state. We can easily add fields on objects. We can already collapse / expand elements.

## Node interactions

To rearrange the node, we think drag n drop is a good solution. If we move feature, we change status. If we move user story or task, we change parent.

## Simple CRUD

We can add / edit / delete a node directly on interface. We use `@headless/ui` to manage transitions / modals...

## Metadata

Already done.

## Optimizations

We apply memoization to optimize render of `NodeItem`.
