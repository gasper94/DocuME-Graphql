const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const app = express();
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

type bookType = {
  id: number;
  name: string;
  authorId: number;
};

type authorType = {
  id: number;
  name: string;
};

type bookCommentsType = {
  id: number;
  comment: string;
  bookId: number;
  authorId: number;
};

const comments: bookCommentsType[] = [
  {
    id: 1,
    comment: "this a comment about a book.",
    bookId: 1,
    authorId: 1,
  },
  {
    id: 2,
    comment: "this a comment about a book.",
    bookId: 2,
    authorId: 2,
  },
];

const authors: authorType[] = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J. R. R. Tolkien" },
  { id: 3, name: "Brent Weeks" },
];

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

const BookCommentype = new GraphQLObjectType({
  name: "Comments",
  description: "This represents a book comment",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    comment: { type: new GraphQLNonNull(GraphQLString) },
    bookId: { type: new GraphQLNonNull(GraphQLInt) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book: bookType) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
    book: {
      type: new GraphQLList(BookType),
      resolve: (author: authorType) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
    // comments: {
    //   type: new GraphQLList(BookCommentype),
    //   resolve: (book: bookType) => {
    //     return comments.filter((comment) => comment.bookId === book.id);
    //   },
    // },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) }, // Wrap with GraphQLNonNull
    name: { type: new GraphQLNonNull(GraphQLString) }, // Wrap with GraphQLNonNull
    authorId: { type: new GraphQLNonNull(GraphQLInt) }, // Wrap with GraphQLNonNull
    author: {
      type: AuthorType,
      resolve: (book: bookType) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
    book: {
      type: new GraphQLList(BookType),
      resolve: (author: authorType) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
    comments: {
      type: new GraphQLList(BookCommentype),
      resolve: (book: bookType) => {
        return comments.filter((comment) => comment.bookId === book.id);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents a author of a book",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author: authorType) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    comments: {
      type: new GraphQLList(BookCommentype),
      description: "List of All comments",
      resolve: () => comments,
    },
    book: {
      type: BookType,
      description: "A single book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent: undefined | null, args: { id: number }) =>
        books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of All books",
      resolve: () => books,
    },
    author: {
      type: AuthorType,
      description: "A single author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent: undefined | null, args: { id: number }) =>
        authors.find((author) => author.id === args.id),
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All authors",
      resolve: () => authors,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutatation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a book",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (
        parent: undefined | null,
        args: {
          id: number;
          name: string;
          authorId: number;
        }
      ) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Add a author",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (
        parent: undefined | null,
        args: {
          id: number;
          name: string;
        }
      ) => {
        const newAuthor = {
          id: authors.length + 1,
          name: args.name,
        };
        authors.push(newAuthor);
        return newAuthor;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true, // Use 'graphiql' instead of 'graphical'
  })
);

app.listen(5000, () => console.log("Server Running..."));
