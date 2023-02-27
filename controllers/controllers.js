
const ethers = require("ethers");
const Tasks = require("../models/Tasks");

const newTask = async(req,res) => {
    res.setHeader('Content-Type','application/json');
    if(req.body.address && req.body.abi,req.body.taskName){
      try {
        const wallet = new ethers.Wallet.createRandom()
        const privateKey = wallet.privateKey.toString()
        const newTask = new Tasks({
         address:req.body.address,
         abi:req.body.abi,
         executions:[],
         taskName:req.body.taskName,
         executoraddress:wallet.address,
         executorkey:privateKey.slice(2,privateKey.length)
        })
 
        const task = await newTask.save();
        res.status(201).json({
            executor:task.executoraddress,
            address:task.address,
            _id:task._id
        })
      } catch (error) {
        res.status(400).json({error:"something went wrong"})
      }
    }
    else {
        res.status(400).json({error:"something went wrong"})
    }
}

const deleteTask = async(req,res) => {
    if(req.query.address){
     try {
        await Tasks.deleteOne({address:req.query.address})
     res.status(200).json({message:"Done"})
     } catch (error) {
        res.status(400).json({error:"error"})
        
     }
    }
    else {
        res.status(400).json({error:"error"})
    }
}

const getExecutions = async(req,res) => {
    res.setHeader('Content-Type','application/json');
    if(req.query.id || req.query.address){
        try {
            let task;
        if(req.query.id){
            task = await Tasks.findById(req.query.id);
        }
        else {
            task = await Tasks.findOne({address:req.query.address});
        }
        res.status(200).json(task)
        } catch (error) {
        res.status(400).json({error:"error"})
            
        }
    }
    else {
        res.status(400).json({error:"error"})
    }
}

module.exports = {newTask,deleteTask,getExecutions}