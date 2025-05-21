import {
    GenericMessage,
    MessageSegment,
    MessageSegmentType,
} from "./GenericMessage";

// Basic format for messages is (type | segment | terminator)...
// Natural terminator and escape characters must be escaped
export class MessageUtils {
    private static readonly terminator = Buffer.from(";", "ascii")[0];
    private static readonly escape = Buffer.from("\\", "ascii")[0];

    /**
     * Messages are always serialized in a consistent format, string data first, float data second
     */
    public static serialize(msg: GenericMessage): Uint8Array {
        let serialMsg: number[] = [];

        for (const data of msg.stringMessages) {
            serialMsg = serialMsg.concat(this.serializeString(data.data));
        }

        for (const data of msg.floatMessages) {
            serialMsg = serialMsg.concat(this.serializeFloat(data.data));
        }

        return Uint8Array.from(serialMsg);
    }

    /**
     * Don't pass non-ascii characters here, you have been warned :)
     */
    private static serializeString(str: String): number[] {
        const bytes = this.escapeSpecialCharacters(Buffer.from(str, "ascii"));
        bytes.unshift(MessageSegmentType.STRING);
        bytes.push(this.terminator);
        return bytes;
    }

    /**
     * Serializes a float to a "byte" array
     * @param num
     * @returns bytes of the number
     */
    private static serializeFloat(num: number): number[] {
        const floatBytes = Buffer.allocUnsafe(4);
        floatBytes.writeFloatLE(num, 0);

        const bytes = this.escapeSpecialCharacters(floatBytes);
        bytes.unshift(MessageSegmentType.FLOAT);
        bytes.push(this.terminator);

        return bytes;
    }

    private static escapeSpecialCharacters(bytes: Buffer): number[] {
        const escapedData: number[] = [];
        for (const letter of bytes) {
            if (letter === this.escape || letter === this.terminator) {
                escapedData.push(this.escape, letter);
            } else {
                escapedData.push(letter);
            }
        }
        return escapedData;
    }

    public static deserialize(msg: Uint8Array | Buffer): GenericMessage {
        const message = new GenericMessage();
        let processingType: number | null = null;
        let escapeActive = false;
        const buffer = Buffer.alloc(1000); // 1kB buffer
        let bufferCount = 0;

        for (const letter of msg) {
            if (processingType === null) {
                processingType = this.getMessageTypeFromByte(letter);
                continue;
            }

            if (!escapeActive && letter === this.escape) {
                escapeActive = true;
                continue;
            }

            if (!escapeActive && letter === this.terminator) {
                this.addDeserializedSegmentToMessage(
                    message,
                    processingType,
                    buffer,
                    bufferCount
                );
                bufferCount = 0;
                processingType = null;
                continue;
            }

            buffer[bufferCount++] = letter;
            escapeActive = false;
        }

        return message;
    }

    private static addDeserializedSegmentToMessage(
        msg: GenericMessage,
        type: number,
        bytes: Buffer,
        byteCount: number
    ) {
        if (type === MessageSegmentType.STRING) {
            msg.stringMessages.push(
                new MessageSegment<string>(
                    bytes.toString("ascii", 0, byteCount)
                )
            );
        } else if (type === MessageSegmentType.FLOAT) {
            msg.floatMessages.push(
                new MessageSegment<number>(bytes.readFloatLE(0))
            );
        }
    }

    private static getMessageTypeFromByte(type: number): number {
        if (type === 0 || type === 1) {
            return type;
        }
        throw new MessageParseException(
            `Failed to parse data type from message byte: ${type}`
        );
    }
}

export class MessageParseException extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "MessageParseException";
    }
}
