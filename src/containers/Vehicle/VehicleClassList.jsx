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
  if (column.name === "col_4") {
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

export class VehicleClassList extends React.Component {
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

    this.handleViewVehicleClass = this.handleViewVehicleClass.bind(this);
    this.handleEditVehicleClass = this.handleEditVehicleClass.bind(this);
    this.handleDeleteVehicleClass = this.handleDeleteVehicleClass.bind(this);
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
                title: ["HẠNG XE"],
              },
              {
                name: "col_2",
                title: ["MÔ TẢ"],
              },
              {
                name: "col_3",
                title: ["ĐƠN VỊ QUẢN LÝ"],
              },

              {
                name: "col_4",
                title: [""],
              },
            ]}
          >
            <PagingState currentPage={currentPage} pageSize={pageLimit} />
            <IntegratedPaging />
            <Table
              columnExtensions={[
                { columnName: "col_4", width: 80 },
                { columnName: "col_3", wordWrapEnabled: true },
                { columnName: "col_2", wordWrapEnabled: true },
              ]}
              cellComponent={(props) => Cell(props, _this)}
            />
            <TableColumnReordering
              order={["col_1", "col_2", "col_3", "col_4"]}
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

  handleViewVehicleClass(rowData) {
    this.props.handleViewVehicleClass(rowData);
  }

  handleEditVehicleClass(rowData) {
    this.props.handleEditVehicleClass(rowData);
  }

  handleDeleteVehicleClass(rowData) {
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
    this.props.onChangeCurrentPage(currentPage, "4");
  }

  changePageSize(pageSize) {
    this.props.onChangePageSize(pageSize, "4");
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
        _this.props.deleteVehicleClass(rowData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
}

export default VehicleClassList;
