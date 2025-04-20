import { Coords } from "./Input";

export type PositionInputHandler = (
    inputCoords: Coords,
    isAccelerating: boolean
) => void;
export type FiringInputHandler = (firing: boolean) => void;

export abstract class IInput {
    protected _updateMoveTarget: PositionInputHandler;
    protected _onFiringInput: FiringInputHandler;
    protected _inputPlugin: Phaser.Input.InputPlugin;

    public set inputPlugin(inputPlugin: Phaser.Input.InputPlugin) {
        this._inputPlugin = inputPlugin;
    }

    public set updateMoveTarget(func: PositionInputHandler) {
        this._updateMoveTarget = func;
    }

    public set onFiringInput(func: FiringInputHandler) {
        this._onFiringInput = func;
    }

    public ready() {}
}
