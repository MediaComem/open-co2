import { makeExecutableSchema } from "@graphql-tools/schema";
// Definitions
import { typeDefs } from "./types.js";
import { resolvers } from "./resolvers.js";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
