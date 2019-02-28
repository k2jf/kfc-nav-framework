/**
 * take a mustache-ish template, and interpolate values from paramObj
 * @param template "xxxx {{ .. }} yyyy"
 * @param paramObj
 * @return {string} result string.
 */
export const deMustache = function (template, paramObj) {
  /* take the nearest pair of mustaches, and do replacement */
  const MUSTACHETTE = /\{\{\s*([^{]*?)\s*\}\}/g;
  return template.replace(MUSTACHETTE, (match, stub) => {
    return paramObj[stub] || '';
  });
};

/**
 * traverse the 'tree', go deeper at 'childKey' and do 'fn' respectively
 * @param tree the object to traverse
 * @param childKey the recursive key, whose value is an array
 * @param fn handler, which takes the node as param
 */
export const traverse = function _traverse (tree, childKey, fn) {
  if (!tree) { return; }

  const result = fn(tree);
  if (result === false) { /* return is not needed */ }
  else {
    const children = tree[childKey] || [];
    children.forEach(child => {
      _traverse(child, childKey, fn);
    });
  }
};
