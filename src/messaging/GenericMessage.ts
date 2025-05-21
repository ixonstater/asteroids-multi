export class GenericMessage {
    private _stringMessages: MessageSegment<string>[] = [];
    public get stringMessages(): MessageSegment<string>[] {
        return this._stringMessages;
    }

    private _floatMessages: MessageSegment<number>[] = [];
    public get floatMessages(): MessageSegment<number>[] {
        return this._floatMessages;
    }

    public GenericMessage(
        _stringMessages: MessageSegment<string>[],
        _floatMessages: MessageSegment<number>[]
    ) {
        this._stringMessages = _stringMessages ?? [];
        this._floatMessages = _floatMessages ?? [];
    }
}

export class MessageCodes {
    public readonly join: string = "j";
    public readonly inboundShip: string = "s";
    public readonly shipUpdate: string = "p";
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
