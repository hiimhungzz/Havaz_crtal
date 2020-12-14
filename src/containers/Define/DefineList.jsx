import React, { useState } from "react";
import { Divider, Icon, Rate, Tag, Tooltip, Spin } from "antd";
import { Modal } from "antd";
import { STATUS } from "@Constants/common";

import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
  TableColumnReordering,
  PagingPanel,
  VirtualTable
} from "@devexpress/dx-react-grid-material-ui";
import {
  IntegratedPaging,
  PagingState,
  TreeDataState,
  CustomTreeData,
  SelectionState
} from "@devexpress/dx-react-grid";
import {
  PagingContainer,
  Loading,
  TableHeaderContent
} from "../../components/Utility/common";
import { Paper } from "@material-ui/core";

const confirm = Modal.confirm;
// const getChildRows = (row, rootRows) => {
//   // console.log("row", row);
//   console.log("rootRows", rootRows)
//   // const childRows = rootRows.filter(r => r.id === (row ? row.id : null));
//     // console.log("childRows", rootRows.filter(r => r.id === (row ? row.id : null)));
//    console.log("row ? row.childs : rootRows", row ? row.childs : rootRows);
//    return row ? row.childs : rootRows;
//   // return (row ? row.childs : rootRows);
// };

const getChildRows = (row, rootRows) => (row ? row.childs : rootRows);

const Cell = (props, _this) => {
  const { column, row } = props;
  let cellData = props.value;
  if (column.name === "edit") {
    return (
      <Table.Cell
        {...props}
        style={
          row.actor === "IS_PARENT"
            ? { background: "rgba(33, 150, 243, 0.15)", fontWeight: "600" }
            : {}
        }
        value={column.action.map((e, index) => (
          <Tooltip placement="topLeft" title={e.title}>
            <span key={index}>
              <a
                style={{
                  color: "#646c9a",
                  fontSize: 14
                }}
                onClick={() => _this[e.handle](props.row)}
              >
                <i className={`fa ${e.icon}`} />
              </a>
              {index < column.action.length - 1 ? (
                <Divider type="vertical" />
              ) : null}
            </span>
          </Tooltip>
        ))}
      />
    );
  }

  for (let item of row.col) {
    // console.log("column.name",column.name)
    // console.log("item.name",item.name)
    if (column.name === item.name) {
    
      return (
        <Table.Cell
          {...props}
          className="dev_table_body"
          value={
            <i
              style={{
                color: STATUS.find(x => x.value == cellData)
                  ? STATUS.find(x => x.value == cellData).color
                  : "red",
                fontSize: 14
              }}
              title={cellData}
              className={`fa ${
                STATUS.find(x => x.value == cellData)
                  ? STATUS.find(x => x.value == cellData).icon
                  : "fa-question-circle"
              }`}
            />
          }
          style={
            row.actor === "IS_PARENT"
              ? {
                  background: "rgba(33, 150, 243, 0.15)",
                  fontWeight: "600",
                  fontSize: 16,
                  color: "red"
                }
              : { fontWeight: "600", fontSize: 16 }
          }
        />
      );
    }
  }

  if (column.name === "isActived") {
    return (
      <Table.Cell
        {...props}
        className="dev_table_body"
        value={
          <i
            style={{
              color: STATUS.find(x => x.value == cellData)
                ? STATUS.find(x => x.value == cellData).color
                : "red",
              fontSize: 14
            }}
            title={cellData}
            className={`fa ${
              STATUS.find(x => x.value == cellData)
                ? STATUS.find(x => x.value == cellData).icon
                : "fa-question-circle"
            }`}
          />
        }
        style={
          row.actor === "IS_PARENT"
            ? {
                background: "rgba(33, 150, 243, 0.15)",
                fontWeight: "600",
                fontSize: 16
              }
            : { fontWeight: "600", fontSize: 16 }
        }
      />
    );
  }

  return (
    <Table.Cell
      {...props}
      className="dev_table_body"
      value={cellData}
      style={
        row.actor === "IS_PARENT"
          ? { background: "rgba(33, 150, 243, 0.15)", fontWeight: "600" }
          : {}
      }
    />
  );
};

