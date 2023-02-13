const mongoose = require('mongoose');

const EmployeesSchema = new mongoose.Schema({
    name: {type: String, maxLength: 45, required: true},
    description: {type: String, maxLength: 200},
    telefono: {type: String, maxLength: 30, default: ""},
    email: {type: String, maxLength: 65, required: true, unique: true},
    estado_usuario: {type: Boolean, required: true},
    Roles_idRoles: {type: mongoose.Schema.Types.ObjectId, ref: 'Roles'},
    Company_idCompany: {type: mongoose.Schema.Types.ObjectId, ref: 'Empresa'}
});

module.exports = mongoose.model('Employees', EmployeesSchema);