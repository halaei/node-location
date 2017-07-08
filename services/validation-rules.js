module.exports = {
    isId: function (value) {
        return ! Array.isArray(value) && ( typeof(value) === 'string' || parseInt(value) === value);
    },
    isLat: function (value) {
        return ! isNaN(value) && ! Array.isArray(value) && value >= -90 && value <= 90;
    },
    isLon: function (value) {
        return ! isNaN(value) && ! Array.isArray(value) && value >= -180 && value <= 180;
    },
    inRange: function (value, min, max) {
        console.log(value, min, max);
        return value >= min && value <= max;
    },
    isString: function (value, min, max) {
        return typeof(value) === 'string' && value.length <= max && value.length >= min;
    },
    isNullOrString: function (value, min, max) {
        return value === null || value === undefined || this.isString(value, min, max);
    }
};