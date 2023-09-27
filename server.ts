const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const app = express();
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");

type bookType = {
  id: number;
  name: string;
  authorId: number;
};

const books: bookType[] = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The Two Towers", authorId: 2 },
  { id: 6, name: "The Return of the King", authorId: 2 },
  { id: 7, name: "The Way of Shadows", authorId: 3 },
  { id: 8, name: "Beyond the Shadows", authorId: 3 },
];

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    message: {
      type: GraphQLString,
      resolve: () => "Hello World",
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true, // Use 'graphiql' instead of 'graphical'
  })
);

app.listen(5000, () => console.log("Server Running..."));
