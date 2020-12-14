import React from "react";
import { Divider, Spin } from "antd";
import { withStyles } from "@material-ui/core/styles";
import { Modal } from "antd";

import {
  Grid,
  DragDropProvider,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  PagingPanel,
  TableFixedColumns,
} from "@devexpress/dx-react-grid-material-ui";
import {
  IntegratedPaging,
  PagingState,
  SelectionState,
} from "@devexpress/dx-react-grid";
import {
  PagingContainer,
  TableHeaderContent,
} from "../../components/Utility/common";

import { Paper, CircularProgress } from "@material-ui/core";
import { calculatePageInfo } from "helpers/utility";

const confirm = Modal.confirm;
export const Loading = () => (
  <div className="loading-shading-mui">
    <CircularProgress className="loading-icon-mui" />
  </div>
);

const Cell = (props, _this) => {
  const { column, style } = props;
  let cellData = props.value;
  if (column.name === "col_7") {
    return (
      <Table.Cell
        {...props}
        className="dev_table_body"
        style={{ textAlign: "center", ...style }}
        value={
          <i
            style={{ color: props.row.col_7.color, fontSize: 14 }}
            title={props.row.col_7.status}
            className={`fa ${props.row.col_7.icon}`}
          />
        }
      />
    );
  }
  if (column.name === "col_10") {
    return (
      <Table.Cell
        {...props}
        style={{ textAlign: "center", ...style }}
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
  if (column.name === "col_8") {
    return (
      <Table.Cell
        {...props}
        style={{ ...style }}
        value={
          <div style={{ textAlign: "center" }}>
            {cellData.numberDriver || "-"}
          </div>
        }
      />
    );
  }
  if (column.name === "col_9") {
    return (
      <Table.Cell
        {...props}
        style={{ ...style }}
        value={
          <div style={{ textAlign: "center" }}>
            {cellData.numberVehicle || "-"}
          </div>
        }
      />
    );
  }

  return (
    <Table.Cell
      {...props}
      className="dev_table_body"
      value={Object.keys(cellData).map((key, index) => (
        <div title={cellData[key]} key={index}>
          {cellData[key]}
        </div>
      ))}
    />
  );
};
export class PartnerList extends React.Component {
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
                title: ["QUẢN LÝ", "SĐT"],
              },
              {
                name: "col_4",
                title: ["TÊN", "SĐT", "EMAIL"],
              },
              {
                name: "col_5",
                title: ["ĐỊA CHỈ", "THÀNH PHỐ"],
              },
              {
                name: "col_6",
                title: ["MÃ SỐ THUẾ"],
              },
              {
                name: "col_7",
                title: ["TRẠNG THÁI"],
              },
              {
                name: "col_8",
                title: ["SỐ LƯỢNG LÁI XE"],
              },
              {
                name: "col_9",
                title: ["SỐ LƯỢNG XE"],
              },
              {
                name: "col_11",
                title: ["REF CODE"],
              },
              {
                name: "col_12",
                title: ["ĐƠN VỊ QUẢN LÝ"],
              },
              {
                name: "col_10",
                title: [""],
              },
            ]}
          >
            <PagingState currentPage={currentPage} pageSize={pageLimit} />
            <IntegratedPaging />
            <Table
              columnExtensions={[
                { columnName: "col_1", wordWrapEnabled: true, width: 100 },
                { columnName: "col_11", wordWrapEnabled: true, width: 120 },
                { columnName: "col_2", wordWrapEnabled: true, width: 120 },
                { columnName: "col_3", wordWrapEnabled: true, width: 120 },
                { columnName: "col_6", wordWrapEnabled: true, width: 100 },
                { columnName: "col_4", wordWrapEnabled: true, width: 250 },
                { columnName: "col_5", wordWrapEnabled: true },
                { columnName: "col_10", wordWrapEnabled: true, width: 80 },
                { columnName: "col_7", wordWrapEnabled: true, width: 60 },
                { columnName: "col_8", wordWrapEnabled: true, width: 70 },
                { columnName: "col_9", wordWrapEnabled: true, width: 70 },
                { columnName: "col_12", wordWrapEnabled: true, width: 200 },
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
                "col_5",
                "col_12",
                "col_6",
                "col_8",
                "col_9",
                "col_7",
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

  handleReadPartner = (rowData) => {
    this.props.onReadPartner(rowData);
  };

  handleDeletePartner = (rowData) => {
    this.showDeleteConfirm(rowData);
  };
  showDeleteConfirm = (rowData) => {
    let _this = this;
    confirm({
      title: "Bạn có muốn xóa CTV này không?",
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
}

export default PartnerList;
