const mongoose = require('mongoose');

const AccesosSchema = new mongoose.Schema({
  fecha_ini_acceso: {type: Date, default: Date.now},
  fecha_fnl_acceso: {type: Date, default: Date.now},
  UserId_idUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Accesos', AccesosSchema);