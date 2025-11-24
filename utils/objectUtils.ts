
export const get = (obj: any, path: string, defaultValue?: any) => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

export const set = (obj: any, path: string, value: any) => {
  if (Object(obj) !== obj) return obj;
  const split = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
  
  // Clone the object to avoid mutation
  const newObj = JSON.parse(JSON.stringify(obj));
  
  let current = newObj;
  for (let i = 0; i < split.length - 1; i++) {
    const key = split[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  
  const leaf = split[split.length - 1];
  if (value === undefined) {
      delete current[leaf];
  } else {
      current[leaf] = value;
  }
  
  return newObj;
};

export const formatLabel = (key: string): string => {
  // Convert camelCase to Title Case
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};
