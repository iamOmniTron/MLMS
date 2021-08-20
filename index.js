const http = require("http");
const port = 8000;
const app = require("./app");

http.createServer(app).listen(port,()=>console.log(`server running on ${port}`));
