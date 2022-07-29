import express from "express";
import path from "path";
const rootPath = path.resolve();

// Define view engine used by Express
const useViewEngine = (app) => {
  app.set("views", path.join(rootPath, "./views"));
  app.set("view engine", "pug");
  app.use(express.static(path.join(rootPath, "./public")));
};

export default useViewEngine;
