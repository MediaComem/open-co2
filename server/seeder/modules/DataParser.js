import {
  formatString,
  hashString,
  getMeanFromArray,
  getDeviationFromArray
} from "../helpers/utils.js";
// import util from "util";

/**
 * Class to process CO2 Data XLS sheets and turn it to JS objets
 */
class DataParser {
  /**
   * DataParser constructor4
   * @constructor
   * @param {Object} rows Sheet content from fileReader
   */
  constructor(rows) {
    this.rows = rows;
    this.maxDepth = 10;
    this.floatPrecision = 3;
  }

  /** Validate input CO2 data
   * @param {array<row>} rows rows object corresponding to content of excel CO2 data sheet
   * @param {number} maxDepth maximum depth of subcategories
   * @throws { Error } in case of invalid data
   * Sheet headers are expected to be `Level 1`, `Level 2`, `Level 3`, etc.
   * Rows follow that structure:
   * - Root category row will be {"Level 1": "Title category", "CO2":... }
   * - Subcategory  { "Level 2": "Title subcategory", "CO2":... }
   * - sub-Subcategory  { "Level 3": "sub-subcategory", "CO2":... }
   * Only one `Level x` can be filled
   */
  static validate(rows, maxDepth = 10) {
    for (const row of rows) {
      const validation = { ...row };
      // Loop over level's names
      for (let n = 0; n < maxDepth; n++) {
        const currentLevel = n + 1;
        const key = `Level ${currentLevel}`;
        if (validation[key] !== undefined) {
          if (validation.depth) {
            throw new Error(`Row invalid, 2 levels filled - ${validation}`);
          }
          // Add depth key from level number
          validation.depth = currentLevel;
        }
      }
      if (validation.CO2) {
        if (isNaN(validation.CO2)) {
          throw new Error(
            `Co2 value needs to be a number - ${validation.co2} invalid`
          );
        }
      }
    }
  }

  /**
   * Group internal methods to process units sheet
   */
  processUnits() {
    for (let i = 0, l = this.rows.length; i < l; i++) {
      const row = this.rows[i];
      row.type = row.Type;
      row.description = row.Description;
      delete row[`Type`];
      delete row[`Description`];
    }
  }

  /**
   * Group internal methods and execute in order to process categories sheet
   * Please see 'Open Co2.xls' file for structure example
   */
  process() {
    // 0 - Validate Data
    DataParser.validate(this.rows, this.maxDepth);
    // 1 – Parse rows and create tree of CO2 data
    const tree = this.#parseRows();
    // 2 – Construct full path (based on unique name) and associated category ids
    this.#fillPath(tree);
    // 3 – Add list of children ids, means, etc.
    this.#extendData(tree);
    // 4 – Clean unused keys and order its
    this.#clean();
  }

  /**
   * Make a private function accessible from outside for test purposes
   * @param {string} method name of the method to test in this class
   * @returns {Object} function of this class
   */
  unitTest(method) {
    if (process.env.NODE_ENV !== "test") {
      throw "unitTest can only be used in test mode";
    }
    switch (method) {
      case "getDeepTree":
        return this.#getDeepTree();
      case "computeTreePath":
        return this.#computeTreePath();
    }
  }

  /**
   * Construct and return a deep tree with children categories
   * @private
   * @throws {Error} Only one root node supported
   * @returns {Object} return the deep tree with all children categories
   */
  #getDeepTree() {
    let deepTree;
    const nodeChildrens = [[]];

