import React from "react";
import { Divider, Icon, Rate, Tag, Tooltip, Spin } from "antd";
import { Modal } from "antd";

import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  PagingPanel,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import {
  PagingContainer,
  Loading,
  TableHeaderContent,
} from "../../components/Utility/common";
import { Paper } from "@material-ui/core";
import { calculatePageInfo } from "helpers/utility";

const confirm = Modal.confirm;

const Cell = (props, _this) => {
  const { column } = props;
  let cellData = props.value;

  if (column.name === "col_4") {
    return (
      <Table.Cell
        {...props}
        style={{ textAlign: "center" }}
        value={
          <i
            style={{ color: props.row.col_4.color, fontSize: 14 }}
            title={props.row.col_4.status}
            className={`fa ${props.row.col_4.icon}`}
          />
        }
      />
    );
  }
  if (column.name === "col_5") {
    return (
      <Table.Cell
        {...props}
        style={{ textAlign: "left" }}
        value={cellData.action.map((e, index) => (
          <Tooltip placement="topLeft" title={e.title}>
            <span key={index}>
              <a
                style={{
                  color: "#646c9a",
                  fontSize: 14,
                }}
                onClick={() => _this[e.handle](props.row)}
              >
                <i className={`fa ${e.icon}`} />
              </a>
              {index < cellData.action.length - 1 ? (
                <Divider type="vertical" />
              ) : null}
            </span>
          </Tooltip>
        ))}
      />
    );
  }
  return (
    <Table.Cell
      {...props}
      className="dev_table_body"
      value={Object.keys(cellData).map((key, index) => (
        <div key={index}>{cellData[key]}</div>
      ))}
    />
  );
};

export class CategoryVehicleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
      input: new Map(),
      tableColumnExtensions: [
        { columnName: "col_1", wordWrapEnabled: true },
        { columnName: "col_2", wordWrapEnabled: true },
        { columnName: "col_3", wordWrapEnabled: true },
        { columnName: "col_6", wordWrapEnabled: true },
        { columnName: "col_4", width: 100 },
        { columnName: "col_5", width: 80 },
      ],
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);

    this.handleViewDriver = this.handleViewDriver.bind(this);
    this.handleEditCategoryVehicle = this.handleEditCategoryVehicle.bind(this);
    this.handleDeleteCategoryVehicle = this.handleDeleteCategoryVehicle.bind(
      this
    );
    this.handleShowVehilceResponse = this.handleShowVehilceResponse.bind(this);
    this.handleHideVehilceResponse = this.handleHideVehilceResponse.bind(this);
  }
  render() {
    let _this = this;
    const { tableColumnExtensions } = this.state;
    const {
      dataSource,
      loading,
      totalLength,
      currentPage,
      pageLimit,
    } = this.props;
    console.log("loading", loading);
    return (
      <Paper>
        <Spin spinning={loading} tip="Đang lấy dữ liệu...">
          <Grid
            rows={dataSource}
            columns={[
              {
                name: "col_1",
                title: ["NHÓM XE"],
              },
              {
                name: "col_2",
                title: ["MÔ TẢ"],
              },
              {
                name: "col_3",
                title: ["THỨ TỰ"],
              },
              {
                name: "col_4",
                title: ["TRẠNG THÁI"],
              },
              {
                name: "col_5",
                title: [""],
              },
              {
                name: "col_6",
                title: ["ĐƠN VỊ QUẢN LÝ"],
              },
            ]}
          >
            <PagingState currentPage={currentPage} pageSize={pageLimit} />
            <IntegratedPaging />
            <Table
              columnExtensions={tableColumnExtensions}
              cellComponent={(props) => Cell(props, _this)}
            />
            <TableColumnReordering
              order={["col_1", "col_2", "col_6", "col_3", "col_4", "col_5"]}
            />

            <TableHeaderRow
              cellComponent={(props) => {
                return (
                  <TableHeaderRow.Cell
                    {...props}
                    style={{ ...props.style, background: "#f2f3f8" }}
                  />
                );
              }}
              contentComponent={TableHeaderContent}
            />
            <PagingPanel
              messages={{
                info: calculatePageInfo(currentPage, pageLimit, totalLength),
                rowsPerPage: "Số bản ghi trên mỗi trang",
              }}
              containerComponent={(props) => (
                <PagingContainer
                  {...props}
                  onCurrentPageChange={this.changeCurrentPage}
                  onPageSizeChange={this.changePageSize}
                  pageSize={pageLimit}
                  totalCount={totalLength}
                  currentPage={currentPage}
                />
              )}
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
    this.setState((prevState) => {
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
              {this.props.listVehicle.map((vehicle) => {
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
    this.setState((prevState) => {
      let newState = { ...prevState };
      newState.input.set(rowId, <Tag color={"#87d068"}>{value}</Tag>);
      return newState;
    });
  }

  handleViewDriver(rowData) {
    this.props.handleViewDriver(rowData);
  }

  handleEditCategoryVehicle(rowData) {
    this.props.handleEditCategoryVehicle(rowData);
  }

  handleDeleteCategoryVehicle(rowData) {
    this.showDeleteConfirm(rowData.key);
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
        _this.props.handleDeleteCategoryVehicle(rowData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
}

export default CategoryVehicleList;
