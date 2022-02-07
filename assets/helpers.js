export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function capitalize(s){
  return s[0].toUpperCase() + s.substring(1);
}

export async function checkComponents(d) {
  for (let i = 0; i < d.length; i++) {
    d[i].component = camelize(d[i].slice_type);
    d[i].hasComponent = await import(`@/components/${d[i].component}`)
      .then((_res) => {
        return true;
      })
      .catch((_error) => {
        return false;
      });
  }
  return d;
}

export function camelize(str) {
  return str.indexOf("_") > 0
    ? str
        .split("_")
        .map((w, i) => (i > 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
        .join("")
    : str;
}
