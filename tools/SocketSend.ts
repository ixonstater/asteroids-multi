const readline = require("readline");
const WebSocketActual = require("ws");

// Sample serialized messages
// Terminator: 59
// Float code: 0
// String code: 1
// Join: 1,106,59,1,71,59

class SocketSend {
    private readonly _portArg: string = "port";
    private readonly _address: string = "address";
    constructor(private _argRecord: Record<string, string>) { }

    public start(): void {
        const socket = new WebSocketActual(
            `ws://${this._argRecord[this._address]}:${this._argRecord[this._portArg]
            }`
        );

        socket.addEventListener("open", () => {
            this._sendReceiveLoop(socket);
        });

        socket.addEventListener("message", (event: any) => {
            console.log(event.data);
        });
    }

    private _sendReceiveLoop(socket: any): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
        });

        rl.on("line", (line: any) => {
            socket.send(this._parseToByteArray(line));
        });
    }

    private _parseToByteArray(input: string): string {
        // Option to send a basic string, just prefix it with an "f"
        if (input[0] === "f") {
            return input.slice(1);
        }

        return input
            .split(",")
            .map((val: string) => {
                return String.fromCharCode(Number.parseInt(val));
            })
            .join("");
    }
}

function main(args: string[]) {
    let key: string | null = null;
    let value: string | null = null;
    let argRecord: Record<string, string> = {};

    for (const arg of args) {
        if (!key) {
            key = arg;
        } else if (!value) {
            value = arg;
        } else {
            argRecord[key] = value;
            key = arg;
            value = null;
        }
    }
    if (key && value) {
        argRecord[key] = value;
    }

    const obj = new SocketSend(argRecord);
    obj.start();
}

main(process.argv.slice(2));
