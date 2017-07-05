-- KEYS[1]: nodeKey(nodeId),
-- ARGV[1]: nodeId
-- ARGV[2]: tripId
local nd = redis.call('get', KEYS[1]);
if (nd) then
    nd = cjson.decode(nd);
    if (type(nd.trip_id) == "string" and nd.trip_id ~= ARGV[2]) then
        redis.call('del', 't:'..ARGV[1]..':'..nd.trip_id)
    end
    nd.trip_id = ARGV[2];
else
    nd = {id = ARGV[1], location = nil, state = nil, trip_id = ARGV[2]};
end
return redis.call('set', KEYS[1], cjson.encode(nd));