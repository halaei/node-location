module.exports = class Node {
    constructor(id, state = null, location = null) {
        this.id = id;
        this.state = state;
        this.location = location;
    }

    static fromJSON(str) {
        return Node.fromArray(JSON.parse(str));

    }
    static fromArray(arr) {
        return new Node(arr['id'], arr['state'] || null, arr['location'] || null);
    }
    toJson() {
        return JSON.stringify(this);
    }
};
