"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const WebSocketPicture_1 = require("./WebSocketPicture");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server: server });
app.set("trust proxy", true);
app.use('/images', express_1.default.static('images'));
server.listen(3000);
app.get("*", (req, res) => {
    res.send("OK");
});
wss.on('connection', (ws, request) => {
    console.log("on Websocket Connection");
    // memori ri-ku
    let client = new WebSocketPicture_1.WebSocketPicture(ws, request);
    setTimeout(() => {
        client = null;
        console.log("Client has been deleted due to Timeout");
    }, 10 * 60 * 1000);
});
// @ts-ignore
app.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
