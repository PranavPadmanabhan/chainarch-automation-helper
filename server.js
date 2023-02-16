const express = require("express")
const mongoose = require("mongoose")
const NewTaskRoute = require("./routes/newTask")
const deleteTaskRoute = require("./routes/deleteTask")
const getExecutions = require("./routes/getExecution")
const AllTasks = require("./routes/getAllTasks")
const cors = require('cors')
const http = require("http");
const dotenv = require("dotenv");
const { listenToTaskCancellation, checkAutomation } = require("./utils/helper-function");

dotenv.config()

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

app.use(cors({origin:"*"}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use("/api/newtask",NewTaskRoute)
app.use("/api/tasks",AllTasks)
app.use("/deletetask",deleteTaskRoute)
app.use("/api/task",getExecutions)
app.get("/",(req,res) => {
    res.send("Hello")
})

mongoose.connect(process.env.MONGO_URL,() => {
console.log("connected to mongDB")
listenToTaskCancellation()
checkAutomation()

})


server.listen(PORT,() => {
    console.log(`server running at http://localhost:${PORT}`)

})