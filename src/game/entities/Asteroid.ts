import { GameObjects } from "phaser";

export const AsteroidAssetManifest = {
    paths: [
        "asteroid_1.png",
        "asteroid_2.png",
        "asteroid_3.png",
        "asteroid_4.png",
    ]
};

export class AsteroidManager {
    private _asteroidIdCount: number = 0;
    private _ownedAsteroids: Map<number, Asteroid> = new Map();
    private _asteroids: Map<number, Asteroid> = new Map();
    private _spawner: AsteroidSpawner;

    public update(time: number, delta: number) {
        if (this._asteroids.size < 1) {
            this._spawner.beginSpawnEvent()
        }
    }
}

// Eventually most of this classes functionality will be moved to the server
export class AsteroidSpawner {

    public async beginSpawnEvent() {
        // Show asteroids portal here
        // Set timeout and then spawn asteroids
    }

    private _pickSpawnLocation() { }

    private _getRandomDirection() { }

    private _getRandomVelocity() { }
}

export class Asteroid {
    private _asteroid: GameObjects.Image
}