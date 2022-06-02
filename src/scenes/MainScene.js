import Phaser from "phaser";
import tiles from "../assets/tiles.png";
import GameStore from "../store/GameStore";

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.spritesheet("tiles", tiles, { frameWidth: 24, frameHeight: 24 });
  }

  create() {
    this.addTitle();
    this.setupMap();
    this.addLayer();
    this.drawMapBorder();
    this.drawMapGrid();
    this.addCursorMarker();
    this.launchUiScene();
    this.addEventListeners();
  }

  addTitle() {
    this.add.text(400, 220, "Map:").setOrigin(0.5);
  }

  setupMap() {
    this.map = this.make.tilemap({
      tileWidth: 24,
      tileHeight: 24,
      width: 4,
      height: 4,
    });
    this.tiles = this.map.addTilesetImage("tiles");
  }

  addLayer() {
    this.layer = this.map.createBlankLayer("layer", this.tiles);
    // Move layer to the center of the canvas
    this.layer.setPosition(
      this.game.canvas.width / 2 - this.map.widthInPixels / 2,
      this.game.canvas.height / 2 - this.map.heightInPixels / 2
    );
  }

  drawMapBorder() {
    // Draw layer border
    const border = this.add.graphics();
    border.lineStyle(1, 0xffffff, 1);
    border.strokeRect(
      this.layer.x,
      this.layer.y,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
  }

  drawMapGrid() {
    this.mapGrid = this.add.grid(
      this.layer.x + this.map.widthInPixels / 2,
      this.layer.y + this.map.heightInPixels / 2,
      this.map.widthInPixels,
      this.map.heightInPixels,
      24,
      24,
      0xffffff,
      0,
      0xffffff,
      0.2
    );
    this.children.sendToBack(this.mapGrid);
  }

  toggleGridVisibility() {
    this.mapGrid.setVisible(GameStore.data.displayGrid);
  }

  addCursorMarker() {
    this.marker = this.add.graphics();
    this.marker.lineStyle(2, 0xffffff, 1);
    this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
  }

  launchUiScene() {
    this.scene.launch("UiScene", {
      tileWidth: this.map.tileWidth,
      tileHeight: this.map.tileHeight,
    });
  }

  putTileOnMap() {
    if (GameStore.data.selectedTile > -1) {
      this.map.putTileAt(
        GameStore.data.selectedTile,
        this.pointerTilePosition.x,
        this.pointerTilePosition.y
      );
    }
  }

  addEventListeners() {
    this.input.keyboard.on("keydown", (event) => {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
        this.putTileOnMap();
      }
    });
    this.scene
      .get("UiScene")
      .events.on("toggleGrid", this.toggleGridVisibility, this);
  }

  update() {
    const worldPoint = this.input.activePointer.positionToCamera(
      this.cameras.main
    );
    this.pointerTilePosition = this.map.worldToTileXY(
      worldPoint.x,
      worldPoint.y
    );
    if (
      this.pointerTilePosition.x >= 0 &&
      this.pointerTilePosition.x < this.map.width &&
      this.pointerTilePosition.y >= 0 &&
      this.pointerTilePosition.y < this.map.height
    ) {
      this.marker.setVisible(true);
      this.marker.x = this.map.tileToWorldX(this.pointerTilePosition.x);
      this.marker.y = this.map.tileToWorldY(this.pointerTilePosition.y);
    } else {
      this.marker.setVisible(false);
    }
  }
}

export default MainScene;
