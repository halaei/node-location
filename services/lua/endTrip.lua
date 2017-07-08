-- KEYS[1]: nodeKey(nodeId),
-- KEYS[2]: tripKey(nodeId, tripId)
-- ARGV[1]: nodeId
-- ARGV[2]: tripId
local nd = redis.call('get', KEYS[1]);
redis.call('del', KEYS[2])
if (nd) then
    nd = cjson.decode(nd);
    if (nd.trip_id == ARGV[2]) then
        nd.trip_id = nil;
        redis.call('set', KEYS[1], cjson.encode(nd));
        return 1;
    end
end
return 0;
