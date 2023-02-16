const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    address:{type:String,required:true},
    taskName:{type:String,required:true},
    abi:{type:String,required:true},
    executions:{type:[{
        amount:{type:Number,required:false},
        hash:{type:String,required:false},
        time:{ type:Number,required:false}
    }],required:true},
    executoraddress:{type:String,required:true,unique:true},
    executorkey:{type:String,required:true,unique:true}
})

module.exports =  mongoose.model("Tasks",schema);

