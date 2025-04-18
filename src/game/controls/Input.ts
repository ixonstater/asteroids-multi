export type InputCoords = {
    x: number;
    y: number;
};

export class Input {
    private _moveTo: InputCoords = { x: 0, y: 0 };
    private _firing: boolean = false;

    get firing() {
        return this._firing;
    }

    get moveToX() {
        return this._moveTo.x;
    }

    get moveToY() {
        return this._moveTo.y;
    }

    public useMobileInputs() {}

    public usePcInputs() {}
}
