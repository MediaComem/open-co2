import config from "config";
import { useSofa, OpenAPI } from "sofa-api";
import schema from "../graphql/index.js";
import { readFile } from "fs/promises";

const REST_BASE = process.env.REST_BASE || config.get("server.restBase");

const pkg = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url))
);

// REST API
const openApi = OpenAPI({
  schema,
  info: {
    title: "Open CO2 REST API",
    version: pkg.version
  }
});

const sofaMiddleware = useSofa({
  schema,
  basePath: REST_BASE,
  depthLimit: process.env.REST_DEPTH || config.get("server.restDepth"),
  onRoute(info) {
    openApi.addRoute(info, {
      basePath: REST_BASE
    });
  }
});

const generateSwaggerDoc = () => {
  return openApi.save("./swagger.json");
};

export { sofaMiddleware, generateSwaggerDoc };
