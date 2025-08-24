export const ensureArray = (maybeArr) => {
  if (Array.isArray(maybeArr)) return maybeArr;
  if (maybeArr && Array.isArray(maybeArr.products)) return maybeArr.products;
  return [];
};

export const safeFilter = (arr, fn) => Array.isArray(arr) ? arr.filter(fn) : [];