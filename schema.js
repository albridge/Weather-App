const { findAllByAltText } = require("@testing-library/react");
const graphql = require("graphql");
const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const books = [
  {
    id: "1",
    name: "james",
    genre: "fiction",
  },
  {
    id: "2",
    name: "aron",
    genre: "thriller",
  },
  {
    id: "3",
    name: "kelvin",
    genre: "action",
  },
];
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
});

// amimal type

const Animals = [
  {
    id: "1",
    name: "Lion",
    bites: "yes",
    hab: 1,
  },
  {
    id: "2",
    name: "Cow",
    bites: "no",
    hab: 2,
  },
  {
    id: "3",
    name: "zebra",
    genre: "no",
    hab: 3,
  },
];

const Habitats = [
  {
    id: "1",
    habitat: "Forest",
  },
  {
    id: "2",
    habitat: "Homes",
  },
  {
    id: "3",
    habitat: "Zoo",
  },
];

const AnimalType = new GraphQLObjectType({
  name: "Animal",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    bites: { type: GraphQLString },
    hab: { type: GraphQLInt },
    residence: {
      type: HabitatType,
      resolve: (animal, args) => {
        return Habitats.find((location) => location.id == animal.hab);
        // return Habitats[1];
      },
    },
  }),
});

const HabitatType = new GraphQLObjectType({
  name: "Habitat",
  fields: () => ({
    id: { type: GraphQLString },
    habitat: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        // const person = books.find((book) => {
        //   return book.id == args.id;
        // });
        // return person;

        // return books.filter((book) => book.id == args.id);

        // const item = books.filter(function (student) {
        //   return student.id == args.id;
        // });
        // return item;

        // console.log(list);
        for (let x = 0; x < books.length; x++) {
          if (args.id == books[x].id) {
            return books[x];
          }
        }
      },
    },
    books: {
      type: new GraphQLList(BookType),
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return books; // Replace with your own database query
      },
    },
    animals: {
      type: new GraphQLList(AnimalType),
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        // return Animals; // Replace with your own database query
        return axios
          .get("http://localhost:3000/animals")
          .then((res) => res.data);
      },
    },
    animal: {
      type: AnimalType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        // for (let x = 0; x < Animals.length; x++) {
        //   if (args.id == Animals[x].id) {
        //     return Animals[x];
        //   }
        // }

        return axios
          .get("http://localhost:3000/animals/" + args.id)
          .then((res) => res.data);
      },
    },
    habitat: {
      type: HabitatType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        for (let x = 0; x < Habitats.length; x++) {
          if (args.id == Habitats[x].id) {
            return Habitats[x];
          }
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addBook: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLString },
      },
      resolve(parent, args) {
        // const book = new Book({ name: args.name, genre: args.genre });
        // return book.save(); // replace with your database call

        const new_book = { id: "4", name: args.name, genre: args.genre };
        books.push(new_book);
        return new_book;
      },
    },

    addAnimal: {
      type: AnimalType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        bites: { type: GraphQLString },
      },
      resolve(parent, args) {
        return axios
          .post("http://localhost:3000/animals", {
            id: args.id,
            name: args.name,
            bites: args.bites,
          })
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
