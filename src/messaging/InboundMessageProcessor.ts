import { Buffer } from "buffer";
import { GenericMessage } from "./GenericMessage";
import { MessageUtils } from "./MessageUtils";

export class InboundMessageProcessor {
    private _socket: WebSocket;

    public setSocket(socket: WebSocket) {
        this._socket = socket;
        this._socket.addEventListener("message", this.routeMessage);
    }

    public async routeMessage(ev: MessageEvent) {
        const data: Blob = ev.data;
        const buffer = await data.arrayBuffer();
        const msg: GenericMessage = MessageUtils.deserialize(Buffer.from(buffer));
        console.log(msg);
    }
}
