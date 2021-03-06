"use strict"

const ShoppingCart = require("../models/shoppingcart.model")
const User = require("../models/user.model")
const Product = require("../models/product.model");

function addProduct(req, res){
    var shoppingcartModel = ShoppingCart();
    var idUser = req.params.idUser;
    var params = req.body;

    if(idUser !=req.user.sub){
        return res.status(500).send({mesaje: "No tienes los permisos necesarios"})
    }else{
        if (req.user.rol === "ROL_ADMIN"){
            return res.status(500).send({mesaje: "No tienes los permisos necesarios"})
        }else{
            shoppingcartModel.usuario = idUser; 
            shoppingcartModel.producto = params.producto;
            shoppingcartModel.cantidad = params.cantidad;
            shoppingcartModel.estado = "ACTIVO"
            if (params.producto && params.cantidad){
                Product.findById((params.producto), {stock:1}, (err, productObtained)=>{
                    if (err) return res.status(500).send({mesaje: "Error en la petición"})
                    if (productObtained){
                        if (productObtained.stock >= params.cantidad){
                            shoppingcartModel.save((err, saveProduct)=>{
                                if (err) return res.status(500).send({mesaje: "Error en la petición"})
                                if (!saveProduct) return res.status(500).send({mesaje: "Erros al agregar el producto en el carrito de compras"})
                                return res.status(200).send({mesaje: "Se a agregado el producto al carrito de compras"})
                            })
                        }else{
                            return res.status(500).send({mesaje: "No hay esa cantidad de stock"})
                        }
                    }else{
                        return res.status(500).send({mesaje: "Ese producto no existe"})
                    }
                })
            }else{
                return res.status(500).send({mesaje: "Hacen falta datos"})
            }
        }
    }
}

function allProductsAdded(req, res){
    var idUser = req.params.idUser;

    if(idUser !=req.user.sub){
        return res.status(500).send({mesaje: "No tienes los permisos necesarios"})
    }else{
        if (req.user.rol === "ROL_ADMIN"){
            return res.status(500).send({mesaje: "No tienes los permisos necesarios"})
        }else{
            ShoppingCart.find({$or:[
                {usuario: idUser}
            ]}).exec((err, obtainedProduct)=>{
                if (err) return res.status(500).send({mesaje: "Error en la petición"})
                if (obtainedProduct.length>=1){
                    User.findById((idUser),(err, obtainedUser)=>{
                        if (err) return res.status(500).send({mesaje: "Error en la petición"})
                        console.log("")
                        console.log("Usuario: "+obtainedUser.usuario)
                        obtainedProduct.forEach(productObtained=>{
                            Product.findById((productObtained.producto), {producto:1, precio:1}, (err, products)=>{
                                if (err) return res.status(500).send({mesaje: "Error en la petición"})
                                console.log("")
                                console.log("Productos: "+products.producto)
                                console.log("Precio: "+products.precio)
                                console.log("Cantidad: "+productObtained.cantidad)
                            })
                        })
                    })
                    return res.status(500).send({mesaje: "Puedes revisar tu carrito de compras"})
                }else{
                    return res.status(500).send({mesaje: "No posees ningún producto en tu carrito"})
                }
            })
        }
    }
}

function editProductAdded(req, res){
    var idShoppingCart = req.params.idShoppingCart;
    var idUser = req.params.idUser;
    var params = req.body;

    if(idUser !=req.user.sub){
        return res.status(500).send({mesaje: "No tienes los permisos necesarios"})
    }else{
        if (req.user.rol === "ROL_ADMIN"){
            return res.status(500).send({mesaje: "No tienes los permisos necesarios"})
        }else{
            if (params.cantidad){
                if (params.cantidad >=1){
                    ShoppingCart.findByIdAndUpdate(idShoppingCart, params, {new:true}, (err, updateShoppingCart)=>{
                        if(err) return res.status(500).send({mesaje: "Error en la petición al actualizar"});
                        if(!updateShoppingCart) return res.status(500).send({mesaje: "No se pudo actualizar el usuario"});
                        return res.status(200).send({mesaje: "Se a actualizado el carrito de compras"});
                    })
                }else{
                    if (params.cantidad == 0){
                        ShoppingCart.findByIdAndDelete(idShoppingCart,(err, removedShoppingCart)=>{
                            if(err) return res.status(500).send({mesaje:"Error en la petición al eliminar"});
                            if(!removedShoppingCart) return res.status(500).send({mesaje:"Error al eliminar el usuario"});
                            return res.status(200).send({mesaje: "Se a eliminado el producto"});
                        })
                    }else{}
                }
            }else{
                return res.status(500).send({mesaje: "Hacen falta datos"});
            }
        }
    }
}

function deleteProductAdded(req, res){
    var idShoppingCart = req.params.idShoppingCart;
    var idUser = req.params.idUser;

    if(idUser !=req.user.sub){
        return res.status(500).send({mesaje: "No tienes los permisos necesarios"})
    }else{
        if (req.user.rol === "ROL_ADMIN"){
            return res.status(500).send({mesaje: "No tienes los permisos necesarios"})
        }else{
            ShoppingCart.findByIdAndDelete(idShoppingCart,(err, removedShoppingCart)=>{
                if(err) return res.status(500).send({mesaje:"Error en la petición al eliminar"});
                if(!removedShoppingCart) return res.status(500).send({mesaje:"Error al eliminar el usuario"});
                return res.status(200).send({mesaje: "Se a eliminado el producto"});
            })
        }
    }
}

module.exports={
    addProduct,
    allProductsAdded,
    editProductAdded,
    deleteProductAdded
}