import { IInput } from "./IInput";
import { MobileInput } from "./MobileInput";
import { PcInput } from "./PcInput";

export type InputCoords = {
    x: number;
    y: number;
};

export type InputMode = "PC" | "MOBILE";

export class InputState {
    private _moveTo: InputCoords = { x: 0, y: 0 };
    private _isAccelerating: boolean = false;
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

    get isAccelerating() {
        return this._isAccelerating;
    }

    public constructor(
        inputMode: InputMode,
        inputPlugin: Phaser.Input.InputPlugin
    ) {
        if (inputMode === "PC") {
            this._inputSource = new PcInput();
        } else if (inputMode === "MOBILE") {
            this._inputSource = new MobileInput();
        }

        this._inputSource.updateMoveTarget = this._updateMoveTarget;
        this._inputSource.onFiringInput = this._updateFiring;
        this._inputSource.inputPlugin = inputPlugin;
        this._inputSource.ready();
    }

    private _updateMoveTarget(
        inputCoords: InputCoords,
        isAccelerating: boolean
    ) {
        this._moveTo.x = inputCoords.x;
        this._moveTo.y = inputCoords.y;
        this._isAccelerating = isAccelerating;
    }

    private _updateFiring(firing: boolean) {
        this._firing = firing;
    }
}
