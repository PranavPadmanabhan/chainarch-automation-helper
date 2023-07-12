const Tasks = require("../models/Tasks");

const router = require("express").Router()


router.get("/",async(req,res) => {
    await Tasks.find({}).then((data) => {
        res.status(200).json(data);
      });
})


module.exports = router
