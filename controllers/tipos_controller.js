const {parseId} = require("../helpers/parserId");
var TiposProductomodels = require('../models/tiposProducto');
var TiposEmpresamodels = require('../models/tiposEmpresa');

class TiposController {

  //get tipo producto
  async getTypeProducto(req, res){
    const tipos = await TiposProductomodels.find({})
    res.json(tipos)
  }

  //get tipo producto por id
  async getTypeProductoById(req, res){
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
    }
    const id = req.params.id;
    const tipo = await TiposProductomodels.findOne({_id: id})
    if (tipo) {
      return res.status(200).send({
        success: true,
        message: 'tipo encontrado exitosamente',
        tipo
      });
    }else{
      return res.status(200).send({
        success: false,
        message: 'tipo no encontrada'
      });
    }
  }

  //Guardar tipo producto
  async addTypeProducto(req, res){

    const {nombre_type, descripcion_type} = req.body;

    const existCat =  await TiposProductomodels.findOne({nombre_type})
    if (existCat !== null) return res.status(400).send({
        success: false,
        message: "ya existe este tipo"
      });
    
    const newType = new TiposProductomodels({ 
      nombre_type,
      descripcion_type: descripcion_type || ""
     });

    await newType.save((err) => {
       if (err) {
         return res.status(403).send({
           success: false,
           message: err.message
         })
       }
       else {
         //console.log(`guardar Salida: OK`);
         return res.status(201).send({
           success: true,
           message: "tipo agregado",
           newType
         });
       }
    });

  }

   //actualizar tipo producto por Id
  async editartypeProducto(req, res) {

    if (!req.params.id) {
        return res.status(400).send({
            success: false,
            message: "no hay id"
          });
    }

    const id = req.params.id
    const body = req.body

    await TiposProductomodels.findOne(
        {_id: id},
        (err, docs) => {
            if (err) return res.status(400).send({
                success: false,
                message: "id no valido"
            })
        })
    
    await TiposProductomodels.updateOne(
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

   //eliminar tipo producto por Id
  async eliminarTypeProducto(req, res) {
    const id = req.params.id
    const idDeleteSal = await TiposProductomodels.findById({_id : id})
    if (!idDeleteSal) {
        return res.status(404).send({
          success: false,
          message: 'tipo no encontrado',
        });
    }
    await TiposProductomodels.deleteOne(
        {_id: parseId(id)},
        (err, docs) => {
            if (err) return res.status(400).send({
                success: false,
                message: "error intente de nuevo"
            })
            return res.status(400).send({
                success: true,
                message: "tipo eliminado"
            })
        })
  }


  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////             tipos Empresa              ////////////////
  ///////////////////////////////////////////////////////////////////////

  //get tipo empresa
  async getTypeEmpresa(req, res){
    const tipos = await TiposEmpresamodels.find({})
    res.json(tipos)
  }

  //get tipo empresa por id
  async getTypeEmpresaById(req, res){
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
    }
    const id = req.params.id;
    const tipo = await TiposEmpresamodels.findOne({_id: id})
    if (tipo) {
      return res.status(200).send({
        success: true,
        message: 'tipo encontrado exitosamente',
        tipo
      });
    }else{
      return res.status(200).send({
        success: false,
        message: 'tipo no encontrada'
      });
    }
  }

  //Guardar tipo
  async addTypeEmpresa(req, res){

    const {nombre_type, descripcion_type} = req.body;

    const existCat =  await TiposEmpresamodels.findOne({nombre_type})
    if (existCat !== null) return res.status(400).send({
        success: false,
        message: "ya existe este tipo"
      });
    
    const newType = new TiposEmpresamodels({ 
      nombre_type,
      descripcion_type: descripcion_type || ""
     });

    await newType.save((err) => {
       if (err) {
         return res.status(403).send({
           success: false,
           message: err.message
         })
       }
       else {
         //console.log(`guardar Salida: OK`);
         return res.status(201).send({
           success: true,
           message: "tipo agregado",
           newType
         });
       }
    });

  }

  //actualizar tipo empresa por Id
   async editarTypeEmpresa(req, res) {

        if (!req.params.id) {
            return res.status(400).send({
                success: false,
                message: "no hay id"
              });
        }
    
        const id = req.params.id
        const body = req.body
    
        await TiposEmpresamodels.findOne(
            {_id: id},
            (err, docs) => {
                if (err) return res.status(400).send({
                    success: false,
                    message: "id no valido"
                })
            })
        
        await TiposEmpresamodels.updateOne(
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
  
  //eliminar tipo empresa por Id
    async eliminarTypeEmpresa(req, res) {
        const id = req.params.id
        const idDeleteSal = await TiposEmpresamodels.findById({_id : id})
        if (!idDeleteSal) {
            return res.status(404).send({
              success: false,
              message: 'tipo no encontrado',
            });
        }
        await TiposEmpresamodels.deleteOne(
            {_id: parseId(id)},
            (err, docs) => {
                if (err) return res.status(400).send({
                    success: false,
                    message: "error intente de nuevo"
                })
                return res.status(400).send({
                    success: true,
                    message: "tipo eliminado"
                })
            })
  }

}

const tiposController = new TiposController();
module.exports = tiposController;
