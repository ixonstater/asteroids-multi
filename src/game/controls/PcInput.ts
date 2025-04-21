import { IInput } from "./IInput";

export class PcInput extends IInput {
    public ready(): void {
        this._inputPlugin.on("pointerdown", (e: any) => {
            this._updateMoveTarget(true, new Phaser.Math.Vector2(e.x, e.y));
        });
        this._inputPlugin.on("pointermove", (e: any) => {
            if (e.isDown) {
                this._updateMoveTarget(true, new Phaser.Math.Vector2(e.x, e.y));
            }
        });

        this._inputPlugin.on("pointerup", () => this._updateMoveTarget(false));

        this._inputPlugin?.keyboard
            ?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .on("down", () => this._onFiringInput(true))
            .on("up", () => this._onFiringInput(false));
    }
}
