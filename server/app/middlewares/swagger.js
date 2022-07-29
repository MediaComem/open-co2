import * as swaggerUi from "swagger-ui-express";
import { readFile } from "fs/promises";

const swaggerDocument = JSON.parse(
  await readFile(new URL("../swagger.json", import.meta.url))
);

const swaggerServe = swaggerUi.serve;
const swaggerSetup = swaggerUi.setup(swaggerDocument);

export { swaggerServe, swaggerSetup };
