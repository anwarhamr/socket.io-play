let io = require("socket.io-client");
let socket = io.connect("https://localhost:8989/", {
  reconnection: true,
  rejectUnauthorized: false,
  secure: true
});
let fs = require("fs");
let pageData = null;
fs.readFile(__dirname + "/data/eeeg_0_1004.dat", function(err, data) {
  if (err) {
    console.log("error reading file ", err);
  }
  pageData = data;
});
let connectionNo = 0;
socket.on("connect", function() {
  ++connectionNo;
  console.log("connected to localhost");
  socket.on("clientEvent", function(data) {
    console.log("message from the server:", data);
    socket.emit("serverEvent", "thanks server! for sending '" + data + "'");
  });
  let interval = setInterval(function() {
    socket.emit("clientEvent", {
      sn: "21qeqwe",
      connectionNo,
      page: Math.random(),
      pageData
    });
    console.log("message sent to the clients");
  }, 3000);
  socket.on("disconnect", function() {
    clearInterval(interval);
    interval = null;
    console.log(" disconnected");
  });
});
