const http = require("node:http")
const fs = require("fs")


const server = http.createServer((req, res) => {
    console.log(req.url)
    if(req.url == '/'){
        res.write(fs.readFileSync("./src/index.html"))
    }
    else{
        res.write(fs.readFileSync("./src" + req.url))
    }
    res.end()
}).listen(8082, () => console.log("listening on 8082"))
