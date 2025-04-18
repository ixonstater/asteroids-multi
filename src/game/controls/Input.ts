import { IInput } from "./IInput";
import { MobileInput } from "./MobileInput";
import { PcInput } from "./PcInput";

export type InputCoords = {
    x: number;
    y: number;
};

export type InputMode = "PC" | "MOBILE";

export class Input {
    private _moveTo: InputCoords = { x: 0, y: 0 };
    private _firing: boolean = false;
    private _inputSource: IInput;

    get firing() {
        return this._firing;
    }

    get moveToX() {
        return this._moveTo.x;
    }

    get moveToY() {
        return this._moveTo.y;
    }

    public constructor(inputMode: InputMode) {
        if (inputMode === "PC") {
            this._inputSource = new PcInput(
                this._updatePosition,
                this._updateFiring
            );
        } else {
            this._inputSource = new MobileInput(
                this._updatePosition,
                this._updateFiring
            );
        }
    }

    private _updatePosition(inputCoords: InputCoords) {}

    private _updateFiring() {}
}
