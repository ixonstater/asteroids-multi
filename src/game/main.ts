import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";

export const config = {
    width: 750,
    height: 750,
};

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const gameConfig: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: config.width,
    height: config.height,
    parent: "game-container",
    backgroundColor: "#000000",
    scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
};

const StartGame = (parent: string) => {
    return new Game({ ...gameConfig, parent });
};

export default StartGame;

