import config from "config";
import express from "express";
const router = express.Router();
import { readFile } from "fs/promises";
const pkg = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url))
);
// Get environment
const environment = process.env.NODE_ENV || config.util.getEnv("NODE_ENV");
// Get date for footer
function creditYears() {
  const currentYear = new Date().getFullYear();
  if (currentYear > 2022) return `2022-${currentYear}`;
  else return currentYear;
}
// Landing page route
export default router.get("/", (req, res) => {
  res.render("index", {
    version: pkg.version,
    environment: environment.charAt(0).toUpperCase() + environment.slice(1), // Capitalize first letter
    creditYears: creditYears()
  });
});
