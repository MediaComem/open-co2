function findObjectByKey(array, key, val) {
  return array.find((obj) => obj[key] === val);
}

export function findObjectsFromIds(arrayOfIds, arrayToFilter) {
  const objects = [];
  if (arrayOfIds) {
    arrayOfIds.forEach((id) => {
      const matchingObject = findObjectByKey(arrayToFilter, "id", id);
      objects.push(matchingObject);
    });
  }
  return objects;
}

export function formatString(input) {
  // If not a string
  if (!(input && (typeof input === "string" || input instanceof String)))
    throw new Error(
      "formatString() must receive a string as an input parameter"
    );

  return input
    .normalize("NFD") // Normalization form canonical decomposition
    .replace(/[^a-zA-Z0-9 ]/g, "") // Remove special characters, keep letters and numbers
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/,/g, "") // Remove comma
    .replace(/ /g, "_") // Replace spaces with underscore
    .toLowerCase(); // Convert to lowercase
}

export function isArrayEmpty(array) {
  // Not an array
  if (!Array.isArray(array)) {
    return false;
  }
  // Empty array
  if (array.length === 0) {
    return true;
  }
  // Not an empty array
  return false;
}
