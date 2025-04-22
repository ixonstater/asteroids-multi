import { Scene } from "phaser";
import { InputState } from "../controls/Input";
import { Ship, ShipAssetManifest } from "../ship/Ship";

export class BulletManager {
    // Bullets to display, owned and foreign
    private _bullets: Array<Bullet> = [];
    // Bullets to check for collision / delete
    private _ownedBullets: Array<Bullet> = [];
    private _lastBulletAdded: number = 0;
    private static bulletAddMinimumInterval: number = 150;

    public constructor(
        private _inputState: InputState,
        private _ship: Ship,
        private _scene: Scene
    ) {}

    private _addBullet(time: number, _: number) {
        const bullet = new Bullet(
            time,
            this._ship.direction.normalize(),
            this._ship.position,
            this._scene
        );
        this._bullets.push(bullet);
        this._ownedBullets.push(bullet);
    }

    public update(time: number, delta: number) {
        if (
            time - this._lastBulletAdded >
                BulletManager.bulletAddMinimumInterval &&
            this._inputState.firing
        ) {
            this._addBullet(time, delta);
            this._lastBulletAdded = time;
        }

        for (const bullet of this._bullets) {
            bullet.update(time, delta);
        }
    }
}

class Bullet {
    private _bullet: Phaser.GameObjects.Image;
    private static _baseRotation = Math.PI / 2;
    private _bulletVelocity = 0.4;
    private static _spawnForwardOffset = 3;

    constructor(
        private _spawnTime: number,
        // Direction must be normalized before handing it off here
        private _direction: Phaser.Math.Vector2,
        private _startPosition: Phaser.Math.Vector2,
        scene: Scene
    ) {
        _startPosition.x =
            _startPosition.x + _direction.x * Bullet._spawnForwardOffset;
        _startPosition.y =
            _startPosition.y + _direction.y * Bullet._spawnForwardOffset;

        this._bullet = scene.add
            .image(
                _startPosition.x,
                _startPosition.y,
                ShipAssetManifest.bulletAsset.path
            )
            .setRotation(_direction.angle() + Bullet._baseRotation)
            .setScale(0.25)
            .setDepth(-1);
    }

    public update(time: number, _: number) {
        const timeDifferential = time - this._spawnTime;
        this._bullet
            .setX(
                this._startPosition.x +
                    timeDifferential * this._bulletVelocity * this._direction.x
            )
            .setY(
                this._startPosition.y +
                    timeDifferential * this._bulletVelocity * this._direction.y
            );
    }
}
