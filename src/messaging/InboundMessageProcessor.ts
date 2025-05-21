export class InboundMessageProcessor {
    private _socket: WebSocket;

    public setSocket(socket: WebSocket) {
        this._socket = socket;
        this._socket.addEventListener("message", this.routeMessage);
    }

    public async routeMessage(ev: MessageEvent) {
        const data: Blob = ev.data;
        console.log(await data.arrayBuffer());
    }
}
