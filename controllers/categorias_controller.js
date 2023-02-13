const CategoriasProductomodels = require('../models/categoriasProducto');
const CategoriasEmpresamodels = require('../models/categoriasEmpresa');
const {parseId} = require("../helpers/parserId");

class CategoriasController {

  //get categorias producto
  async getCategoriaProducto(req, res){
    const categorias = await CategoriasProductomodels.find({})
    res.json(categorias)
  }

  //get categorias producto por id
  async getCategoriaProductoById(req, res){
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
    }
    const id = req.params.id;
    const categoria = await CategoriasProductomodels.findOne({_id: id})
    if (categoria) {
      return res.status(200).send({
        success: true,
        message: 'categoria encontrada exitosamente',
        categoria
      });
    }else{
      return res.status(200).send({
        success: false,
        message: 'categoria no encontrada'
      });
    }
  }

  //Guardar categoria producto
  async addCategoriaProducto(req, res){

    const {nombre_categoria, descripcion_categoria} = req.body;

    const existCat =  await CategoriasProductomodels.findOne({nombre_categoria})
    if (existCat !== null) return res.status(400).send({
        success: false,
        message: "ya existe esa categoria"
      });
    
    const newCategory = new CategoriasProductomodels({ 
        nombre_categoria,
        descripcion_categoria: descripcion_categoria || ""
     });

    await newCategory.save((err) => {
       if (err) {
         console.log(`error guardar Salida: ${err}`);
         return res.status(403).send({
           success: false,
           message: err.message
         })
       }
       else {
         //console.log(`guardar Salida: OK`);
         return res.status(201).send({
           success: true,
           message: "categoria agregado",
           newCategory
         });
       }
    });

  }

   //actualizar categoria producto por Id
  async editarCategoriaProducto(req, res) {

    if (!req.params.id) {
        return res.status(400).send({
            success: false,
            message: "no hay id"
          });
    }

    const id = req.params.id
    const body = req.body

    await CategoriasProductomodels.findOne(
        {_id: id},
        (err, docs) => {
            if (err) return res.status(400).send({
                success: false,
                message: "id no valido"
            })
        })
    
    await CategoriasProductomodels.updateOne(
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

   //eliminar categoria producto por Id
  async eliminarCategoriaProducto(req, res) {
    const id = req.params.id
    await CategoriasProductomodels.deleteOne(
        {_id: parseId(id)},
        (err, docs) => {
            if (err) return res.status(400).send({
                success: false,
                message: "error intente de nuevo"
            })
            return res.status(400).send({
                success: true,
                message: "categoria eliminada"
            })
        })
  }


  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////         categoria Empresa              ////////////////
  ///////////////////////////////////////////////////////////////////////


  //get categorias empresa
  async getCategoriaEmpresa(req, res){
    const categorias = await CategoriasEmpresamodels.find({})
    res.json(categorias)
  }
  
  //get categorias empresa por id
  async getCategoriaEmpresaById(req, res){
      if (!req.params.id) {
        return res.status(400).send({
          success: false,
          message: 'id es requerido',
          });
      }
      const id = req.params.id;
      const categoria = await CategoriasEmpresamodels.findOne({_id: id})
      if (categoria) {
        return res.status(200).send({
          success: true,
          message: 'categoria encontrada exitosamente',
          categoria
        });
      }else{
        return res.status(200).send({
          success: false,
          message: 'categoria no encontrada'
        });
      }
  }

  //Guardar categoria
  async addCategoriaEmpresa(req, res){

    const {nombre_categoria, descripcion_categoria} = req.body;

    const existCat =  await CategoriasEmpresamodels.findOne({nombre_categoria})
    if (existCat !== null) return res.status(400).send({
        success: false,
        message: "ya existe esa categoria"
      });
    
    const newCategory = new CategoriasEmpresamodels({ 
        nombre_categoria,
        descripcion_categoria: descripcion_categoria || ""
     });

    await newCategory.save((err) => {
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
           message: "categoria agregado",
           newCategory
         });
       }
    });

  }

  //actualizar categoria empresa por Id
  async editarCategoriaEmpresa(req, res) {

        if (!req.params.id) {
            return res.status(400).send({
                success: false,
                message: "no hay id"
              });
        }
    
        const id = req.params.id
        const body = req.body
    
        await CategoriasEmpresamodels.findOne(
            {_id: id},
            (err, docs) => {
                if (err) return res.status(400).send({
                    success: false,
                    message: "id no valido"
                })
            })
        
        await CategoriasEmpresamodels.updateOne(
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

    //eliminar categoria empresa por Id
   async eliminarCategoriaEmpresa(req, res) {
        const id = req.params.id
        const ifCat = await CategoriasEmpresamodels.findOne({_id : id})
        if (!ifCat) {
          return res.status(400).send({
            success: true,
            message: "categoria no encontrada"
        })
        }
        await CategoriasEmpresamodels.deleteOne(
            {_id: parseId(id)},
            (err, docs) => {
                if (err) return res.status(400).send({
                    success: false,
                    message: "error intente de nuevo"
                })
                return res.status(400).send({
                    success: true,
                    message: "categoria eliminada"
                })
            })
   }

}

const categoriasController = new CategoriasController();
module.exports = categoriasController;
