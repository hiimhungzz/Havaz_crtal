import React from "react";
import { Divider, Modal, Tag, Tooltip, Spin } from "antd";

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

const Cell = (props, _this) => {
  const { column } = props;
  let cellData = props.value;

  if (column.name === "col_6") {
    return (
      <Table.Cell
        {...props}
        value={cellData.action.map((e, key) => (
          <Tooltip placement="topLeft" title={e.title}>
            <span key={key}>
              <a
                style={{
                  color: "#646c9a",
                  fontSize: 14,
                }}
                onClick={() => _this[e.handle](props.row)}
              >
                <i className={`fa ${e.icon}`} />
              </a>
              {key < cellData.action.length - 1 ? (
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

export class VehicleTemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);

    this.handleViewVehicleTem = this.handleViewVehicleTem.bind(this);
    this.handleEditVehicleTem = this.handleEditVehicleTem.bind(this);
    this.handleDeleteVehicleTem = this.handleDeleteVehicleTem.bind(this);
  }

  componentDidMount() {}

  render() {
    let _this = this;
    const {
      currentPage,
      pageLimit,
      totalLength,
      dataSource,
      loading,
    } = this.props;

    return (
      <Paper>
        <Spin spinning={loading} tip="Đang lấy dữ liệu...">
          <Grid
            rows={dataSource}
            columns={[
              {
                name: "col_1",
                title: ["XE"],
              },
              {
                name: "col_2",
                title: ["TEM XE"],
              },
              {
                name: "col_3",
                title: ["NGÀY CẤP"],
              },
              {
                name: "col_4",
                title: ["NGÀY HẾT HẠN"],
              },
              {
                name: "col_5",
                title: ["ĐƠN VỊ QUẢN LÝ"],
              },
              {
                name: "col_6",
                title: [""],
              },
            ]}
          >
            <PagingState currentPage={currentPage} pageSize={pageLimit} />
            <IntegratedPaging />
            <Table
              columnExtensions={[
                { columnName: "col_5", width: 250, wordWrapEnabled: true },
                { columnName: "col_6", width: 80 },
              ]}
              cellComponent={(props) => Cell(props, _this)}
            />
            <TableColumnReordering
              order={["col_1", "col_2", "col_3", "col_4", "col_5", "col_6"]}
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

  handleViewVehicleTem(rowData) {
    this.props.handleViewVehicleTem(rowData);
  }

  handleEditVehicleTem(rowData) {
    this.props.handleEditVehicleTem(rowData);
  }

  handleDeleteVehicleTem(rowData) {
    debugger;
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
    this.props.onChangeCurrentPage(currentPage, "3");
  }

  changePageSize(pageSize) {
    this.props.onChangePageSize(pageSize, "3");
  }

  showDeleteConfirm(rowData) {
    let _this = this;
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa không ?",
      content: "",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        _this.props.deleteVehicleTem(rowData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
}

export default VehicleTemList;
