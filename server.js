var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

var port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log("Server running on port " + port);
});

// io = require("socket.io")(3000, {
//   cors: {
//     origin: ["http://localhost:8080"],
//   },
// });

io.on("connection", (socket) => {
  // send a message to the client
  // socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });

  // receive a message from the client
  socket.on("send-message", (message, room) => {
    if (room === "") {
      socket.broadcast.emit("receive-message", message);
      console.log("No room selected");
    } else {
      socket.to(room).emit("receive-message", message);
    }
  });

  socket.on("send-color", (color, room) => {
    // socket.broadcast.emit("", color);
    if (room === "") {
      socket.broadcast.emit("receive-color", color);
      console.log("No room selected");
    } else {
      socket.to(room).emit("receive-color", color);
    }
  });

  socket.on("send-clear", (room) => {
    if (room === "") {
      socket.broadcast.emit("receive-clear");
      console.log("No room selected");
    } else {
      socket.to(room).emit("receive-clear");
    }
  });
  socket.on("send-increase", (size, room) => {
    if (room === "") {
      socket.broadcast.emit("receive-increase", size);
      console.log("No room selected");
    } else {
      socket.to(room).emit("receive-increase", size);
    }
  });
  socket.on("send-decrease", (size, room) => {
    if (room === "") {
      socket.broadcast.emit("receive-decrease", size);
      console.log("No room selected");
    } else {
      socket.to(room).emit("receive-decrease", size);
    }
  });

  socket.on("draw", (a, b, c, d, room) => {
    if (room === "") {
      socket.broadcast.emit("drawnow", a, b, c, d);
      console.log("No room selected");
    } else {
      socket.to(room).emit("drawnow", a, b, c, d);
    }
  });

  // io.of("/").adapter.on("join-room", (room, id) => {
  //   console.log(`socket ${id} has joined room ${room}`);
  //   socket.to(room).emit("send-message", `You have joined ${room}`, room);
  // });

  socket.on("join-room", (room) => {
    socket.join(room);
  });
});
