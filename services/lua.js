var fs = require('fs');

module.exports = {
    setNodeLocation: fs.readFileSync(__dirname+'/lua/setNodeLocation.lua'),
    setNodeState: fs.readFileSync(__dirname+'/lua/setNodeState.lua'),
    deleteNode: fs.readFileSync(__dirname+'/lua/deleteNode.lua'),
    gc: fs.readFileSync(__dirname+'/lua/gc.lua')
};