let https = require("https");
let express = require("express");
let requestStats = require("request-stats");
let app = express();
let fs = require("fs");
let port = 8989;

app.get("/", function(req, res) {
  fs.readFile(__dirname + "/index.html", function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading index.html");
    }

    res.writeHead(200);
    res.end(data);
  });
});

let server = https
  .createServer(
    {
      key: fs.readFileSync("server.dev.key"),
      cert: fs.readFileSync("server.dev.cert")
    },
    app
  )
  .listen(port, function() {
    console.log(
      `Example app listening on port ${port}! Go to https://localhost:${port}/`
    );
  });
requestStats(server, function(stats) {
  // this function will be called every time a request to the server completes
  console.log(stats);
});
let io = require("socket.io")(server, {
  pingTimeout: 60000 // only necessary, so far, to make chrome not show the message that 'websocket is already closed...'
});
io.on("connection", function(socket) {
  console.log("connected:", socket.client.id);
  socket.on("clientEvent", function(data) {
    console.log("new message from client:", data);
    // fs.writeFile(
    //   __dirname + `/received/da${data.page}.dat`,
    //   data.pageData,
    //   "utf8",
    //   (err, r) => {
    //     console.log(err, r);
    //   }
    // );
  });

  socket.on("disconnect", function() {
    console.log(" disconnected");
  });
});
