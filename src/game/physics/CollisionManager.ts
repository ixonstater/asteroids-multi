import { Scene } from "phaser";
import { AsteroidManager } from "../entities/Asteroid";
import { BulletManager } from "../entities/Bullet";
import { Ship } from "../ship/Ship";

export type BulletAsteroidCollisionPair = {
    bulletId: number;
    asteroidId: number;
};

export class CollisionManager {
    constructor(
        private _ship: Ship,
        private _bulletManager: BulletManager,
        private _asteroidManager: AsteroidManager,
        private _scene: Scene
    ) {}

    public update(): boolean {
        const bulletAsteroidCollisions = this._getBulletCollisions();
        for (const collision of bulletAsteroidCollisions) {
            this._bulletManager.onBulletCollision(collision.bulletId);
            this._asteroidManager.onAsteroidCollision(collision.asteroidId);
        }
        return this._getShipCollision();
    }

    private _getBulletCollisions(): BulletAsteroidCollisionPair[] {
        const bulletAsteroidCollisions = [];
        for (const [
            asteroidId,
            asteroid,
        ] of this._asteroidManager.asteroids.entries()) {
            for (const [
                bulletId,
                bullet,
            ] of this._bulletManager.ownedBulletObjects.entries()) {
                if (
                    this._scene.matter.collision.collides(
                        bullet.bulletObject.body as MatterJS.BodyType,
                        asteroid.asteroidObject.body as MatterJS.BodyType,
                        null as any
                    ) &&
                    // Don't allow shooting asteroids that can't break the ship
                    asteroid.asteroidObject.visible
                ) {
                    bulletAsteroidCollisions.push({
                        bulletId,
                        asteroidId,
                    });

                    // Only the first bullet found to collide with the asteroid will be removed
                    break;
                }
            }
        }
        return bulletAsteroidCollisions;
    }

    private _getShipCollision(): boolean {
        for (const asteroid of this._asteroidManager.asteroids.values()) {
            const collision = this._scene.matter.collision.collides(
                this._ship.ship.body as MatterJS.BodyType,
                asteroid.asteroidObject.body as MatterJS.BodyType,
                // Yuck but necessary
                null as any
            );

            // Don't blow up the ship if the portal spawns on it
            if (collision && asteroid.asteroidObject.visible) {
                return true;
            }
        }

        return false;
    }
}
