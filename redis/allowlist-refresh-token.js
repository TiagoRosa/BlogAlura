const redis = require('redis');
const manipulaLista = require('./manipla-lista');

const allowlist = redis.createClient({ prefix: 'allowlist-refresh-token:' });

module.exports = manipulaLista(allowlist);