const { findAllByAltText } = require("@testing-library/react");
const chem = () => {
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

  const OpenWeatherType = new GraphQLObjectType({
    name: "OW",
    fields: () => ({
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      country: { type: GraphQLString },
    }),
  });

  const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      oneWeather: {
        type: new GraphQLList(OpenWeatherType),
        args: { id: { type: GraphQLString } },
        resolve(parent, args) {
          getForcast2();
        },
      },
    },
  });

  var forcastQuery = `

    query me(name: "Basel") {
     {
      name
      id
      country
     }
  }
  `;

  // hot query

  const hotQuery = `

      query {
        getCityByName(name: "Basel") {
          id
          name
          country
          coord {
            lon
            lat
          }
          weather {
            summary {
              title
              description
              icon
            }
            temperature {
              actual
              feelsLike
              min
              max
            }
            wind {
              speed
              deg
            }
            clouds {
              all
              visibility
              humidity
            }
            timestamp
          }
        }
      }
   `;

  const getForcast2 = async () => {
    const city = "lagos";

    // use this

    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&appid=5fb7cdbbbf3cbf2d4c43e7696b7594bb",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: hotQuery,
          //   variables: { code: encodeURIComponent(text) },
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
      addCity: {
        type: OpenWeatherType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          name: { type: new GraphQLNonNull(GraphQLString) },
          genre: { type: GraphQLString },
        },
        resolve(parent, args) {
          // const book = new Book({ name: args.name, genre: args.genre });
          // return book.save(); // replace with your database call
          // const new_book = { id: "4", name: args.name, genre: args.genre };
          // books.push(new_book);
          // return new_book;
        },
      },
    },
  });

  module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
  });
};
export default chem;
