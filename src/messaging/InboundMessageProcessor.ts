export class InboundMessageProcessor {
    private _socket: WebSocket;

    public setSocket(socket: WebSocket) {
        this._socket = socket;
        this._socket.addEventListener("message", this.routeMessage);
    }

    public routeMessage(ev: MessageEvent) {
        console.log(ev.data);
    }
}
