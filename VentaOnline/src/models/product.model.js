const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductsSchema = Schema({
    producto: String,
    stock: Number,
    precio: Number,
    ventas: Number,
    categoria: {type: Schema.Types.ObjectId, ref: "Categories"}
})

module.exports = mongoose.model("products", ProductsSchema)