import express from "express"
import http from "http"
import {WebSocketServer} from "ws"
import {WebSocketPicture} from "./WebSocketPicture";


const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({server: server})


app.set("trust proxy", true)
app.use('/images', express.static('images'));

server.listen(3000)


app.get("*", (req, res) => {
  res.send("OK")
})


wss.on('connection', (ws, request) => {
  console.log("on Websocket Connection")

  // memori ri-ku
  let client: WebSocketPicture | null = new WebSocketPicture(ws, request)
  setTimeout(() => {
    client = null
    console.log("Client has been deleted due to Timeout")
  }, 10 * 60 * 1000)
});

// @ts-ignore
app.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
