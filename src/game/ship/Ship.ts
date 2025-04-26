import { Scene } from "phaser";
import { InputState } from "../controls/Input";
import { config } from "../main";

export const ShipAssetManifest = {
    shipAssets: {
        paths: [
            "ship_red.png",
            "ship_green.png",
            "ship_magenta.png",
            "ship_pink.png",
            "ship_yellow.png",
            "ship_blue.png",
        ],
        bodyPath: "bodies/ship.json",
    },
    bulletAsset: {
        path: "bullet.png",
        bodyPath: "bodies/bullet.json",
    },
};

export class Ship {
    // Unit vector for spawn direction
    private _facingDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
        1,
        0
    );
    private _velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private _maxVelocity: number = 3;
    private _ship: Phaser.GameObjects.Image;
    private static _acceleration = 0.00008;
    private static _velocityDeltaReducer = 0.09;
    private static _baseRotation = Math.PI / 2;

    public constructor(
        private _inputState: InputState,
        private _scene: Scene,
        private _shipImagePath: string
    ) {
        this._ship = this._scene.matter.add
            .image(
                config.width / 2,
                config.height / 2,
                this._shipImagePath,
                undefined,
                {
                    shape: this._scene.cache.json.get(
                        ShipAssetManifest.shipAssets.bodyPath
                    ),
                }
            )
            .setRotation(Ship._baseRotation)
            .setScale(0.3, 0.3);
    }

    public get direction() {
        return new Phaser.Math.Vector2().copy(this._facingDirection);
    }

    public get position() {
        return new Phaser.Math.Vector2(this._ship.x, this._ship.y);
    }

    public update(_: number, delta: number) {
        // Don't change rotation unless the ship is accelerating
        if (this._inputState.isAccelerating) {
            this._facingDirection.x = this._inputState.moveToX - this._ship.x;
            this._facingDirection.y = this._inputState.moveToY - this._ship.y;
            this._ship.setRotation(
                this._facingDirection.angle() + Ship._baseRotation
            );
        }

        const newVelocity = new Phaser.Math.Vector2(
            Ship._acceleration * delta * this._facingDirection.x +
                this._velocity.x,
            Ship._acceleration * delta * this._facingDirection.y +
                this._velocity.y
        );
        const currentVelocityMagnitude = this._velocity.length();

        if (
            (currentVelocityMagnitude < this._maxVelocity ||
                newVelocity.length() < currentVelocityMagnitude) &&
            this._inputState.isAccelerating
        ) {
            this._velocity = newVelocity;
        }

        this._ship.x += this._velocity.x * delta * Ship._velocityDeltaReducer;
        this._ship.y += this._velocity.y * delta * Ship._velocityDeltaReducer;
    }
}
