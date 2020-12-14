import React from "react";
import { Divider, Modal, Spin } from "antd";

import {
  Grid,
  DragDropProvider,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  PagingPanel,
  TableFixedColumns,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import { Link } from "react-router-dom";
import {
  PagingContainer,
  TableHeaderContent,
} from "../../components/Utility/common";
import { Paper } from "@material-ui/core";
import { calculatePageInfo } from "helpers/utility";

const confirm = Modal.confirm;

const Cell = (props, _this) => {
  const { column, style } = props;
  var cellData = props.value;
  if (column.name === "col_7") {
    return (
      <Table.Cell
        {...props}
        className="dev_table_body"
        value={
          <Link
            to={"/bookingManagement?orgId=" + cellData.name}
            target="_blank"
          >
            {" "}
            {cellData.totalOrders}
          </Link>
        }
      />
    );
  }
  if (column.name === "col_8") {
    return (
      <Table.Cell
        {...props}
        className="dev_table_body"
        value={
          <Link
            to={"/bookingManagement?code=" + cellData.lastOrder}
            target="_blank"
          >
            {" "}
            {cellData.lastOrder}
          </Link>
        }
      />
    );
  }
  if (column.name === "col_9") {
    return (
      <Table.Cell
        {...props}
        className="dev_table_body"
        style={{ textAlign: "center", ...style }}
        value={
          <i
            style={{ color: props.row.col_9.color, fontSize: 14 }}
            title={props.row.col_9.status}
            className={`fa ${props.row.col_9.icon}`}
          />
        }
      />
    );
  }
  if (column.name === "col_10") {
    return (
      <Table.Cell
        {...props}
        style={{ textAlign: "center", paddingRight: "unset", ...style }}
        value={
          <React.Fragment>
            {cellData.action.map((e, index) => (
              <span key={index}>
                <a
                  title={e.name}
                  style={{
                    color: "#646c9a",
                    fontSize: 14,
                  }}
                  onClick={(f) => _this[e.handle]({ uuid: props.row.key })}
                >
                  <i className={`fa ${e.icon}`} />
                </a>
                {index < cellData.action.length - 1 ? (
                  <Divider type="vertical" />
                ) : null}
              </span>
            ))}
          </React.Fragment>
        }
      />
    );
  }
  if (column.name === "col_12") {
    return (
      <Table.Cell
        {...props}
        style={{ ...style }}
        value={<div>{cellData.parentName}</div>}
      />
    );
  }
  return (
    <Table.Cell {...props} className="dev_table_body" style={style}>
      <span>
        {Object.keys(cellData).map((key, index) => (
          <div title={cellData[key]} key={index}>
            {cellData[key]}
          </div>
        ))}
      </span>
    </Table.Cell>
  );
};

export class PersonalList extends React.Component {
  handleReadPartner = (rowData) => {
    this.props.onReadPartner(rowData);
  };

  handleDeletePartner = (rowData) => {
    this.showDeleteConfirm(rowData);
  };
  showDeleteConfirm = (rowData) => {
    let _this = this;
    confirm({
      title: "Bạn có chắc chắn muốn xóa không ?",
      content: "",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        _this.props.onDeletePartner(rowData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  render() {
    let _this = this;
    const {
      dataSource,
      currentPage,
      pageLimit,
      totalLength,
      loading,
      onChangeCurrentPage,
      onChangePageSize,
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
                title: ["PHỤ TRÁCH", "SĐT"],
              },
              {
                name: "col_3",
                title: ["TÊN KHÁCH HÀNG", "SĐT", "EMAIL"],
              },
              {
                name: "col_4",
                title: ["ĐỊA CHỈ", "THÀNH PHỐ"],
              },
              {
                name: "col_12",
                title: ["ĐƠN VỊ QUẢN LÝ"],
              },
              {
                name: "col_7",
                title: ["TỔNG BOOKING"],
              },
              {
                name: "col_8",
                title: ["BOOKING GẦN NHẤT"],
              },
              {
                name: "col_9",
                title: ["TRẠNG THÁI"],
              },
              {
                name: "col_11",
                title: ["REF CODE"],
              },
              {
                name: "col_10",
                title: [""],
              },
            ]}
          >
            <PagingState currentPage={currentPage} pageSize={pageLimit} />
            <IntegratedPaging />
            <DragDropProvider />
            <Table
              columnExtensions={[
                { columnName: "col_1", wordWrapEnabled: true, width: 120 },
                { columnName: "col_11", wordWrapEnabled: true, width: 80 },
                { columnName: "col_2", wordWrapEnabled: true, width: 200 },
                { columnName: "col_3", wordWrapEnabled: true, width: 250 },
                { columnName: "col_4", wordWrapEnabled: true, width: 380 },
                { columnName: "col_12", wordWrapEnabled: true, width: 200 },
                { columnName: "col_10", wordWrapEnabled: true, width: 80 },
                { columnName: "col_8", wordWrapEnabled: true, width: 200 },
                { columnName: "col_9", wordWrapEnabled: true, width: 120 },
              ]}
              cellComponent={(props) => Cell(props, _this)}
            />
            <TableColumnReordering
              order={[
                "col_1",
                "col_11",
                "col_2",
                "col_3",
                "col_4",
                "col_12",
                "col_7",
                "col_8",
                "col_9",
                "col_10",
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
            <TableFixedColumns rightColumns={["col_10"]} />
            <PagingPanel
              messages={{
                info: calculatePageInfo(currentPage, pageLimit, totalLength),
                rowsPerPage: "Số bản ghi trên mỗi trang",
              }}
              containerComponent={(props) => (
                <PagingContainer
                  {...props}
                  onCurrentPageChange={onChangeCurrentPage}
                  onPageSizeChange={onChangePageSize}
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
}

export default PersonalList;
