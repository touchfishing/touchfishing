import {
  setCookieLocal,
  getCookieLocal,
  removeCookieLocal,
} from "../plugins/storage.js";

import { cryptCookie, decryptCookie } from "./crypt.js";

// zh: 0  en: 1

class defSettings {
  #curSet;
  #setKey = "guesswhatlanguageusedandothersettings";
  constructor() {
    this.#readLocal();
  }
  #readLocal() {
    let tmp = getCookieLocal(cryptCookie(this.#setKey));
    if (tmp !== undefined) {
      this.#curSet = JSON.parse(decryptCookie(tmp));
    } else {
      this.#curSet = { language: 1 };
      // set language
      const usrlang = navigator.language || navigator.userLanguage;
      if (usrlang.indexOf("zh-CN") >= 0 || usrlang.indexOf("zh-SG") >= 0) {
        this.#curSet.language = 0;
      }
    }
  }
  get() {
    this.#readLocal();
    // console.log("init, read: ", this.#curSet.language);
    return this.#curSet;
  }
  set(k, w) {
    if (k !== undefined && k !== null) {
      // console.log("before set! ", this.#curSet);
      this.#readLocal();
      this.#curSet[k] = w;
      this.update();
      // console.log("after set! ", this.#curSet);
      return true;
    }
    return false;
  }
  update() {
    setCookieLocal(
      cryptCookie(this.#setKey),
      cryptCookie(JSON.stringify(this.#curSet)),
      45
    );
  }
  destroy() {
    removeCookieLocal(cryptCookie(this.#curSet));
  }
}

export default new defSettings();
