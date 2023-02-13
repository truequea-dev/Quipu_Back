const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  usuario: {type: String, maxLength: 45, required: true},
  password: {type: String, maxLength: 200, required: true},
  user_verified: {type: Boolean, default: false},
  Employees_idEmployees: {type: mongoose.Schema.Types.ObjectId, ref: 'Employees', autopopulate: true}
}, {
    timetamps: true
});

UserSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('User', UserSchema);