const Productomodels = require('../models//producto');

var currentDate = new Date();
var date = currentDate.getDate();
var month = currentDate.getMonth(); //Be careful! January is 0 not 1
var strMonts = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var monthName = strMonts[month]
var year = currentDate.getFullYear();

// let fecha = date + monthName + year;
let fecha = year + monthName + date ;

class ProductoController {

  //obtener todos los productos
  getAllProductos(req, res){

    Productomodels.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando productos");
        return;
      }
      if (doc !== null) {

        //console.log("listado de productos detalle");
        //console.log(doc);

        const productos = doc;
        //console.log("productos");
        //console.log(productos.length);
        //for (var i = 0; i > productos.length; i++) {
        //  for (var j = 0; j < productos.length; j++) {
        //    console.log(productos[i].cantidad);
        //   if (productos[i].cantidad == productos[j].cantidad) {
       // //      console.log(productos[j].codigo);
        //    }
        //  }
        //}

        return res.status(200).send({
          success: true,
          message: 'Productos recibidos satisfactoriamente',
          productos,
        });
      }
      else {
        console.log("productos no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno productos'
        });
      }
    });

  }

  //Guardar producto 
  async addProducto(req, res){
  
    const {nombre_producto, descripcion_producto, cantidad_producto, unidad_medida_producto, precio_compra_producto, precio_venta_producto, precio_venta_maximo_producto, precio_venta_minimo_producto, moneda_producto, referencia_producto, notas_producto, codigo_producto, fecha_inicial_producto, fecha_ult_actualizacion_producto, parametro_1_producto, parametro_2_producto, estado_producto, categoriaProducto_id, tiposProducto_id, empresa_id} = req.body

    const existCode = await Productomodels.findOne({ codigo_producto })
    if (existCode !== null) {
      return res.status(403).send({
        success: false,
        message: "num codigo_producto ya ha sido registrado"
      })
    }

    const dataEmp = await models.Empresa.findOne({ _id: empresa_id })
    if (dataEmp === null) {
      return res.status(403).send({
        success: false,
        message: 'id no encontrado en empresas'
      });
    }

    const existCat = await models.CategoriasProducto.findOne({ _id: categoriaProducto_id })
    if (!existCat) {
      return res.status(403).send({
        success: false,
        message: 'id no encontrado en categoria Producto'
      });
    }

    const existType = await models.TiposProducto.findOne({ _id: tiposProducto_id })
    if (!existType) {
      return res.status(403).send({
        success: false,
        message: 'id no encontrado en tipo Producto'
      });
    }

    const producto_nuevo = new Productomodels({
      nombre_producto,
      descripcion_producto,
      cantidad_producto, 
      unidad_medida_producto, 
      precio_compra_producto,
      precio_venta_producto, 
      precio_venta_maximo_producto, 
      precio_venta_minimo_producto, 
      moneda_producto, 
      referencia_producto, 
      notas_producto, 
      codigo_producto, 
      fecha_inicial_producto: fecha_inicial_producto || currentDate,
      fecha_ult_actualizacion_producto: fecha_ult_actualizacion_producto || currentDate,
      parametro_1_producto, 
      parametro_2_producto, 
      estado_producto,
      categoriaProducto_id,
      tiposProducto_id,
      empresa_id
    })

    try {
      const saveProduct = await producto_nuevo.save()
      dataEmp.arrayProductEmp = dataEmp.arrayProductEmp.concat(saveProduct._id)
      await dataEmp.save();
      return res.status(201).send({
        success: true,
        message: "producto agregado",
        saveProduct
      });
    } catch (error) {
        return res.status(403).send({
          success: false,
          message: error.message
        })
    }

  }

  //obtener producto por Id
  getOneProducto(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    //console.log(id)

    Productomodels.findOne({ _id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando producto por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando producto por id'
        });
      }
      if (doc !== null) {
        let producto = doc;
        return res.status(200).send({
          success: true,
          message: 'Producto encontrado exitosamente',
          producto,
        });
      }
      else {
        //console.log("producto no encontrado")
        return res.status(404).send({
          success: false,
          message: 'Producto no encontrado',
        });
      }
    });
  }

  //obtener producto por Id de empresa
  getOneProductoByIdEmp(req, res){

    if (!req.params.idemp) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.idemp;
    //console.log(id)

    Productomodels.find({ empresa_id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando producto por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando producto por id'
        });
      }
      if (doc !== null) {
        let productos = doc;
        return res.status(200).send({
          success: true,
          message: 'Producto encontrado exitosamente',
          productos
        });
      }
      else {
        //console.log("producto no encontrado")
        return res.status(404).send({
          success: false,
          message: 'Producto no encontrado',
        });
      }
    });
  }

  //eliminar producto por Id
  async deleteOneProducto(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;

    const idDeleteProd = await Productomodels.findById({_id : id})
    if (idDeleteProd === null) {
        return res.status(404).send({
          success: false,
          message: 'Producto no encontrado',
        });
    }
    
    const dataEmp = await models.Empresa.findById({_id : idDeleteProd.empresa_id})
    const arrayProd = dataEmp.arrayProductEmp;
    const indexProductDelet = arrayProd.indexOf(id);
    arrayProd.splice(indexProductDelet, 1)
    try {
      await dataEmp.save()
      const deleteProdt = await Productomodels.deleteOne({ _id: id})
      if (deleteProdt.deletedCount === 0) {
        return res.status(404).send({
          success: false,
          message: 'Producto no eliminado',
        });
      }else {
        return res.status(200).send({
          success: true,
          message: 'Producto eliminado exitosamente',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  //actualizar producto por Id
  updateProducto(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

     let id = req.params.id;
     Productomodels.findOne({ _id: id }, (err, doc) => {
       if (err) {
         //console.log("error retornando producto por id");
         return res.status(403).send({
           success: false,
           message: 'id no encontrado en productos'
         });
       }
       if (doc !== null) {
         const productoOld = doc;

         models.CategoriasProducto.findOne({ _id: req.body.categoriaProducto_id }, (err, doc) => {
          if (err) {
            return res.status(403).send({
              success: false,
              message: 'id no encontrado en categoria Producto'
            });
          }
        })

        models.TiposProducto.findOne({ _id: req.body.tiposProducto_id }, (err, doc) => {
          if (err) {
            return res.status(403).send({
              success: false,
              message: 'id no encontrado en tipos Producto'
            });
          }
        })

        models.Empresa.findOne({ _id: req.body.empresa_id }, (err, doc) => {
          if (err) {
            return res.status(403).send({
              success: false,
              message: 'id no encontrado en empresas'
            });
          }
        })

         if (req.body.nombre_producto != productoOld.nombre_producto) {
           productoOld.nombre_producto = req.body.nombre_producto;
         }
         if (req.body.descripcion_producto != productoOld.descripcion_producto) {
           productoOld.descripcion_producto = req.body.descripcion_producto;
         }
         if (req.body.cantidad_producto != productoOld.cantidad_producto) {
           productoOld.cantidad_producto = req.body.cantidad_producto;
         }
         if (req.body.unidad_medida_producto != productoOld.unidad_medida_producto) {
           productoOld.unidad_medida_producto = req.body.unidad_medida_producto;
         }
         if (req.body.precio_compra_producto != productoOld.precio_compra_producto) {
           productoOld.precio_compra_producto = req.body.precio_compra_producto;
         }
         if (req.body.precio_venta_producto != productoOld.precio_venta_producto) {
           productoOld.precio_venta_producto = req.body.precio_venta_producto;
         }
         if (req.body.precio_venta_maximo_producto != productoOld.precio_venta_maximo_producto) {
           productoOld.precio_venta_maximo_producto = req.body.precio_venta_maximo_producto;
         }
         if (req.body.precio_venta_minimo_producto != productoOld.precio_venta_minimo_producto) {
           productoOld.precio_venta_minimo_producto = req.body.precio_venta_minimo_producto;
         }
         if (req.body.moneda_producto != productoOld.moneda_producto) {
           productoOld.moneda_producto = req.body.moneda_producto;
         }
         if (req.body.referencia_producto != productoOld.referencia_producto) {
           productoOld.referencia_producto = req.body.referencia_producto;
         }
         if (req.body.notas_producto != productoOld.notas_producto) {
           productoOld.notas_producto = req.body.notas_producto;
         }
         if (req.body.parametro_1_producto != productoOld.parametro_1_producto) {
           productoOld.parametro_1_producto = req.body.parametro_1_producto;
         }
         if (req.body.parametro_2_producto != productoOld.parametro_2_producto) {
           productoOld.parametro_2_producto = req.body.parametro_2_producto;
         }
         if (req.body.estado_producto != productoOld.estado_producto) {
           productoOld.estado_producto = req.body.estado_producto;
         }
         if (req.body.categoriaProducto_id != productoOld.categoriaProducto_id) {
           productoOld.categoriaProducto_id = req.body.categoriaProducto_id;
         }
         if (req.body.tiposProducto_id != productoOld.tiposProducto_id) {
           productoOld.tiposProducto_id = req.body.tiposProducto_id;
         }
         if (req.body.empresa_id != productoOld.empresa_id) {
           productoOld.empresa_id = req.body.empresa_id;
         }

         productoOld.fecha_ult_actualizacion_producto = currentDate;

         Productomodels.updateOne(
           { _id: id},
           { $set: productoOld},
           (err, doc) => {
             if (err) {
               return res.status(404).send({
                 success: false,
                 message: 'Producto no encontrado',
               });
             }
             return res.status(201).send({
               success: true,
               message: 'Producto actualizado satisfactoriamente'
             });
           }
         )}
       else {
         //console.log("producto no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Producto no encontrado',
         });
       }
     })
   }

 //obtener producto por codigo
 getOneProductoCodigo(req, res){

   if (!req.params.codigo) {
    return res.status(400).send({
      success: false,
      message: 'codigo producto es requerido',
      });
    }

   let codigo_producto = req.params.codigo;

   Productomodels.findOne({ codigo_producto }, (err, doc2) => {
     if (err) {
       //console.log("error retornando producto por codigo");
       return res.status(403).send({
         success: false,
         message: 'error retornando producto por codigo'
       });
     }
     if (doc2 !== null) {
       let producto = doc2;
       return res.status(200).send({
         success: true,
         message: 'Producto encontrado exitosamente',
         producto,
       });
     }
     else {
       //console.log("producto no encontrado")
       return res.status(404).send({
         success: false,
         message: 'Producto no encontrado',
       });
     }
   });
 }

}

const productoController = new ProductoController();
module.exports = productoController;
