import dotenv from "dotenv";
dotenv.config();
import config from "config";
import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
// Database
import initDatabase from "./config/database.js";
// Middlewares
import useMiddlewares from "./middlewares/index.js";
// View engine
import useViewEngine from "./config/viewEngine.js";
// Routes
import homeRouter from "./routes/home.js";
// GraphQL schema
import schema from "./graphql/index.js";

/**
 * Main function to init and start server
 */
async function startServer() {
  // Express server
  const app = express();
  // const router = express.Router();
  // Used by ApolloServerPluginDrainHttpServer - See https://www.apollographql.com/docs/apollo-server/api/plugin/drain-http-server/
  const httpServer = http.createServer(app);

  // Apollo server
  const server = new ApolloServer({
    schema,
    formatError: (error) => ({
      name: error.name,
      message: error.message.replace("Error", "")
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection:
      process.env.APOLLO_INTROSPECTION ||
      config.get("server.apolloIntrospection"),
    playground:
      process.env.APOLLO_PLAYGROUND || config.get("server.apolloPlayground"),
    path: process.env.GRAPHQL_ENDPOINT || config.get("server.graphqlEndpoint"),
    debug: process.env.NODE_ENV === "production" ? true : false
  });

  // Init view engine
  await useViewEngine(app);

  // Define routes
  app.use("/", homeRouter); // Server landing page

  // Apply middlewares
  await useMiddlewares(app);

  // Connect to DB
  await initDatabase();

  // Start Apollo server
  await server.start();

  // Mount Apollo middleware
  server.applyMiddleware({
    app,
    path: process.env.GRAPHQL_ENDPOINT || config.get("server.graphqlEndpoint")
  });

  const PORT = process.env.PORT || config.get("server.port");

  // Start Express server
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.info(`\n🚀 Open CO2 server ready!`);
  console.info(`Homepage at http://localhost:${PORT}\n`);
}

// Start server
startServer();
