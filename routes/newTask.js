const router = require("express").Router();
const controllers = require("../controllers/controllers")
const Tasks = require("../models/Tasks")

router.post("/",controllers.newTask)

module.exports = router
