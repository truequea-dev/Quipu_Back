const Empresamodels = require('../models/empresa');
const Usermodels = require('../models/user');
const permissionsModels = require('../models/permissions');
const Accesomodels = require('../models/Accesos');
const { encrypt, compare } = require('../helpers/handleBcrypt')
const {sendMailAdmin, sendMailVerifiedUsr} = require("../config/emailer");
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../validators/validateToken');

var currentDate = new Date();

class LoginController {

  //signUp
  async signup(req, res){
    const { usuario, password, telefono, email, estado_usuario, empresa_id } = req.body;

    const dataEmp = await Empresamodels.findOne({_id:empresa_id})
    if (dataEmp === null) {
      return res.status(403).send({
        success: false,
        message: 'id no encontrado en empresas'
      });
    }
    const ifEmail = await Usermodels.findOne({email})
    if (ifEmail) {
      return res.status(403).send({
        success: false,
        message: 'El correo ya esta registrado'
      });
    }

    const passwordHash = await encrypt(password)
    const newUser = new Usermodels({
      usuario,
      email,
      telefono,
      password: passwordHash,
      estado_usuario,
      empresa_id
     });
     try {
      await newUser.save();
      const token = jwt.sign({_id: newUser._id }, process.env.KEY_JWT)
      dataEmp.arrayUsersEmp = dataEmp.arrayUsersEmp.concat(newUser._id)
      await dataEmp.save();
      try {
        const newAcces = new Accesomodels({
          fecha_ini_acceso: currentDate
        })
        await newAcces.save();
        console.log(newAcces);
      } catch (error) {
        return console.log(error.message);
      }
      return res.status(201).send({
        success: true,
        message: "usuario creado correctamente",
        token,
        newUser
      });
     } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message
      });
     }
  }
  //signIn
  async signIn(req, res){
    const { email, password } = req.body;
    const user =  await Usermodels.findOne({usuario: email})
    if (!user) return res.status(404).send({
      success: false,
      message: "el usuario no existe"
    });

    const checkPassword = await compare(password, user.password)
    if (checkPassword) {
      const permissions =  await permissionsModels.findOne({Roles_idRoles: user.Employees_idEmployees.Roles_idRoles})
      const token = jwt.sign({
        _id: user._id,
        permissions,
        Employees_idEmployees: user.Employees_idEmployees._id
      }, process.env.KEY_JWT)
      try {
        const newAcces = new Accesomodels({
          fecha_ini_acceso: currentDate
        })
        await newAcces.save();
      } catch (error) {
        return console.log(error.message);
      }
      const usr =  await Usermodels.findOne({_id: user._id}, {password: 0})
      return res.status(200).json({
        success: true,
        message: "login exitoso",
        token,
        user: usr
      })
    } else {
      return res.status(403).send({
        success: false,
        message: "password incorrecto"
      });
    }
  }
}

const loginController = new LoginController();
module.exports = loginController;
