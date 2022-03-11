/*
    return: 
     - undefined: not in local storage
     - string, number, boolean, object
*/
const cookieStorage = "EXPIRATION_STORAGE";

const getLocal = function (a) {
  let b = undefined;
  if (typeof a === "string") {
    try {
      b = localStorage.getItem(a);
    } catch (e) {
      console.error("error in get localStorage: ", e);
    }
  }
  if (b === null || b === "null" || b === "undefined") b = undefined;
  else if (b !== undefined) {
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
};

/* 
    a: key: string
    b: value: object, array, number, string, boolean
*/
const setLocal = function (a, b) {
  if (typeof a !== "string") return undefined;
  if (typeof b === "object") b = JSON.stringify(b);
  localStorage.setItem(a, b);
  return true;
};

const removeLocal = function (a) {
  if (typeof a === "string") {
    localStorage.removeItem(a);
  } else if (Array.isArray(a)) {
    for (let i of a) {
      removeLocal(i);
    }
  }
};

const clearLocal = function () {
  localStorage.clear();
};

/*
    a: key: string
    b: value: string, number, object, boolean, array...
    c: expiration date, day
*/
const setCookieLocal = function (a, b, c) {
  if (a === undefined || b === undefined) return undefined;
  if (typeof a !== "string") return undefined;
  let s = getLocal(cookieStorage);
  if (s === undefined || !Array.isArray(s)) s = [];
  let idx = -1;
  for (let i in s) {
    if (s[i].key === a) {
      idx = i;
      break;
    }
  }
  if (idx === -1) {
    idx = s.length;
    s.push({ key: "", value: "", expire: "" });
  }
  s[idx].key = a;
  s[idx].value = b;
  if (c === undefined || isNaN(c)) c = 14;
  s[idx].expire = 14 * 24 * 60 * 60 * 1000 + new Date().getTime();
  setLocal(cookieStorage, s);
};

const getCookieLocal = function (a) {
  if (a === undefined) return undefined;
  if (typeof a !== "string") return undefined;
  let s = getLocal(cookieStorage);
  if (s === undefined) return undefined;
  for (let i of s) {
    if (i.key === a) {
      return i.value;
    }
  }
  return undefined;
};

const removeCookieLocal = function (a) {
  if (a === undefined) return;
  if (typeof a !== "string") return;
  let s = getLocal(cookieStorage);
  if (s === undefined) return;
  let idx = -1;
  for (let i in s) {
    if (s[i].key === a) {
      idx = i;
    }
  }
  if (idx === -1) return;
  else s.splice(idx, 1);
  setLocal(cookieStorage, s);
};

// check for expiration
const checkCookie = function () {
  let s = getLocal(cookieStorage);
  if (s === undefined || s === null) s = [];
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i].expire <= new Date().getTime()) {
      s.splice(i, 1);
    }
  }
  setLocal(cookieStorage, s);
};

export {
  getLocal,
  setLocal,
  removeLocal,
  clearLocal,
  setCookieLocal,
  getCookieLocal,
  removeCookieLocal,
  checkCookie,
};
