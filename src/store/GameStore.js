class GameStore {
  constructor() {
    this.data = { selectedTile: 0, displayGrid: true };
  }

  changeSelectedTile(newTile) {
    this.data.selectedTile = newTile;
  }

  changeGridState() {
    this.data.displayGrid = !this.data.displayGrid;
  }
}
export default new GameStore();