export class DefineList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
      input: new Map()
      // tableColumnExtensions: [
      //   { columnName: "name", width: 250, wordWrapEnabled: true },
      //   { columnName: "description", width: 250, wordWrapEnabled: true },
      //   { columnName: "isActived", width: 100, wordWrapEnabled: true },
      //   { columnName: "edit", width: 80 },
      //   { columnName: "col_4096", width: 100 },
      //   { columnName: "col_2048", width: 100 },
      //   { columnName: "col_1024", width: 100 },
      //   { columnName: "col_512", width: 100 },
      //   { columnName: "col_256", width: 100 },
      //   { columnName: "col_128", width: 100 },
      //   { columnName: "col_8", width: 100 },
      //   { columnName: "col_64", width: 100 },
      //   { columnName: "col_32", width: 100 },
      //   { columnName: "col_4", width: 100 },
      //   { columnName: "col_2", width: 100 },
      //   { columnName: "col_1", width: 100 }
      // ]
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);

    this.handleViewDefine = this.handleViewDefine.bind(this);
    this.handleEditDefine = this.handleEditDefine.bind(this);
    this.handleDeleteDefine = this.handleDeleteDefine.bind(this);
    this.handleShowVehilceResponse = this.handleShowVehilceResponse.bind(this);
    this.handleHideVehilceResponse = this.handleHideVehilceResponse.bind(this);
  }
  render() {
    let _this = this;
    // const { tableColumnExtensions } = this.state;
    const {
      dataSource,
      loading,
      totalLength,
      currentPage,
      pageLimit,
      dataGroup,
      typeDefine
    } = this.props;
    let headerTable = [
      {
        name: "name",
        title: ["DANH MỤC"]
      },
      {
        name: "supplierName",
        title: ["ĐƠN VỊ QUẢN LÝ"]
      },

      {
        name: "description",
        title: ["MÔ TẢ"]
      },
      {
        name: "typeName",
        title: ["LOẠI"]
      },
      {
        name: "sort",
        title: ["THỨ TỰ"]
      }
    ];
    const dataType = typeDefine.map((item, index) => {
      headerTable.push({
        name: `col_${item.value}`,
        title: [`${item.label}`]
      });
    });
    headerTable.push(
      {
        name: "isActived",
        title: ["TRẠNG THÁI"]
      },
      {
        name: "edit",
        title: [""],
        action: [
          {
            name: "edit",
            title: "Xem chi tiết",
            icon: "fa-eye",
            handle: "handleEditDefine"
          },
          {
            name: "delete",
            title: "Xóa",
            icon: "fa-trash",
            handle: "handleDeleteDefine"
          }
        ]
      }
    );
    const customerHeader = [];
    headerTable.map((item, index) => {
      customerHeader.push(item.name);
    });
    const tableColumnExtensions = headerTable.map((item, index) => {
      if (
        item.name == "description" ||
        item.name == "name" || item.name == "typeName" ||
        (item.name == "supplierName" && typeDefine.length > 0)
      ) {
        item.columnName = item.name;
        item.width = 300;
        item.wordWrapEnabled = true;
      } else {
        item.columnName = item.name;
        item.wordWrapEnabled = true;
      }
      return item;
    });
    let indexTreeData = new Array();
    let i = 0;
    dataGroup.map((item, index) => {
      indexTreeData.push(i++);
      item.childs.map((_item, _index) => {
        indexTreeData.push(i++);
      });
    });
    const arrTreeData = indexTreeData;
    return (
      <Paper>
        <Spin spinning={loading} tip="Đang lấy dữ liệu...">
          <Grid
            rootComponent={props => {
              return (
                <Grid.Root {...props} style={{ ...props.style, height: 600 }} />
              );
            }}
            rows={dataGroup}
            columns={headerTable}
          >
            <SelectionState />

            <TreeDataState
              expandedRowIds={arrTreeData}
              // onExpandedRowIdsChange={arrTreeData}
            />
            <CustomTreeData getChildRows={getChildRows} />
            {/* <PagingState currentPage={currentPage} pageSize={pageLimit} />
            <IntegratedPaging /> */}
            <Table
              columnExtensions={tableColumnExtensions}
              cellComponent={props => Cell(props, _this)}
            />
            <TableColumnReordering order={customerHeader} />

            <TableHeaderRow
              cellComponent={props => {
                return (
                  <TableHeaderRow.Cell
                    {...props}
                    style={{
                      ...props.style,
                      background: "#f2f3f8",
                      position: "sticky",
                      top: 0,
                      zIndex: "299"
                    }}
                  />
                );
              }}
              contentComponent={TableHeaderContent}
            />
            <TableTreeColumn
              for="name"
              cellComponent={props => {
                return (
                  <TableTreeColumn.Cell
                    {...props}
                    style={
                      props.row.actor === "IS_PARENT"
                        ? {
                            ...props,
                            background: "rgba(33, 150, 243, 0.15)",
                            fontWeight: "600"
                          }
                        : {}
                    }
                  ></TableTreeColumn.Cell>
                );
              }}
            />
          </Grid>
        </Spin>
      </Paper>
    );
  }

  onShowSizeChange(current, pageSize) {
    console.log(current, pageSize);
  }

  handleShowVehilceResponse(value, rowId) {
    this.setState(prevState => {
      let newState = { ...prevState };
      newState.input.set(
        rowId,
        <div className="form-group form-md-line-input inline-div">
          <label
            className="col-md-4 control-label inline-label"
            htmlFor="form_control_1"
          >
            {" "}
            <Icon type="check" />
          </label>
          <div className="col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <select
              className="form-control"
              name="status"
              onChange={this.handleAssignVehicle}
              value={value}
            >
              {this.props.listVehicle.map(vehicle => {
                return (
                  <option key={vehicle.uuid} value={vehicle.uuid}>
                    {vehicle.code}
                  </option>
                );
              })}
            </select>
            <div className="form-control-focus"></div>
          </div>
        </div>
      );

      return newState;
    });
  }

  handleHideVehilceResponse(value, rowId) {
    this.setState(prevState => {
      let newState = { ...prevState };
      newState.input.set(rowId, <Tag color={"#87d068"}>{value}</Tag>);
      return newState;
    });
  }

  handleViewDefine(rowData) {
    this.props.handleViewDefine(rowData);
  }

  handleEditDefine(rowData) {
    this.props.handleEditDefine(rowData);
  }

  handleDeleteDefine(rowData) {
    this.showDeleteConfirm(rowData.id);
  }

  onSelectChange(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  changeSelection(selection) {
    this.setState({ selection });
  }

  changeCurrentPage(currentPage) {
    this.props.onChangeCurrentPage(currentPage);
  }
  changePageSize(pageSize) {
    this.props.onChangePageSize(pageSize);
  }

  showDeleteConfirm(rowData) {
    let _this = this;
    confirm({
      title: "Bạn có chắc chắn muốn xóa không ?",
      content: "",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        _this.props.handleDeleteDefine(rowData);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }
}

export default DefineList;
