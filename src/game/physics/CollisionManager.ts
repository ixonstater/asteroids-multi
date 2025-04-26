import { Scene } from "phaser";
import { AsteroidManager } from "../entities/Asteroid";
import { BulletManager } from "../entities/Bullet";
import { Ship } from "../ship/Ship";

export class CollisionManager {
    constructor(
        private _ship: Ship,
        private _bulletManager: BulletManager,
        private _asteroidManager: AsteroidManager,
        private _scene: Scene
    ) {}

    public update(time: number, delta: number): boolean {
        return this._getShipCollision();
    }

    private _getShipCollision(): boolean {
        for (const asteroid of this._asteroidManager.asteroids.values()) {
            const collision = this._scene.matter.collision.collides(
                this._ship.ship.body as MatterJS.BodyType,
                asteroid.asteroidObject.body as MatterJS.BodyType,
                // Yuck but necessary
                null as any
            );

            if (collision) {
                return true;
            }
        }

        return false;
    }
}
