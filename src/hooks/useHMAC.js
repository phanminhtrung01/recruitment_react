import CryptoJS from 'crypto-js';

export function calculateHMAC(data) {
    const key =
        '812T635266556A566U3272387552185F413F4428472B4B6250645367566B5970';

    const hashedData = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
    console.log(hashedData);
    const hmac = CryptoJS.HmacSHA512(hashedData, key);
    return hmac.toString(CryptoJS.enc.Hex);
}
