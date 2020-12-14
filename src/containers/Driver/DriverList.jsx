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
  TableHeaderContent,
} from "../../components/Utility/common";
import { Paper } from "@material-ui/core";
import { calculatePageInfo } from "helpers/utility";

const confirm = Modal.confirm;

const Cell = (props, _this) => {
  const { column } = props;
  let cellData = props.value;
  if (column.name === "col_10") {
    return (
      <Table.Cell
        {...props}
        value={<Rate disabled value={cellData.rating} />}
        style={{ textAlign: "left" }}
      />
    );
  }

  if (column.name === "col_11") {
    return (
      <Table.Cell
        {...props}
        style={{ textAlign: "center" }}
        value={
          <i
            style={{ color: props.row.col_11.color, fontSize: 14 }}
            title={props.row.col_11.status}
            className={`fa ${props.row.col_11.icon}`}
          />
        }
      />
    );
  }
  if (column.name === "col_12") {
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

export class DriverList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
      input: new Map(),
      tableColumnExtensions: [
        { columnName: "col_1", width: 100 },
        { columnName: "col_2", width: 100 },
        { columnName: "col_3", wordWrapEnabled: true, width: 150 },
        { columnName: "col_4", wordWrapEnabled: true, width: 100 },
        { columnName: "col_5", wordWrapEnabled: true },
        { columnName: "col_6", wordWrapEnabled: true, width: 100 },
        { columnName: "col_7", wordWrapEnabled: true, width: 100 },
        { columnName: "col_8", wordWrapEnabled: true, width: 150 },
        { columnName: "col_9", wordWrapEnabled: true, width: 150 },
        { columnName: "col_10", width: 120 },
        { columnName: "col_11", width: 100, wordWrapEnabled: true },
        { columnName: "col_12", width: 100 },
      ],
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);

    this.handleViewDriver = this.handleViewDriver.bind(this);
    this.handleEditDriver = this.handleEditDriver.bind(this);
    this.handleDeleteDriver = this.handleDeleteDriver.bind(this);
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

    return (
      <Paper>
        <Spin spinning={loading} tip="Đang lấy dữ liệu...">
          <Grid
            rows={dataSource}
            columns={[
              {
                name: "col_1",
                title: ["MÃ", "NGÀY TẠO"],
              },
              {
                name: "col_2",
                title: ["REF CODE"],
              },
              {
                name: "col_3",
                title: ["HỌ TÊN", "SĐT", "EMAIL"],
              },
              {
                name: "col_4",
                title: ["LOẠI NV"],
              },
              {
                name: "col_5",
                title: ["ĐƠN VỊ QUẢN LÝ"],
              },
              {
                name: "col_6",
                title: ["NGÀY SINH"],
              },
              {
                name: "col_7",
                title: ["SỐ CMND"],
              },
              {
                name: "col_8",
                title: ["LOẠI BẰNG LÁI", "SỐ BẰNG LÁI", "THỜI HẠN BẰNG LÁI"],
              },
              {
                name: "col_9",
                title: ["ĐỊNH BIÊN"],
              },
              {
                name: "col_10",
                title: ["ĐÁNH GIÁ"],
              },
              {
                name: "col_11",
                title: ["TRẠNG THÁI"],
              },

              {
                name: "col_12",
                title: [""],
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
              order={[
                "col_1",
                "col_2",
                "col_3",
                "col_4",
                "col_5",
                "col_6",
                "col_7",
                "col_8",
                "col_9",
                "col_10",
                "col_11",
                "col_12",
              ]}
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

  handleEditDriver(rowData) {
    this.props.handleEditDriver(rowData);
  }

  handleDeleteDriver(rowData) {
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
        _this.props.deleteDriver(rowData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
}

export default DriverList;
