-- KEYS[1],         KEYS[2], KEYS[3]:
-- nodeKey(nodeId), geokey,  geoStateKey(state),
-- ARGV[1],  ARGV[2]:
-- nodeId,   {s: state}

-- Find the node:
local nd = redis.call('get', KEYS[1]);
local state = cjson.decode(ARGV[2]).s;
local geoStateKey;
if (not nd) then
    -- Create it if not found:
    nd = {
        id = ARGV[1],
        state = state,
        location = nil
    };
else
    -- Update & delete from previus state if found:
    nd = cjson.decode(nd);
    if (type(nd.state) == "string") then
        redis.call('zrem', KEYS[2]..':'..nd.state, nd.id);
    end
    nd.state = state
end
-- Save changes in the node:
redis.call('set', KEYS[1], cjson.encode(nd));
-- If node has current state, set the location in the state current locations:
if (type(nd.state) == "string" and type(nd.location) == "table") then
    redis.call('geoadd', KEYS[3], nd.location.lon, nd.location.lat, ARGV[1]);
end
-- return node
return cjson.encode(nd);
