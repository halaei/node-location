module.exports = {
    _push: `return tonumber(ARGV[])`,
    push : `
    local newlen = 0;
    redis.call('ltrim', KEYS[1], 0, ARGV[2] - 1);
    newlen = redis.call('lpush', KEYS[1], ARGV[1]);
    redis.call('expire', KEYS[1], ARGV[3]);
    return newlen;
    `
};