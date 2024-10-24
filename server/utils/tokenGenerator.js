const crypto = require('crypto');

exports.generateUniqueToken = () => {
  return crypto.randomBytes(12).toString('hex').toUpperCase();
};