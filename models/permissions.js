const mongoose = require('mongoose');

const PermissionsSchema = new mongoose.Schema({
    read: {type: Boolean, required: true},
    write: {type: Boolean, required: true},
    delete: {type: Boolean, required: true},
    update: {type: Boolean, required: true},
    create: {type: Boolean, required: true},
    extras: {type: Array, default: []},
    Roles_idRoles: {type: mongoose.Schema.Types.ObjectId, ref: 'Roles'}
});

module.exports = mongoose.model('Permissions', PermissionsSchema);