import {
  setCookieLocal,
  getCookieLocal,
  removeCookieLocal,
} from "../plugins/storage.js";

import { cryptCookie, decryptCookie } from "./crypt.js";

class Cart {
  #cartKey = "cartskey";
  #cart; // {num, stores: [{},{},{}...]}
  // {}: grouped by store {id, name, items}
  // items[]: pid, title, tags, region, ship, num, selection, price[], spec[], stock[]
  constructor() {
    this.#getLocal();
  }
  #getLocal() {
    let tmp = getCookieLocal(cryptCookie(this.#cartKey));
    if (tmp !== undefined) {
      this.#cart = JSON.parse(decryptCookie(tmp));
    } else {
      this.#cart = { num: 0, stores: [] };
    }
  }
  #addSame(st, it) {
    // st: the items in store, it: the item to be added
    let found = false;
    for (let j of st) {
      if (j.pid === it.pid && j.selection === it.selection) {
        found = true;
        j.num = Math.min(j.num + it.num, j.stock[j.selection]);
        break;
      }
    }
    if (!found) {
      st.push(it);
      this.#cart.num += 1;
    }
  }

  get() {
    this.#getLocal();
    return this.#cart;
  }
  add(a) {
    this.#getLocal();
    let st = JSON.parse(JSON.stringify(a.store));
    delete a.store;
    let found = false;
    for (let i of this.#cart.stores) {
      // if in the store
      if (i.id === st.sid) {
        found = true;
        this.#addSame(i.items, a);
        break;
      }
    }
    if (!found) {
      // not in store
      this.#cart.stores.push({
        // new entry
        id: st.sid,
        name: st.sname,
        items: [a],
      });
      this.#cart.num += 1;
    }
    this.update();
  }
  remove(sid, pid, sel) {
    this.#getLocal();
    for (let i in this.#cart.stores) {
      if (this.#cart.stores[i].id === sid) {
        for (let j in this.#cart.stores[i].items) {
          if (
            this.#cart.stores[i].items[j].pid === pid &&
            this.#cart.stores[i].items[j].selection === sel
          ) {
            this.#cart.stores[i].items.splice(j, 1);
            if (this.#cart.stores[i].items.length === 0) {
              this.#cart.stores.splice(i, 1);
            }
            this.#cart.num -= 1;
            this.update();
            return true;
          }
        }
      }
    }
    return false;
  }
  changeNum(sid, pid, sel, num, check) {
    this.#getLocal();
    for (let i of this.#cart.stores) {
      if (i.id === sid) {
        for (let j of i.items) {
          if (j.pid === pid && j.selection === sel) {
            j.num = num;
            j.check = check;
            this.update();
            return true;
          }
        }
      }
    }
    return false;
  }

  update() {
    setCookieLocal(
      cryptCookie(this.#cartKey),
      cryptCookie(JSON.stringify(this.#cart)),
      45
    );
  }
  destroy() {
    removeCookieLocal(cryptCookie(this.#cartKey));
  }
}

export default new Cart();
