import { bt as derived, bu as queryParams } from "./index-DXlsbSLM.js";
function usePageQueryParams(defaultValues, fieldMappings) {
  return derived(queryParams, ($params) => {
    const result = { ...defaultValues };
    for (const [fieldKey, defaultValue] of Object.entries(defaultValues)) {
      const queryKey = fieldKey;
      const queryValue = $params[queryKey];
      if (queryValue !== void 0) {
        const value = Array.isArray(queryValue) ? queryValue[0] : queryValue;
        if (typeof defaultValue === "boolean") {
          result[fieldKey] = value === "true" || value === "1";
        } else if (typeof defaultValue === "number") {
          const num = Number(value);
          if (!isNaN(num)) {
            result[fieldKey] = num;
          }
        } else {
          result[fieldKey] = value;
        }
      }
    }
    return result;
  });
}
function updatePageQueryParams(updates) {
  if (typeof window === "undefined") return;
  const hash = window.location.hash;
  if (hash && hash.startsWith("#/")) {
    const [route, currentParams] = hash.split("?");
    const searchParams = new URLSearchParams(currentParams || "");
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === void 0) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, String(value));
      }
    }
    const newHash = searchParams.toString() ? `${route}?${searchParams.toString()}` : route;
    window.location.hash = newHash;
  } else {
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === void 0) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, String(value));
      }
    }
    window.history.replaceState({}, "", url.toString());
  }
}
function getCurrentPageQueryParams() {
  if (typeof window === "undefined") return {};
  const params = {};
  let searchParams;
  const hash = window.location.hash;
  if (hash && hash.includes("?")) {
    const queryString = hash.split("?")[1];
    searchParams = new URLSearchParams(queryString);
  } else {
    searchParams = new URLSearchParams(window.location.search);
  }
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
}
export {
  updatePageQueryParams as a,
  getCurrentPageQueryParams as g,
  usePageQueryParams as u
};
