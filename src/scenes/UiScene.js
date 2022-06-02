import Phaser from "phaser";
import GameStore from "../store/GameStore";

class UiScene extends Phaser.Scene {
  constructor() {
    super({ key: "UiScene" });
  }

  create(data) {
    this.sceneData = data;
    this.activeTile = GameStore.data.selectedTile;
    this.addUiContainer();
    this.addTitle();
    this.addBorders();
    this.addGridSwitch();
    this.addEventListeners();
  }

  addUiContainer() {
    this.uiContainer = this.add.container(600, 300);
    const tile1 = this.add.image(0, -30, "tiles", 0);
    const tile2 = this.add.image(0, 30, "tiles", 1);
    this.tilesArr = [tile1, tile2];
    this.uiContainer.add(this.tilesArr);
  }

  addTitle() {
    const title = this.add.text(0, -80, "Selected Tile:").setOrigin(0.5);
    this.uiContainer.add(title);
  }

  addBorders() {
    const { tileWidth } = this.sceneData;
    const { tileHeight } = this.sceneData;
    const tileBorder = this.add.graphics().setName("tileBorder");
    tileBorder.lineStyle(1, 0xffffff, 1);
    tileBorder.strokeRect(
      this.tilesArr[0].x - tileWidth / 2,
      this.tilesArr[0].y - tileHeight / 2,
      tileWidth,
      tileHeight
    );
    const selectedTileBorder = this.add
      .graphics()
      .setName("selectedTileBorder");
    selectedTileBorder.lineStyle(2, 0x8b0000, 1);
    selectedTileBorder.strokeRect(
      this.tilesArr[0].x - tileWidth / 2 - 2,
      this.tilesArr[0].y - tileHeight / 2 - 2,
      tileWidth + 4,
      tileHeight + 4
    );
    this.uiContainer.add([tileBorder, selectedTileBorder]);
  }

  addGridSwitch() {
    this.gridSwitch = this.add
      .text(0, 80, "GRID: ON")
      .setOrigin(0.5)
      .setInteractive();
    this.uiContainer.add(this.gridSwitch);
  }

  switchActiveTile() {
    this.activeTile = this.activeTile > 0 ? 0 : 1;
    // Change selected tile to -1 so the MainScene would not stamp the tile until new one is selected
    GameStore.changeSelectedTile(-1);
    this.uiContainer.getByName("tileBorder").y =
      this.uiContainer.list[this.activeTile].y + 30;
  }

  selectTile() {
    if (this.activeTile !== GameStore.data.selectedTile) {
      GameStore.changeSelectedTile(this.activeTile);
      this.uiContainer.getByName("selectedTileBorder").y =
        this.uiContainer.list[this.activeTile].y + 30;
    }
  }

  keyboardHandler(event) {
    if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
      this.selectTile();
    } else if (
      event.keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT ||
      event.keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT ||
      event.keyCode === Phaser.Input.Keyboard.KeyCodes.UP ||
      event.keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN
    ) {
      this.switchActiveTile();
    }
  }

  gridSwitchHandler() {
    this.gridSwitch.setText(
      GameStore.data.displayGrid ? "GRID: OFF" : "GRID: ON"
    );
    GameStore.changeGridState();
    this.events.emit("toggleGrid");
  }

  addEventListeners() {
    this.input.keyboard.on(
      Phaser.Input.Keyboard.Events.ANY_KEY_DOWN,
      this.keyboardHandler,
      this
    );
    this.gridSwitch.on(
      Phaser.Input.Events.POINTER_UP,
      this.gridSwitchHandler,
      this
    );
  }
}

export default UiScene;
