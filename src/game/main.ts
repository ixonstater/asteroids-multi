import { AUTO, Game } from "phaser";
import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

export const config = {
    width: 750,
    height: 400,
    isMobile: navigator.maxTouchPoints > 1,
    socketUrl: "ws://localhost:8081",
};

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const gameConfig: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: config.width,
    height: config.height,
    parent: "game-container",
    backgroundColor: "#000000",
    canvasStyle: "border: 2px white solid;",
    scene: [Boot, Preloader, MainMenu, MainGame],
    antialias: true,
    antialiasGL: true,
    physics: {
        default: "matter",
        matter: {
            debug: false,
            gravity: new Phaser.Math.Vector2(0, 0),
        },
    },
};

const StartGame = (parent: string) => {
    return new Game({ ...gameConfig, parent });
};

export default StartGame;

