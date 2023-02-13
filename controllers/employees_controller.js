const rolesModels = require('../models/roles');
const empresaModels = require('../models/empresa');
const employeesmodels = require('../models/employees');
const {parseId} = require("../helpers/parserId");

class EmployeesController {

  //get Employees
  async getEmployees(req, res){
    const Employees = await employeesmodels.find({})
    return res.status(200).send({
        success: true,
        message: 'Empleados encontrados exitosamente',
        Employees
    });
  }

  //get Employees  por id
  async getEmployeesById(req, res){
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
    }
    const {id} = req.params;
    const Employees = await employeesmodels.findOne({_id: id})
    if (Employees) {
      return res.status(200).send({
        success: true,
        message: 'Empleado encontrado exitosamente',
        Employees
      });
    }else{
      return res.status(200).send({
        success: false,
        message: 'empleado no encontrado'
      });
    }
  }

  //get Employees  por id company
  async getEmployeesByIdcompany(req, res){
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
    }
    const {id} = req.params;
    const Employees = await employeesmodels.find({Company_idCompany: id})
    if (Employees) {
      return res.status(200).send({
        success: true,
        message: 'Empleados encontrados exitosamente',
        Employees
      });
    }else{
      return res.status(200).send({
        success: false,
        message: 'Empleados no encontrados'
      });
    }
  }

  //Guardar Employees
  async addEmployees(req, res){

    const {name, description, telefono, email, estado_usuario, Roles_idRoles, Company_idCompany} = req.body;
    const rol =  await rolesModels.findOne({_id: Roles_idRoles})
    if (!rol) return res.status(400).send({
        success: false,
        message: "Rol no encontrado"
    });
    if (!Comp) return res.status(400).send({
        success: false,
        message: "Empresa no encontrado"
    });
    const existEmail =  await employeesmodels.findOne({email})
    if (existEmail !== null) return res.status(400).send({
        success: false,
        message: "El email ya esta en uso"
      });
    
    const newEmployees = new employeesmodels({ 
        name,
        description,
        telefono,
        email,
        estado_usuario: estado_usuario || true,
        Roles_idRoles,
        Company_idCompany
     });

    await newEmployees.save((err) => {
       if (err) {
         console.log(`error guardar Rol: ${err}`);
         return res.status(403).send({
           success: false,
           message: err.message
         })
       }
       else {
         //console.log(`guardar Salida: OK`);
         return res.status(201).send({
           success: true,
           message: "Empleando agregado",
           newEmployees
         });
       }
    });

  }

   //actualizar Employees por Id
  async updateEmployees(req, res) {

    if (!req.params.id) {
        return res.status(400).send({
            success: false,
            message: "no hay id"
          });
    }

    const {id} = req.params;
    const body = req.body

    await employeesmodels.findOne(
        {_id: id},
        (err, docs) => {
            if (err) return res.status(400).send({
                success: false,
                message: "id no valido"
            })
        })
    
    await employeesmodels.updateOne(
        {_id: parseId(id)},
        body,
        (err, docs) => {
            if (err) return res.status(400).send({
                success: false,
                message: "error intente de nuevo"
            })
            return res.status(400).send({
                success: true,
                message: "actualización exitosa"
            })
        })
  }

   //eliminar Employees por Id
  async eliminarEmployees(req, res) {
    const {id} = req.params;
    rolesModels.deleteOne(
        {_id: parseId(id)},
        (err, docs) => {
            if (err) return res.status(400).send({
                success: false,
                message: "error intente de nuevo"
            })
            return res.status(400).send({
                success: true,
                message: "empleado eliminado"
            })
        })
  }
}

const employeesController = new EmployeesController();
module.exports = employeesController;
