export default class CellInfo {
  constructor({
    colIndex,
    rowIndex,
    styles,
    content,
    searchInput,
    type,
    info
  }) {
    this._colIndex = colIndex;
    this._rowIndex = rowIndex;
    this._styles = styles;
    this._content = content;
    this._searchInput = searchInput;
    this._type = type;
    this._info = info;
  }
  getInfo() {
    return this._info;
  }
  getType() {
    return this._type;
  }
  getContent = () => {
    return this._content;
  };
  getColIndex = () => {
    return this._colIndex;
  };
  getRowIndex = () => {
    return this._rowIndex;
  };
  getStyles = () => {
    return this._styles;
  };
  getSearchInput = () => {
    return this._searchInput;
  };
}
