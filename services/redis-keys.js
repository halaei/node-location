module.exports = {
    geokey: 'cur',
    geoStateKey: function(state) {
        return 'cur:'+state;
    },
    nodeKey: function(id) {
        return 'nd:'+id;
    },
    tripKey: function (nodeId, tripId) {
        return 't:'+nodeId+':'+tripId;
    }
};
