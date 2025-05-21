import { GameObjects, Scene } from "phaser";
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
    explosionAsset: {
        path: "explosion.png",
        animationKey: "explosion",
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
    private _ship: GameObjects.Image;
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

    public get ship(): GameObjects.Image {
        return this._ship;
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

    public discard() {
        this._ship.destroy();
    }
}

export enum ShipColor {
    RED = 0,
    GREEN = 1,
    FUCHSIA = 2,
    PINK = 3,
    YELLOW = 4,
    BLUE = 5,
}

export class ShipColorConversion {
    public static readonly SHIP_RED = "R";
    public static readonly SHIP_GREEN = "G";
    public static readonly SHIP_FUCHSIA = "F";
    public static readonly SHIP_PINK = "P";
    public static readonly SHIP_YELLOW = "Y";
    public static readonly SHIP_BLUE = "B";

    public static shipColorFromCode(code: string): ShipColor {
        switch (code) {
            case ShipColorConversion.SHIP_RED:
                return ShipColor.RED;
            case ShipColorConversion.SHIP_GREEN:
                return ShipColor.GREEN;
            case ShipColorConversion.SHIP_FUCHSIA:
                return ShipColor.FUCHSIA;
            case ShipColorConversion.SHIP_PINK:
                return ShipColor.PINK;
            case ShipColorConversion.SHIP_YELLOW:
                return ShipColor.YELLOW;
            case ShipColorConversion.SHIP_BLUE:
                return ShipColor.BLUE;
            default:
                return ShipColor.RED;
        }
    }

    public static colorCodeFromShipColor(color: ShipColor): string {
        switch (color) {
            case ShipColor.RED:
                return ShipColorConversion.SHIP_RED;
            case ShipColor.GREEN:
                return ShipColorConversion.SHIP_GREEN;
            case ShipColor.FUCHSIA:
                return ShipColorConversion.SHIP_FUCHSIA;
            case ShipColor.PINK:
                return ShipColorConversion.SHIP_PINK;
            case ShipColor.YELLOW:
                return ShipColorConversion.SHIP_YELLOW;
            case ShipColor.BLUE:
                return ShipColorConversion.SHIP_BLUE;
            default:
                return ShipColorConversion.SHIP_RED;
        }
    }

    public static shipColorFromAssetPath(path: string): ShipColor {
        if (path.includes("red")) return ShipColor.RED;
        if (path.includes("green")) return ShipColor.GREEN;
        if (path.includes("fuchsia")) return ShipColor.FUCHSIA;
        if (path.includes("pink")) return ShipColor.PINK;
        if (path.includes("yellow")) return ShipColor.YELLOW;
        if (path.includes("blue")) return ShipColor.BLUE;
        // Default fallback
        return ShipColor.RED;
    }
}
