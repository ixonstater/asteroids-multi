import { GameObjects, Scene } from "phaser";
import { config } from "../main";

export const AsteroidAssetManifest = {
    paths: [
        "asteroid_1.png",
        "asteroid_2.png",
        "asteroid_3.png",
        "asteroid_4.png",
    ],
};

export class AsteroidManager {
    private _asteroidIdCount: number = 0;
    private _ownedAsteroids: Map<number, Asteroid> = new Map();
    private _asteroids: Map<number, Asteroid> = new Map();
    private _portal: Phaser.GameObjects.Ellipse;
    private _spawner: AsteroidSpawner;
    public static maxVelocity: number = 3;

    public constructor(scene: Scene) {
        this._spawner = new AsteroidSpawner();
        this._portal = new Phaser.GameObjects.Ellipse(
            scene,
            0,
            0,
            100,
            100,
            0x0000ff
        ).setVisible(false);
    }

    public update(time: number, delta: number, scene: Scene) {
        if (this._asteroids.size < 1) {
            const [asteroids, portalLocation] =
                this._spawner.createAsteroids(scene);
            this._portal.x = portalLocation.x;
            this._portal.y = portalLocation.y;
            this._portal.setVisible(true);

            setTimeout(() => {
                for (const asteroid of asteroids) {
                }
            }, 5000);
        }
    }
}

// Eventually most of this classes functionality will be moved to the server
export class AsteroidSpawner {
    private _level: number = 0;

    public createAsteroids(
        scene: Scene
    ): [Array<Asteroid>, Phaser.Math.Vector2] {
        const portalLocation = this._pickPortalLocation();
        const asteroids: Array<Asteroid> = [];

        for (let i = 0; i < ++this._level; i++) {
            const velocity = this._getRandomVelocity();
            const asteroidImage = this._getRandomAsteroidImage(scene);
            asteroids.push(
                new Asteroid(
                    asteroidImage,
                    AsteroidSize.AsteroidLarge,
                    velocity,
                    portalLocation
                )
            );
        }

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
            Phaser.Math.Between(0, AsteroidManager.maxVelocity),
            Phaser.Math.Between(0, AsteroidManager.maxVelocity)
        );
    }

    private _getRandomAsteroidImage(scene: Scene) {
        return scene.add
            .image(
                0,
                0,
                AsteroidAssetManifest.paths[
                    Phaser.Math.Between(
                        0,
                        AsteroidAssetManifest.paths.length - 1
                    )
                ]
            )
            .setVisible(false);
    }
}

enum AsteroidSize {
    AsteroidSmall,
    AsteroidMedium,
    AsteroidLarge,
}

export class Asteroid {
    public constructor(
        private _asteroid: GameObjects.Image,
        private _size: AsteroidSize,
        private _velocity: Phaser.Math.Vector2,
        private _startLocation: Phaser.Math.Vector2
    ) {}

    public setVisible(visible: boolean) {
        this._asteroid.visible = visible;
    }
}