    for (const row of this.rows) {
      const currentDepth = row.depth - 1;
      const treeNode = {
        row,
        descendants: []
      };
      if (row.depth === 1) {
        // root node
        if (deepTree) {
          throw new Error("Only one root node supported");
        } else {
          deepTree = treeNode;
        }
      } else {
        // new children at level current depth
        nodeChildrens[currentDepth].push(treeNode);
      }
      // update list of next level children
      nodeChildrens[currentDepth + 1] = treeNode.descendants;
    }
    return deepTree;
  }

  /**
   * Find a node in tree by passing its unique name
   * @param {string} name unique name of the node to search (see row.uniqueName in #parseRows function)
   * @param {Object} tree the tree to search in
   * @returns {Object} return the node object and its path in an object
   */
  #computeTreePath(name, treeNode) {
    const row = treeNode.row;
    if (row.uniqueName === name) {
      const path = [row.name];
      return path;
    } else if (treeNode.descendants) {
      for (const descendant of treeNode.descendants) {
        const path = this.#computeTreePath(name, descendant);
        if (path) {
          path.unshift(row.name);
          return path;
        }
      }
    }
    return undefined;
  }

  /**
   * Update object keys from sheet headers and contruct data tree
   */
  #parseRows() {
    // Loop over rows
    for (let i = 0, l = this.rows.length; i < l; i++) {
      const row = this.rows[i];
      // Loop over level's names
      for (let n = 0; n < this.maxDepth; n++) {
        const currentLevel = n + 1;
        const key = `Level ${currentLevel}`;
        if (row[key] !== undefined) {
          // Add title key with value from level
          row.title = row[key];
          // Add depth key from level number
          row.depth = currentLevel;
          // Delete unused level key
          delete row[key];
          break;
        }
      }
      // Add name key with value from formatted title
      row.name = formatString(row.title);
      row.uniqueName = formatString(row.title) + `_${i}`;
      // Add co2eq object
      if (row.CO2 !== undefined) {
        const source = {
          title: row.Source,
          url: row.URL,
          year: row.Year
        };
        row.co2eq = {
          value: row.CO2,
          unit: row.Unit,
          approximated: false,
          details: row.Details,
          source
        };
        // Remove some keys
        delete row[`Details`];
        delete row[`Source`];
        delete row[`URL`];
        delete row[`Year`];
        delete row[`CO2`];
        delete row[`Unit`];
      } else {
        // Keys to lowercase
        row.details = row.Details;
        delete row[`Details`];
      }
    }
    return this.#getDeepTree();
  }

  /**
   * Fill data path (based on unique name)
   */
  #fillPath(tree) {
    // Loop over rows
    for (const row of this.rows) {
      const path = this.#computeTreePath(row.uniqueName, tree);
      // Add base slash and join array items
      row.fullPath = "/" + path.join("/");
      // Add category ID (hash from fullpath)
      row.categoryId = hashString(row.fullPath);
      path.pop();
      row.path = "/" + path.join("/");
    }
  }

  /**
   * Add reference to children categories, means, etc.
   */
  #extendData(node) {
    // Anonymous function to check if all element are the same in given array
    const allEqual = (arr) => arr.every((v) => v === arr[0]);
    // Recursively parse tree nodes
    if (node.descendants && node.descendants.length > 0) {
      const row = node.row;
      for (const descendant of node.descendants) {
        // extend children first, since computed CO2 may depends on children
        this.#extendData(descendant);
      }
      // Fill children categories
      row.children = node.descendants.map((child) => child.row.name);
      row.childrenUniqueNames = node.descendants.map(
        (child) => child.row.uniqueName
      );
      row.childrenIds = node.descendants.map((child) => child.row.categoryId);
      // Fill co2 based on children value if necessary
      if (!row.co2eq) {
        const childrenCO2 = node.descendants.map((child) => child.row.co2eq);
        const values = childrenCO2.map((co2eq) => co2eq.value);
        const units = childrenCO2.map((co2eq) => co2eq.unit);
        const sourcesUrls = childrenCO2.map((co2eq) => co2eq.source?.url);
        const sourcesTitles = childrenCO2.map((co2eq) => co2eq.source?.title);
        if (allEqual(units)) {
          // ----------------------------------------------------------------
          // Single unit - Childrens have the same unit
          // ----------------------------------------------------------------
          // Calculate mean from child values
          const mean = getMeanFromArray(values, this.floatPrecision);
          const deviation = getDeviationFromArray(values, this.floatPrecision);
          const uniqueTitles = [...new Set(sourcesTitles)];
          const uniqueUrls = [...new Set(sourcesUrls)];
          const source = {
            title: uniqueTitles.join(","),
            url: uniqueUrls.join(","),
            year: new Date().getFullYear()
          };
          const co2eq = {
            value: mean,
            unit: units[0],
            approximated: true,
            details: `Approximated CO2e value for '${row.title}' category. Open CO2 API automatically calculate average from children's categories values.`,
            source,
            calculationDetails: {
              mean: mean,
              count: values.length,
              min: Math.min.apply(Math, values),
              max: Math.max.apply(Math, values),
              standardDeviation: deviation
            }
          };
          row.co2eq = co2eq;
        } else {
          // ----------------------------------------------------------------
          // Multiples units - Childrens have different units
          // ----------------------------------------------------------------
          const co2eqObject = {
            value: null,
            unit: null,
            approximated: null,
            details: `No mean for '${node.title}' category. Open CO2 cannot determine an approximated value because its children categories have different units.`
          };
          row.co2eq = co2eqObject;
        }
      }
    }
  }

  /**
   * 6 – Clean unused keys and order its
   */
  #clean() {
    // Loop over rows
    for (let i = 0, l = this.rows.length; i < l; i++) {
      const row = this.rows[i];
      // Remove some keys
      delete this.rows[i].uniqueName;
      delete this.rows[i].childrenUniqueNames;
      delete this.rows[i].depth;
      // Set object's keys in this order
      const cleanData = {
        categoryId: null,
        title: null,
        name: null,
        path: null,
        fullPath: null,
        details: null,
        co2eq: null
      };
      // Reassign object to order its keys
      this.rows[i] = Object.assign(cleanData, row);
    }
  }
}

export default DataParser;
