const mongoose=require("mongoose")
const Schema=mongoose.Schema
const uniqueValidator=require("mongoose-unique-validator")
const cartSchema=new Schema({
    name:{type:String,required:true,unique:true},
    
    medicines: [{medicineName:{type:String,required:true},quantity:{type:String,required:true},price:{type:String,required:true}}]
})
cartSchema.plugin(uniqueValidator)
module.exports=mongoose.model("Cart",cartSchema)