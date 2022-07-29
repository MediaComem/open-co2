import { sofaMiddleware, generateSwaggerDoc } from "./sofa.js";
import { swaggerServe, swaggerSetup } from "./swagger.js";

const REST_BASE = process.env.REST_BASE || config.get("server.restBase");

const useMiddlewares = (app) => {
  // Use Sofa to generate RESTful API from GraphQL – https://github.com/Urigo/SOFA
  app.use(REST_BASE, sofaMiddleware);
  generateSwaggerDoc();
  // Use Swagger to generate RESTful API documentation – https://github.com/scottie1984/swagger-ui-express
  app.use(`${REST_BASE}/docs`, swaggerServe, swaggerSetup);
};

export default useMiddlewares;
