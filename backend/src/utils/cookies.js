const SESSION_TIMEOUT = 2*24*60*60*1000; // 2 days

function stringify(key, value, expiry) {
  return `${key}=${value}; Expires=${new Date(Date.now() + expiry).toUTCString()}; SameSite=None; Secure; HttpOnly;`;
}

function stringifyToken(token) {
  return stringify('cobu_sessionToken', token, SESSION_TIMEOUT);
}

function parse(str) {
  if (typeof str !== 'string')
    return {};

  let cookies = str.split(';');
  let pairs = {};
  cookies.forEach(p => {
    let [key, value] = p.split('=');
    if (typeof key === 'string' && typeof value === 'string')
      pairs[key.trim()] = value.trim();
  });
  return pairs;
}

module.exports = {
  stringify,
  stringifyToken,
  parse
};
