-- KEYS[1],         KEYS[2]:
-- nodeKey(nodeId), geokey,
-- ARGV[1],    ARGV[2]:
-- nodeId,     location

-- Find the node:
local nd = redis.call('get', KEYS[1]);
local location = cjson.decode(ARGV[2])
local geoStateKey;
if (not nd) then
    -- Create it if not found:
    nd = {
        id = ARGV[1],
        state = nil,
        location = location
    };
else
    -- Update it if found:
    nd = cjson.decode(nd);
    nd.location = location;
end
-- Save changes in the node:
redis.call('set', KEYS[1], cjson.encode(nd));
-- Set the location in all current locations.
redis.call('geoadd', KEYS[2], location.lon, location.lat, ARGV[1]);
-- If node has state, set the location in the state current locations:
if (nd.state) then
    geoStateKey = KEYS[2]..":"..nd.state;
    redis.call('geoadd', geoStateKey, location.lon, location.lat, ARGV[1]);
end
-- return node
return cjson.encode(nd);