import http from "http";
import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 9000;

const state = new Array(10000).fill(false);
let countUsers = 0;
app.use(express.static("public"));

io.on("connection", (socket) => {
    countUsers++;
    io.emit("live-users",countUsers)
    
    socket.on("checkbox-update", (data) => {
        state[data.index] = data.checked;
        io.emit("checkbox-update", data);
    });

    socket.on("disconnect" , ()=>{
        countUsers--;
        io.emit("live-users", countUsers)
    })

});

app.get("/state", (req, res) => {
    return res.status(200).json(state);
});

app.get("/health", (req, res)=>{
    return res.status(200).json({ message: "I am healthy!" });
})


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
