const crypto = require('crypto')

exports.encrypt = async (data) => {
    const ENC_KEY = "6fa979f20126cb08aa645a8f495f6d85"; // set random encryption key
    const IV = "7777777a72ddc2f1"; // set random initialisation vector
    const cipher = await crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV)
    let encrypted = await cipher.update(JSON.stringify(data), 'utf-8', 'base64')
    encrypted += await cipher.final('base64');
    return encrypted;
}

