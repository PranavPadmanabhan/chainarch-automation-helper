const express = require("express")

const dotenv = require("dotenv");
const { listenToTaskCancellation } = require("./utils/helper-function");

dotenv.config()

const app = express();
const PORT = process.env.PORT || 8080;

app.use("/",(req,res) => {
    res.send("Hello")
})


app.listen(PORT,() => {
    console.log(`server running at http://localhost:${PORT}`)
    listenToTaskCancellation()
})