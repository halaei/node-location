-- KEYS[1],         KEYS[2]:
-- nodeKey(nodeId), geokey,

-- Find the node key.
local nd = redis.call('get', KEYS[1]);
local geoStateKey;
if (not nd) then
    return 0;
end
nd = cjson.decode(nd);
-- Delete location from all current locations.
redis.call('zrem', KEYS[2], nd.id);
-- Delete location from state current locations.
if (nd.state) then
    geoStateKey = KEYS[2]..':'..nd.state;
    redis.call('zrem', geoStateKey, nd.id);
end
-- todo: delete trip
return 1;