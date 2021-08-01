import CryptoJS from "crypto-js";

export default async (data) => {
    const KEY = process.env.REACT_APP_CRYPTO_KEY;
    const IV = process.env.REACT_APP_CRYPTO_IV;
    const cipher = await CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(KEY), {
        iv: CryptoJS.enc.Utf8.parse(IV)
    });
    let result = await cipher.toString(CryptoJS.enc.Utf8)
    return JSON.parse(result);
}

// padding: CryptoJS.pad.Pkcs7,
// mode: CryptoJS.mode.CBC