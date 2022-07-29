import dotenv from "dotenv";
dotenv.config();
import XLSDataReader from "./modules/XLSDataReader.js";
import DataParser from "./modules/DataParser.js";
import FileExporter from "./modules/FileExporter.js";

// Excel file used as input
const inputFile = "./data/input/Open CO2.xlsx";

// Read file
const xlsDataReader = new XLSDataReader(inputFile);

/**
 * Configuration object to export categories sheets
 * @constant
 * @type {Object}
 */
const categoriesConfig = {
  fileName: "data/output/categories.js",
  varName: "categoriesData",
  sheets: [
    "Electricity",
    "Heat",
    "Transports",
    "IT",
    "Appliances",
    "Furnitures",
    "Packaging",
    "Accomodation",
    "Food"
  ]
};

/**
 * Configuration object to export units sheet
 * @constant
 * @type {Object}
 */
const unitsConfig = {
  fileName: "data/output/units.js",
  varName: "unitsData",
  sheets: ["Units"]
};

function processCategories(config) {
  let consolidatedData = [];

  for (let i = 0, l = config.sheets.length; i < l; i++) {
    const sheetName = config.sheets[i];
    const rawContent = xlsDataReader.getSheetContent(sheetName);
    const dataParser = new DataParser(rawContent);
    // Start processing sheet
    dataParser.process();
    consolidatedData.push(...dataParser.rows);
  }

  // Save JSON file
  const fileExporter = new FileExporter();
  fileExporter.saveAsJsonFile(
    consolidatedData,
    config.fileName,
    config.varName
  );
}

// Generate categories file
processCategories(categoriesConfig);

// Generate units file
const rawContent = xlsDataReader.getSheetContent(unitsConfig.sheets[0]);
const dataParser = new DataParser(rawContent);
// Start processing sheet
dataParser.processUnits();

// Save JSON file
const fileExporter = new FileExporter();
fileExporter.saveAsJsonFile(
  [...dataParser.rows],
  unitsConfig.fileName,
  unitsConfig.varName
);
