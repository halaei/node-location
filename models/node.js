module.exports = class Node {
    constructor(id, state = null, location = null, trip_id = null) {
        this.id = id;
        this.state = state;
        this.location = location;
        this.trip_id = trip_id;
    }

    static fromJSON(str) {
        return Node.fromArray(JSON.parse(str));

    }
    static fromArray(arr) {
        return new Node(
            arr['id'],
            arr['state'] || null,
            arr['location'] || null,
            arr['trip_id'] || null
        );
    }
    toJson() {
        return JSON.stringify(this);
    }
};
