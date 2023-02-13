const mongoose = require('mongoose');

const RolesSchema = new mongoose.Schema({
    rolName: {type: String, maxLength: 45, required: true},
    description: {type: String, maxLength: 200, required: true},
    empresa_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Empresa'}
});

module.exports = mongoose.model('Roles', RolesSchema);