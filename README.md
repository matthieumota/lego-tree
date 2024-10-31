# LEGO Tree Challenge

This project is a technical test. We start with create a Next JS project.

## Getting Started

You can run development server:

```bash
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
