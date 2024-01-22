const express = require("express");
const { Server } = require("socket.io");
var http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://vercel.com/ajay3008rock-gmailcom/chat-group-pxuj"); // Change this to the appropriate origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

var server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://vercel.com/ajay3008rock-gmailcom/chat-group-pxuj",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Chat BE with Socket.io");
  res.end();
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("newMessage", ({ newMessage, room }) => {
    io.in(room).emit("getLatestMessage", newMessage);
  });
});

const port = process.env.PORT || 9000;

server.listen(port, console.log(`web started at port ${port}`));
