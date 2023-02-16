const Tasks = require("../models/Tasks");
const controllers = require("../controllers/controllers")

const router = require("express").Router()

router.get("/",controllers.getExecutions)


module.exports = router