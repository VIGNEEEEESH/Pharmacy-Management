const mongoose=require("mongoose")
const Schema=mongoose.Schema
const uniqueValidator=require("mongoose-unique-validator")
const medicineSchema=new Schema({
    medicineName:{type:String,required:true,unique:true},
    power:{type:Number,required:true},
    quantity:{type:Number,required:true},
    generic:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
})
medicineSchema.plugin(uniqueValidator)
module.exports=mongoose.model("Medicine",medicineSchema)