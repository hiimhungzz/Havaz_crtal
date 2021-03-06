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
import { Paper, CardContent } from "@material-ui/core";
import { calculatePageInfo } from "helpers/utility";

const Cell = (props, _this) => {
  const { column } = props;
  let cellData = props.value;
  if (column.name === "col_5") {
    return (
      <Table.Cell
        {...props}
        style={{ textAlign: "left" }}
        value={<Tag color={cellData.color}>Màu xe</Tag>}
      />
    );
  }
  if (column.name === "col_3") {
    return (
      <Table.Cell
        {...props}
        style={{ textAlign: "left" }}
        value={cellData.seats}
      />
    );
  }
  if (column.name === "col_4") {
    return (
      <Table.Cell
        {...props}
        style={{ textAlign: "left" }}
        value={cellData.numberSeatEu}
      />
    );
  }
  if (column.name === "col_6") {
    return (
      <Table.Cell
        {...props}
        style={{ textAlign: "left" }}
        value={cellData.speed}
      />
    );
  }
  if (column.name === "col_7") {
    return (
      <Table.Cell
        {...props}
        style={{ textAlign: "left" }}
        value={cellData.type}
      />
    );
  }
  if (column.name === "col_9") {
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

export class VehicleTypeList extends React.Component {
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

    this.handleViewVehicle = this.handleViewVehicle.bind(this);
    this.handleEditVehicleType = this.handleEditVehicleType.bind(this);
    this.handleDeleteVehicleType = this.handleDeleteVehicleType.bind(this);
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
                name: "col_2",
                title: ["TÊN LOẠI XE"],
              },
              {
                name: "col_3",
                title: ["SỐ CHỖ THỰC TẾ"],
              },
              {
                name: "col_4",
                title: ["SỐ CHỖ GỢI Ý"],
              },
              {
                name: "col_5",
                title: ["MÀU SẮC (LDH)"],
              },
              {
                name: "col_6",
                title: ["TỐC ĐỘ TRUNG BÌNH"],
              },
              {
                name: "col_7",
                title: ["LOẠI XE"],
              },
              {
                name: "col_8",
                title: ["ĐƠN VỊ QUẢN LÝ"],
              },
              {
                name: "col_9",
                title: [""],
              },
            ]}
          >
            <PagingState currentPage={currentPage} pageSize={pageLimit} />
            <IntegratedPaging />
            <Table
              columnExtensions={[
                { columnName: "col_8", wordWrapEnabled: true, width: 250 },
                { columnName: "col_3", wordWrapEnabled: true, width: 150 },
                { columnName: "col_4", wordWrapEnabled: true, width: 150 },
                { columnName: "col_5", wordWrapEnabled: true, width: 150 },
                { columnName: "col_6", wordWrapEnabled: true, width: 150 },
                { columnName: "col_7", wordWrapEnabled: true, width: 150 },
                { columnName: "col_9", wordWrapEnabled: true, width: 80 },
              ]}
              cellComponent={(props) => Cell(props, _this)}
            />
            <TableColumnReordering
              order={[
                "col_2",
                "col_3",
                "col_4",
                "col_5",
                "col_6",
                "col_7",
                "col_8",
                "col_9",
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

  handleViewVehicle(rowData) {
    this.props.handleViewVehicle(rowData);
  }

  handleEditVehicleType(rowData) {
    this.props.handleEditVehicleType(rowData);
  }

  handleDeleteVehicleType(rowData) {
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
    this.props.onChangeCurrentPage(currentPage, "2");
  }

  changePageSize(pageSize) {
    this.props.onChangePageSize(pageSize, "2");
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
        _this.props.deleteVehicleType(rowData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
}

export default VehicleTypeList;
