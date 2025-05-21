export class GenericMessage {
    private _stringMessages: MessageSegment<String>[] = [];
    public get stringMessages(): MessageSegment<String>[] {
        return this._stringMessages;
    }

    private _floatMessages: MessageSegment<number>[] = [];
    public get floatMessages(): MessageSegment<number>[] {
        return this._floatMessages;
    }

    public static genericMessage(
        _stringMessages: MessageSegment<String>[] | null,
        _floatMessages: MessageSegment<number>[] | null
    ): GenericMessage {
        const genericMessage: GenericMessage = new GenericMessage();
        genericMessage._stringMessages = _stringMessages ?? [];
        genericMessage._floatMessages = _floatMessages ?? [];
        return genericMessage;
    }
}

export class MessageTypeCodes {
    public static readonly join: string = "j";
    public static readonly inboundShip: string = "s";
    public static readonly shipUpdate: string = "p";
}

export class MessageSegmentType {
    public static readonly FLOAT = 0x0;
    public static readonly STRING = 0x1;
}

export class MessageSegment<T> {
    private readonly _data: T;

    constructor(data: T) {
        this._data = data;
    }

    public get data(): T {
        return this._data;
    }
}
