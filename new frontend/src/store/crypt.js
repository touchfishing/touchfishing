import AES from "crypto-js/aes";
import ENC from "crypto-js/enc-hex";
import ENCUTF8 from "crypto-js/enc-utf8";

const kkk = ENCUTF8.parse("adkjwas8q3iy"); //ENC.parse("adkjwas8q3iy")
const iiv = ENCUTF8.parse("124123da387");

function crypt_(txt, st, iv) {
  return AES.encrypt(txt, ENC.parse(st), { iv: ENC.parse(iv) }).toString();
}

function cryptCookie(txt) {
  return AES.encrypt(txt, kkk, { iv: iiv }).toString();
}
function decryptCookie(ha) {
  return AES.decrypt(ha, kkk, { iv: iiv }).toString(ENCUTF8);
}

export { AES, ENC, ENCUTF8, crypt_, cryptCookie, decryptCookie };
