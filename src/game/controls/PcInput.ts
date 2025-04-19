import { IInput } from "./IInput";

export class PcInput extends IInput {
    public ready(): void {
        this._inputPlugin.on("pointerdown", (e: any) => {
            this._updateMoveTarget({ x: 0, y: 0 }, true);
        });

        this._inputPlugin.on("pointerup", (e: any) =>
            this._updateMoveTarget({ x: 0, y: 0 }, false)
        );
    }
}
