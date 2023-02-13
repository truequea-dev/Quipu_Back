const rolesModels = require('../models/roles');
const permissionsmodels = require('../models/permissions');
const empresaModels = require('../models/empresa');
const {parseId} = require("../helpers/parserId");

class RolesAndPermissionsController {

  //get roles
  async getRoles(req, res){
    const { id, permissions, Employees_idEmployees } = req.authData;
    console.log(permissions);
    const roles = await rolesModels.find({})
    return res.status(200).send({
        success: true,
        message: 'Roles encontrados exitosamente',
        roles
    });
  }

  //get rol  por id
  async getRolById(req, res){
    if (req.params.id) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
    }
    const {id} = req.params;
    const roles = await rolesModels.findOne({_id: id})
    if (roles) {
      return res.status(200).send({
        success: true,
        message: 'rol encontrado exitosamente',
        roles
      });
    }else{
      return res.status(200).send({
        success: false,
        message: 'rol no encontrado'
      });
    }
  }

  //get rol  por id company
  async getRolByIdcompany(req, res){
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
    }
    const {id} = req.params;
    const roles = await rolesModels.find({Company_idCompany: id})
    if (roles) {
      return res.status(200).send({
        success: true,
        message: 'roles encontrados exitosamente',
        roles
      });
    }else{
      return res.status(200).send({
        success: false,
        message: 'roles no encontrados'
      });
    }
  }

  //Guardar rol
  async addRol(req, res){

    const {rolName, description, empresa_id} = req.body;

    const existRol =  await rolesModels.findOne({rolName})
    if (existRol !== null) return res.status(400).send({
        success: false,
        message: "ya existe este rol"
      });

    const existEmp =  await empresaModels.findOne({_id: empresa_id})
    if (!existEmp) return res.status(400).send({
        success: false,
        message: "Empresa no encontrada"
      });
    
    const newRol = new rolesModels({ 
        rolName,
        description
     });

    await newRol.save((err) => {
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
           message: "Rol agregado",
           newRol
         });
       }
    });

  }

   //actualizar rol por Id
  async updateRol(req, res) {

    if (!req.params.id) {
        return res.status(400).send({
            success: false,
            message: "no hay id"
          });
    }

    const {id} = req.params;
    const body = req.body

    rolesModels.findOne(
        {_id: id},
        (err, docs) => {
            if (err) return res.status(400).send({
                success: false,
                message: "id no valido"
            })
        })
    
    rolesModels.updateOne(
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

   //eliminar rol por Id
  async eliminarRol(req, res) {
    const {id} = req.params;
    rolesModels.deleteOne(
        {_id: id},
        (err, docs) => {
            if (err) return res.status(400).send({
                success: false,
                message: "error intente de nuevo"
            })
            return res.status(400).send({
                success: true,
                message: "rol eliminado"
            })
        })
  }


  ///////////////////////////////////////////////////////////////////////
  ///////////////            Permissions                 ////////////////
  ///////////////////////////////////////////////////////////////////////


  //get Permissions
  async getPermissions(req, res){
    const permiss = await permissionsmodels.find({})
    return res.status(200).send({
        success: true,
        message: 'Roles encontrados exitosamente',
        permiss
    });
  }
  
  //get Permissions por id
  async getPermissionsById(req, res){
      if (!req.params.id) {
        return res.status(400).send({
          success: false,
          message: 'id es requerido',
          });
      }
      const id = req.params.id;
      const permissions = await permissionsmodels.findOne({_id: id})
      if (permissions) {
        return res.status(200).send({
          success: true,
          message: 'Permiso encontrado exitosamente',
          permissions
        });
      }else{
        return res.status(200).send({
          success: false,
          message: 'Permiso no encontrado'
        });
      }
  }

  //add Permissions
  async addPermissions(req, res){

    const {read, write, remove, create, update, Roles_idRoles} = req.body;

    const rol =  await rolesModels.findOne({_id: Roles_idRoles})
    if (!rol) return res.status(400).send({
        success: false,
        message: "Rol no encontrado"
      });

    const exist =  await permissionsmodels.findOne({name})
    if (exist !== null) return res.status(400).send({
        success: false,
        message: "ya existe esa permiso"
      });
    
    const newpermission = new permissionsmodels({
        read, write, delete: remove, create, update,
        description,
        Roles_idRoles
     });

    await newpermission.save((err) => {
       if (err) {
         //console.log(`error guardar Salida: ${err}`);
         return res.status(403).send({
           success: false,
           message: err.message
         })
       }
       else {
         //console.log(`guardar Salida: OK`);
         return res.status(201).send({
           success: true,
           message: "permiso agregado",
           newpermission
         });
       }
    });

  }

  //actualizar Permissions por Id
  async editarPermissions(req, res) {

        if (!req.params.id) {
            return res.status(400).send({
                success: false,
                message: "no hay id"
              });
        }
    
        const id = req.params.id
        const body = req.body
    
        await permissionsmodels.findOne(
            {_id: id},
            (err, docs) => {
                if (err) return res.status(400).send({
                    success: false,
                    message: "id no valido"
                })
            })
        
        await permissionsmodels.updateOne(
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

    //eliminar Permissions por Id
   async eliminarPermissions(req, res) {
        const id = req.params.id
        const ifCat = await permissionsmodels.findOne({_id : id})
        if (!ifCat) {
          return res.status(400).send({
            success: true,
            message: "Permiso no encontrado"
        })
        }
        await permissionsmodels.deleteOne(
            {_id: parseId(id)},
            (err, docs) => {
                if (err) return res.status(400).send({
                    success: false,
                    message: "error intente de nuevo"
                })
                return res.status(400).send({
                    success: true,
                    message: "permiso eliminado"
                })
            })
   }

}

const rolesAndPermissionsController = new RolesAndPermissionsController();
module.exports = rolesAndPermissionsController;
