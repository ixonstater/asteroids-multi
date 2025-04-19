import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const currentScene = (_: Phaser.Scene) => {};

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
        </div>
    );
}

export default App;

