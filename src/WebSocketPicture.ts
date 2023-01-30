import {WebSocket} from "ws";
import http from "http";
import {createCanvas} from "canvas";
import * as fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios"
const HOST = process.env.WEB_HOST || "https://kokoa.kokopi.me"

export class WebSocketPicture {
  ws: WebSocket
  url: string | null = null
  uuid: string

  constructor(ws: WebSocket, req: http.IncomingMessage) {
    this.ws = ws
    this.uuid = uuidv4()
    const canvas = createCanvas(1280, 720)
    const ctx = canvas.getContext('2d')
    const split = 1
    const wd = 1280 / split
    const length = 6
    let x = 0;
    let y = 0;

    this.ws.on("message", async (msg) => {
      // console.log(msg.toString())
      const data = msg.toString()

      if(data.startsWith("&")) {
        this.url = data.replace("&", "")
        return
      }

      for (let i = 0; i < data.length; i += length) {
        ctx.fillStyle = "#" + data.slice(i, i + length);
        ctx.fillRect(((y % split) * wd) + (i / length || 0), Math.floor(y / split), 1, 1);
      }
      y += 1

      if(y == 720) {
        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync(`./images/${this.uuid}.png`, buffer)
        if(this.url) {
          await axios.post(this.url, {
            content: `${HOST}/images/${this.uuid}.png`
          })
        }

        this.ws.send(`URL:${HOST}/images/${this.uuid}.png`)
        console.log("WebHook Send Done.")
        this.ws.close()
        return
      }
    })
  }

}
