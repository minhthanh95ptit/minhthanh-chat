var express = require("express")

var app = express()

var hostname = "localhost"
var port = 8017

app.get("/",(req,res) => {
    res.send("<h1>Hello Pham Minh Thanh</h1>")
});

app.listen(port, hostname,() =>{
    console.log("Hello Minh Thanh")
})
