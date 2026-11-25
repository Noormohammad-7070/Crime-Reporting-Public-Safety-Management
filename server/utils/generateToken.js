const jwt = require('jsonwebtoken');

module.exports = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'dev_secret_change_me', {
    expiresIn: '7d',
  });
};
