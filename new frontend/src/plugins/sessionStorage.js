class MySessionStorage {
  constructor() {}
  set(k, v) {
    if (typeof k !== "string") return false;
    if (typeof v === "object") v = JSON.stringify(v);
    window.sessionStorage.setItem(k, v);
    return true;
  }
  get(k) {
    // if not exist, return null
    if (k === undefined || k === null) return null;
    let b = null;
    if (typeof k === "string") {
      try {
        b = window.sessionStorage.getItem(k);
      } catch (e) {
        console.error("error in get localStorage: ", e);
      }
    }
    if (b === undefined || b === "null" || b === "undefined") b = null;
    else if (b !== null) {
      if (b === "true") b = true;
      else if (b === "false") b = false;
      else if (!isNaN(b)) b = Number(b);
      else {
        let c;
        try {
          c = JSON.parse(b);
        } catch (e) {
          c = b;
        }
        b = c;
      }
    }
    return b;
  }
  remove(k) {
    if (this.get(k) === null) return false;
    window.sessionStorage.removeItem(k);
    return true;
  }
  clear() {
    window.sessionStorage.clear();
    return true;
  }
}

export default new MySessionStorage();
