export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function capitalize(s){
  return s[0].toUpperCase() + s.substring(1);
}
