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

const Cell = (props, _this) => {
  const { column } = props;
  let cellData = props.value;
  if (column.name === "col_11") {
    return (
      <Table.Cell
        {...props}
        value={<Tag color={"#87d068"}>{cellData.status}</Tag>}
      />
    );
  }
  if (column.name === "col_4") {
    return (
      <Table.Cell
        {...props}
        style={{ textAlign: "left" }}
        value={<Tag color={cellData.vehicleTypeColor}>Màu sắc</Tag>}
      />
    );
  }
  if (column.name === "col_12") {
    return (
      <Table.Cell
        {...props}
        value={cellData.action.map((e, index) => (
          <Tooltip key={index} placement="topLeft" title={e.title}>
            <span>
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

export class VehicleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
      tableColumnExtensions: [
        { columnName: "col_1", wordWrapEnabled: true, width: 200 },
        { columnName: "col_12", wordWrapEnabled: true, width: 80 },
        { columnName: "col_7", wordWrapEnabled: true },
        { columnName: "col_9", wordWrapEnabled: true },
      ],
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);

    this.handleViewVehicle = this.handleViewVehicle.bind(this);
    this.handleEditVehicle = this.handleEditVehicle.bind(this);
    this.handleDeleteVehicle = this.handleDeleteVehicle.bind(this);
  }

  render() {
    let _this = this;
    const { tableColumnExtensions } = this.state;
    const {
      dataSource,
      totalLength,
      pageLimit,
      currentPage,
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
                title: ["CHỦ XE"],
              },
              {
                name: "col_2",
                title: ["MÃ", "BIỂN SỐ XE"],
              },
              {
                name: "col_3",
                title: ["LOẠI XE"],
              },
              {
                name: "col_5",
                title: ["SỐ KHUNG", "SỐ MÁY"],
              },
              {
                name: "col_6",
                title: ["NĂM SẢN XUẤT"],
              },
              {
                name: "col_7",
                title: ["ĐƠN VỊ QUẢN LÝ"],
              },
              //  {
              //     name: 'col_8',
              //     title: ['Nhiên liệu'],
              // },
              {
                name: "col_9",
                title: ["LÁI XE"],
              },
              // {
              //     name: 'col_10',
              //     title: ['Trạng thái'],
              // },
              // {
              //     name: 'col_11',
              //     title: ['Đánh giá'],
              // },
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
                "col_5",
                "col_6",
                "col_7",
                "col_9",
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
                info: `1-${pageLimit} của ${parseInt(totalLength)}`,
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

  handleEditVehicle(rowData) {
    this.props.handleEditVehicle(rowData);
  }

  handleDeleteVehicle(rowData) {
    console.log("rowData", rowData.key);
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
    this.props.onChangeCurrentPage(currentPage, "1");
  }

  changePageSize(pageSize) {
    this.props.onChangePageSize(pageSize, "1");
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
        _this.props.deleteVehicle(rowData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
}

export default VehicleList;
