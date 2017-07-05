-- KEYS[1]: nodeKey(nodeId),
-- ARGV[1]: nodeId
local nd = redis.call('get', KEYS[1]);
if (nd) then
    nd = cjson.decode(nd);
    if (type(nd.trip_id) == "string") then
        redis.call('del', 't:'..ARGV[1]..':'..nd.trip_id)
    end
    nd.trip_id = nil;
    return redis.call('set', KEYS[1], cjson.encode(nd));
else
    return 0;
end
