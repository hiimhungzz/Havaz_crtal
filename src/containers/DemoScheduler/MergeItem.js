export class MergeItem {
  constructor({
    content = "",
    row = 0,
    rowIndex = null,
    type = "",
    col = 0,
    colIndex = null,
    searchInput = "",
    info
  }) {
    this._content = content;
    this._row = row;
    this._rowIndex = rowIndex;
    this._col = col;
    this._colIndex = colIndex;
    this._searchInput = searchInput;
    this._type = type;
    this._info = info;

    this.setIgnore();
    this.setRoot();
  }
  getInfo() {
    return this._info;
  }
  getType() {
    return this._type;
  }
  setRoot() {
    this._root = `${this._colIndex}-${this._rowIndex}`;
  }
  getRoot() {
    return this._root;
  }
  getContent() {
    return this._content;
  }
  setContent(content) {
    this._content = content;
  }
  getRow() {
    return this._row;
  }
  setRow(row) {
    this._row = row;
  }
  getCol() {
    return this._col;
  }
  setCol(col) {
    this._col = col;
  }
  getRowIndex() {
    return this._rowIndex;
  }
  setRowIndex(rowIndex) {
    this._rowIndex = rowIndex;
  }
  getColIndex() {
    return this._colIndex;
  }
  setColIndex(colIndex) {
    this._colIndex = colIndex;
  }

  setIgnore() {
    let arr = [];
    for (let i = this._rowIndex; i < this._rowIndex + this._row; i++) {
      for (let j = this._colIndex; j < this._colIndex + this._col; j++) {
        if (!(i === this._rowIndex && j === this._colIndex)) {
          arr.push(`${j}-${i}`);
        }
      }
    }
    this._ignore = arr;
  }
  getIgnore() {
    return this._ignore;
  }
  getSearchInput() {
    return this._searchInput;
  }
}
