export const sessionService = {
  store,
  load,
  clear,
};

function clear() {
  sessionStorage.clear();
}

function store(key, value) {
  const val = JSON.stringify(value);
  sessionStorage.setItem(key, val);
}

function load(key, defaultValue = null) {
  var value = sessionStorage.getItem(key);
  if (!value) return defaultValue;
  else return JSON.parse(value);
}
