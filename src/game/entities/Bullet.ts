import { Scene } from "phaser";
import { InputState } from "../controls/Input";
import { config } from "../main";
import { Ship, ShipAssetManifest } from "../ship/Ship";

export class BulletManager {
    private _bulletIdCount = 0;
    // Bullets to display, owned and foreign
    private _bullets: Map<number, Bullet> = new Map();
    // Bullets to check for collision / delete
    private _ownedBullets: Map<number, Bullet> = new Map();
    private _lastBulletAddedTime: number = 0;
    private _gameOver: boolean = false;
    private static bulletAddMinimumInterval: number = 150;

    public constructor(
        private _inputState: InputState,
        private _ship: Ship,
        private _scene: Scene
    ) {}

    public get ownedBulletObjects(): Map<number, Bullet> {
        return this._ownedBullets;
    }

    public set gameOver(gameOver: boolean) {
        this._gameOver = gameOver;
    }

    private _addBullet(time: number, _: number) {
        const bullet = new Bullet(
            time,
            this._ship.direction.normalize(),
            this._ship.position,
            this._scene
        );
        this._bullets.set(this._bulletIdCount, bullet);
        this._ownedBullets.set(this._bulletIdCount++, bullet);
    }

    public update(time: number, delta: number) {
        if (
            time - this._lastBulletAddedTime >
                BulletManager.bulletAddMinimumInterval &&
            this._inputState.firing &&
            !this._gameOver
        ) {
            this._addBullet(time, delta);
            this._lastBulletAddedTime = time;
        }

        for (const [bulletId, bullet] of this._bullets.entries()) {
            if (bullet.position.length() > config.width * 2) {
                bullet.discard();
                this._ownedBullets.delete(bulletId);
                this._bullets.delete(bulletId);
                continue;
            }

            bullet.update(time, delta);
        }
    }

    public onBulletCollision(bulletId: number) {
        const bullet = this._bullets.get(bulletId);
        if (bullet) {
            bullet.discard();
            this._bullets.delete(bulletId);
            this._ownedBullets.delete(bulletId);
        }
    }
}

class Bullet {
    private _bullet: Phaser.GameObjects.Image;
    private static _baseRotation = Math.PI / 2;
    private _bulletVelocity = 0.4;
    private static _spawnForwardOffset = 3;

    public get position() {
        return new Phaser.Math.Vector2(this._bullet.x, this._bullet.y);
    }

    public get bulletObject() {
        return this._bullet;
    }

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

        this._bullet = scene.matter.add
            .image(
                _startPosition.x,
                _startPosition.y,
                ShipAssetManifest.bulletAsset.path,
                undefined,
                {
                    shape: scene.cache.json.get(
                        ShipAssetManifest.bulletAsset.bodyPath
                    ),
                }
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

    public discard() {
        this._bullet.destroy();
    }
}
