import { InputCoords } from "./Input";

export type PositionInputHandler = (inputCoords: InputCoords) => void;
export type FiringInputHandler = (firing: boolean) => void;

export abstract class IInput {
    constructor(
        protected _onPositionInput: PositionInputHandler,
        protected _onFiringInput: FiringInputHandler
    ) {}
}
