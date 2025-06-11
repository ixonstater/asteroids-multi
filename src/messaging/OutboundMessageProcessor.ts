import { ShipColor } from "../game/ship/Ship";
import { JoinMessage } from "./messages/JoinMessage";

export class OutboundMessageProcessor {
    public socket: WebSocket;

    /**
     * Sends join lobby code
     */
    public sendJoin(color: ShipColor): void {
        const serialized: Uint8Array = new JoinMessage(color).toRequest();
        this.socket.send(serialized);
    }
}
