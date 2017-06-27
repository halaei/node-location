module.exports = {
    /**
     * KEYS[1]: list of recent locations of the node
     * KEYS[2]: geo-index of current locations
     *
     * ARGV[1]: json(lat, lon)
     * ARGV[2]: max length of list
     * ARGV[3]: expiry time of list
     * ARGV[4]: longitude
     * ARGV[5]: latitude
     * ARGV[6]: node number
     */
    push : `
    local newlen = 0;
    redis.call('geoadd', KEYS[2], tostring(ARGV[4]), tostring(ARGV[5]), tostring(ARGV[6]));
    redis.call('ltrim', KEYS[1], 0, ARGV[2] - 1);
    newlen = redis.call('lpush', KEYS[1], ARGV[1]);
    redis.call('expire', KEYS[1], ARGV[3]);
    return newlen;
    `


};