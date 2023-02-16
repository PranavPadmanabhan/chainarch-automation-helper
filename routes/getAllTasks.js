const Tasks = require("../models/Tasks");

const router = require("express").Router()


router.get("/",async(req,res) => {
    Tasks.collection.find({}).toArray((err, data) => {
        res.status(200).json(data);
      });
})


module.exports = router