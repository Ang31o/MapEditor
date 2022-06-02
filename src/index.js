import Phaser from "phaser";
import MainScene from "./scenes/MainScene";
import UiScene from "./scenes/UiScene";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  pixelArt: true,
  backgroundColor: "#4472C4",
  scene: [MainScene, UiScene],
};

const game = new Phaser.Game(config);
