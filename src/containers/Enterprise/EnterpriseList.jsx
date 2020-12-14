import React, { PureComponent } from "react";
import Paper from "@material-ui/core/Paper";
import {
  Grid,
  PagingPanel,
  Table,
  TableHeaderRow,
  TableFixedColumns,
} from "@devexpress/dx-react-grid-material-ui";
import {
  IntegratedPaging,
  IntegratedSelection,
  PagingState,
  SelectionState,
} from "@devexpress/dx-react-grid";
import moment from "moment";
import * as PropTypes from "prop-types";
import { Divider, Modal, Spin } from "antd";
import {
  PagingContainer,
  Loading,
  TableHeaderContent,
} from "../../components/Utility/common";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { calculatePageInfo } from "helpers/utility";

const confirm = Modal.confirm;

const Cell = (props, _this) => {
  console.log("prps");
  const { column, style } = props;
  var cellData = props.value;
  if (column.name === "col_7") {
    return (
      <Table.Cell
        {...props}
        className="dev_table_body"
        value={<div>{cellData.parentName}</div>}
      />
    );
  }
  if (column.name === "col_8") {
    return (
      <Table.Cell
        className="dev_table_body"
        {...props}
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
  return (
    <Table.Cell
      {...props}
      style={{ textAlign: "left", ...style }}
      className="dev_table_body"
      value={
        <span>
          {Object.keys(cellData).map((key, index) => (
            <div title={cellData[key]} key={index}>
              {cellData[key]}
            </div>
          ))}
        </span>
      }
    />
  );
};

class EnterpriseList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onShowDetailItem = (rowData) => {
    this.props.onShowDetailItem(rowData);
  };

  onDeleteItem = (rowData) => {
    let _this = this;
    confirm({
      title: "Bạn có muốn xóa không?",
      content: "",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        _this.props.onDeleteItem(rowData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  handleSort = () => {};

  render() {
    const {
      dataSource,
      totalLength,
      currentPage,
      pageLimit,
      loading,
      onChangeCurrentPage,
      onChangePageSize,
    } = this.props;
    let _this = this;
    return (
      <Spin spinning={loading} tip="Đang lấy dữ liệu...">
        <Paper>
          <Grid
            rows={dataSource}
            columns={[
              {
                name: "col_1",
                title: ["MÃ", "NGÀY TẠO"],
              },
              {
                name: "col_11",
                title: ["REF CODE"],
              },
              {
                name: "col_2",
                title: ["PHỤ TRÁCH", "SĐT"],
              },
              {
                name: "col_3",
                title: ["TÊN DOANH NGHIỆP", "SĐT", "EMAIL"],
              },
              {
                name: "col_4",
                title: ["ĐỊA CHỈ", "THÀNH PHỐ"],
              },
              {
                name: "col_5",
                title: ["MÃ SỐ THUẾ"],
              },
              {
                name: "col_7",
                title: ["ĐƠN VỊ QUẢN LÝ"],
              },
              // {
              //   name: "col_8",
              //   title: ["BOOKING GẦN NHẤT"]
              // },
              {
                name: "col_9",
                title: ["TRẠNG THÁI"],
              },
              {
                name: "col_10",
                title: [""],
              },
            ]}
          >
            <PagingState currentPage={currentPage} pageSize={pageLimit} />
            <IntegratedPaging />
            <SelectionState selection={[]} />
            <IntegratedSelection />
            <Table
              tableComponent={({ style, ...restProps }) => {
                return (
                  <Table.Table
                    {...restProps}
                    style={{ ...style, minWidth: 1200 }}
                  />
                );
              }}
              columnExtensions={[
                { columnName: "col_1", wordWrapEnabled: true, width: 100 },
                { columnName: "col_11", wordWrapEnabled: true, width: 80 },
                { columnName: "col_2", wordWrapEnabled: true, width: 120 },
                { columnName: "col_5", wordWrapEnabled: true, width: 120 },
                { columnName: "col_7", wordWrapEnabled: true, width: 200 },
                { columnName: "col_3", wordWrapEnabled: true },
                { columnName: "col_4", wordWrapEnabled: true, width: 200 },
                { columnName: "col_10", wordWrapEnabled: true, width: 80 },
                // { columnName: "col_8", wordWrapEnabled: true },
                { columnName: "col_9", wordWrapEnabled: true, width: 100 },
              ]}
              cellComponent={(props) => Cell(props, _this)}
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
        </Paper>
      </Spin>
    );
  }
}

EnterpriseList.propTypes = {};

export default EnterpriseList;
