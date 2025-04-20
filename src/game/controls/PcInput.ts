import { IInput } from "./IInput";

export class PcInput extends IInput {
    public ready(): void {
        this._inputPlugin.on("pointerdown", (e: any) => {
            this._updateMoveTarget({ x: e.downX, y: e.downY }, true);
        });

        // Yes this does need to be downX and downY, we shouldn't set the ships target location to the mouse up location
        this._inputPlugin.on("pointerup", (e: any) =>
            this._updateMoveTarget({ x: e.downX, y: e.downY }, false)
        );

        this._inputPlugin?.keyboard
            ?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .on("down", () => this._onFiringInput(true))
            .on("up", () => this._onFiringInput(false));
    }
}
