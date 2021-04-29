const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    image  : {
        type : String,
        required : true
    },
    price : {
        type : String,
        required : true
    },
    size : {
        type : String,
        required : true
    },
  
})
const Menu = mongoose.model('Menu',Schema)
module.exports = Menu