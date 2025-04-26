import { GameObjects, Scene } from "phaser";
import { config } from "../main";

export const AsteroidAssetManifest = {
    asteroids: [
        {
            key: "asteroid1",
            imagePath: "asteroid_1.png",
            bodyPath: "bodies/asteroid_1.json",
        },
        {
            key: "asteroid2",
            imagePath: "asteroid_2.png",
            bodyPath: "bodies/asteroid_2.json",
        },
        {
            key: "asteroid3",
            imagePath: "asteroid_3.png",
            bodyPath: "bodies/asteroid_3.json",
        },
        {
            key: "asteroid4",
            imagePath: "asteroid_4.png",
            bodyPath: "bodies/asteroid_4.json",
        },
    ],
};

export class AsteroidManager {
    private _asteroidIdCount: number = 0;
    private _asteroids: Map<number, Asteroid> = new Map();
    private _portal: Phaser.GameObjects.Ellipse;
    private _spawner: AsteroidSpawner;
    private _asteroidSpawnEventComplete: boolean = true;
    private _asteroidSpawnEventStartTime: number = 0;
    private __asteroidSpawnEventDuration: number = 6000;
    public static maxVelocity: number = 0.2;

    public constructor(scene: Scene) {
        this._spawner = new AsteroidSpawner();
        this._portal = scene.add
            .ellipse(0, 0, 100, 100, 0x0000ff)
            .setVisible(false);
    }

    public update(time: number, delta: number, scene: Scene) {
        // Start spawning new asteroids
        if (this._asteroids.size < 1 && this._asteroidSpawnEventComplete) {
            const [asteroids, portalLocation] =
                this._spawner.createAsteroids(scene);
            this._portal.x = portalLocation.x;
            this._portal.y = portalLocation.y;
            this._portal.setVisible(true);

            for (const asteroid of asteroids) {
                this._asteroids.set(this._asteroidIdCount++, asteroid);
            }

            this._asteroidSpawnEventStartTime = time;
            this._asteroidSpawnEventComplete = false;
        }
        // Update existing asteroids
        else if (this._asteroidSpawnEventComplete) {
            for (const [_, asteroid] of this._asteroids.entries()) {
                asteroid.update(time, delta);
            }
        }
        // Finish spawning new asteroids
        else if (
            !this._asteroidSpawnEventComplete &&
            time >
                this._asteroidSpawnEventStartTime +
                    this.__asteroidSpawnEventDuration
        ) {
            this._portal.setVisible(false);
            for (const asteroid of this._asteroids.values()) {
                asteroid.startTime = time;
                asteroid.setVisible(true);
            }
            this._asteroidSpawnEventComplete = true;
        }
    }
}

// Eventually most of this classes functionality will be moved to the server
export class AsteroidSpawner {
    private _level: number = 1;

    public createAsteroids(
        scene: Scene
    ): [Array<Asteroid>, Phaser.Math.Vector2] {
        const portalLocation = this._pickPortalLocation();
        const asteroids: Array<Asteroid> = [];

        for (let i = 0; i < this._level; i++) {
            const velocity = this._getRandomVelocity();
            const asteroidImage = this._getRandomAsteroidImage(
                scene,
                portalLocation
            );
            asteroids.push(
                new Asteroid(
                    asteroidImage,
                    AsteroidSize.AsteroidLarge,
                    velocity,
                    portalLocation
                )
            );
        }

        this._level++;

        return [asteroids, portalLocation];
    }

    private _pickPortalLocation(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(
            Phaser.Math.Between(0, config.width),
            Phaser.Math.Between(0, config.height)
        );
    }

    private _getRandomVelocity(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(
            Phaser.Math.FloatBetween(
                -1 * AsteroidManager.maxVelocity,
                AsteroidManager.maxVelocity
            ),
            Phaser.Math.FloatBetween(
                -1 * AsteroidManager.maxVelocity,
                AsteroidManager.maxVelocity
            )
        );
    }

    private _getRandomAsteroidImage(scene: Scene, portal: Phaser.Math.Vector2) {
        const selectedAsteroidKey =
            AsteroidAssetManifest.asteroids[
                Phaser.Math.Between(
                    0,
                    AsteroidAssetManifest.asteroids.length - 1
                )
            ].key;

        return scene.matter.add
            .image(portal.x, portal.y, selectedAsteroidKey, undefined, {
                shape: scene.cache.json.get(selectedAsteroidKey),
            })
            .setVisible(false);
    }
}

enum AsteroidSize {
    AsteroidSmall = 0,
    AsteroidMedium = 1,
    AsteroidLarge = 2,
}

export class Asteroid {
    private static readonly _loopBorderWidth: number = 50;
    private static readonly _asteroidScale: number[] = [0.3, 0.5, 0.8];
    private _startTime: number;

    public constructor(
        private _asteroid: GameObjects.Image,
        private _size: AsteroidSize,
        private _velocity: Phaser.Math.Vector2,
        private _startLocation: Phaser.Math.Vector2
    ) {
        _asteroid.setScale(Asteroid._asteroidScale[this._size]);
    }

    public set startTime(time: number) {
        this._startTime = time;
    }

    public setVisible(visible: boolean) {
        this._asteroid.visible = visible;
    }

    public update(time: number, _: number) {
        const timeInMotion = time - this._startTime;
        const displacement = new Phaser.Math.Vector2()
            .copy(this._startLocation)
            .add(
                new Phaser.Math.Vector2(
                    this._velocity.x * timeInMotion,
                    this._velocity.y * timeInMotion
                )
            );

        const reducedX =
            (displacement.x % (config.width + Asteroid._loopBorderWidth)) -
            Asteroid._loopBorderWidth / 2;
        const reducedY =
            (displacement.y % (config.height + Asteroid._loopBorderWidth)) -
            Asteroid._loopBorderWidth / 2;

        if (reducedX < 0 - Asteroid._loopBorderWidth / 2) {
            this._asteroid.x =
                config.width + Asteroid._loopBorderWidth + reducedX;
        } else {
            this._asteroid.x = reducedX;
        }

        if (reducedY < 0 - Asteroid._loopBorderWidth / 2) {
            this._asteroid.y =
                config.height + Asteroid._loopBorderWidth + reducedY;
        } else {
            this._asteroid.y = reducedY;
        }
    }
}
