const Tasks = require("../models/Tasks")
const controllers = require("../controllers/controllers")
const router = require("express").Router()


router.delete("/",controllers.deleteTask)

module.exports = router