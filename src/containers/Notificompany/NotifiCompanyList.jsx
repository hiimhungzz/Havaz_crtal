import React from "react";
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
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { calculatePageInfo } from "helpers/utility";

const confirm = Modal.confirm;

const Cell = ({ value, style, ...restProps }, _this) => {
  const { column } = restProps;
  let cellData = value;
  if (column.name === "col_0") {
    if (cellData.sentAt !== null) {
      return (
        <Table.Cell
          {...restProps}
          className="dev_table_body"
          value={
            <button
              // disabled={cellData.status}
              type="button"
              className="btn btn-success btnSend"
            >
              Gửi thành công
            </button>
          }
        />
      );
    } else if (cellData.sentAt === null) {
      return (
        <Table.Cell
          {...restProps}
          className="dev_table_body"
          value={
            <button
              // disabled={cellData.status}
              type="button"
              className="btn btn-warning btnSend"
            >
              Chưa gửi
            </button>
          }
        />
      );
    }
    return (
      <Table.Cell
        {...restProps}
        className="dev_table_body"
        value={
          <button type="button" className="btn btn-warning btnSend">
            Đang gửi
          </button>
        }
      />
    );
  }
  if (column.name === "col_1") {
    if (cellData.driverUuid.length === 0)
      return (
        <Table.Cell
          {...restProps}
          className="dev_table_body"
          value={<div>Tất cả</div>}
        />
      );
    return (
      <Table.Cell
        {...restProps}
        className="dev_table_body"
        value={cellData.driverUuid.map((item, index) => (
          <div key={index}>{item.name}</div>
        ))}
      />
    );
  }

  if (column.name === "col_4") {
    return (
      <Table.Cell
        {...restProps}
        className="dev_table_body"
        value={Object.keys(cellData).map((key, index) => (
          <div
            // onclick={this.onClickContent}
            className="html"
            key={index}
            dangerouslySetInnerHTML={{ __html: cellData[key] }}
            title={cellData[key]}
          />
        ))}
      />
    );
  }
  if (column.name === "col_5") {
    if (cellData.dataImage.length === 0)
      return (
        <Table.Cell
          {...restProps}
          className="dev_table_body"
          value={<div>Không có</div>}
        />
      );
    return (
      <Table.Cell
        {...restProps}
        className="dev_table_body"
        value={cellData.dataImage.map((item, index) => (
          <img className="img" key={index} src={item} width="30" height="30" />
        ))}
      />
    );
  }
  if (column.name === "col_6") {
    return (
      <Table.Cell
        {...restProps}
        className="dev_table_body"
        value={
          <div>
            {cellData.refParent ? cellData.refParent.label : "Không có"}
          </div>
        }
      />
    );
  }
  if (column.name === "col_7") {
    const timer = moment(cellData.createdAt).format("DD-MM-YYYY");
    return (
      <Table.Cell
        {...restProps}
        className="dev_table_body"
        value={<div>{timer}</div>}
      />
    );
  }
  if (column.name === "col_8") {
    console.log("cellData", cellData);
    return (
      <Table.Cell
        {...restProps}
        style={{
          textAlign: "center",
          paddingRight: 5,
          paddingLeft: 5,
          ...style,
        }}
        value={cellData.action.map((e, index) => (
          <span key={index}>
            <a
              style={{
                color: "#646c9a",
                fontSize: 14,
              }}
              onClick={(f) =>
                _this[e.handle]({ uuid: restProps.row.key, cellData })
              }
              title={e.name}
            >
              <i className={`fa ${e.icon}`} />
            </a>
            {index < cellData.action.length - 1 ? (
              <Divider type="vertical" />
            ) : null}
          </span>
        ))}
      />
    );
  }
  return (
    <Table.Cell
      {...restProps}
      className="dev_table_body"
      value={Object.keys(cellData).map((key, index) => (
        <div title={cellData[key]} key={index}>
          {cellData[key]}
        </div>
      ))}
    />
  );
};

class NotifiCompanyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  showDeleteConfirm(rowData) {
    let _this = this;
    confirm({
      title: "Bạn có muốn xóa thông báo này?",
      content: "",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        _this.props.onDelete({
          uuid: rowData.uuid,
          //   status: 500
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  handleSendItem = (rowData) => {
    if (rowData.cellData.status && rowData.cellData.sentAt !== null) {
      alert("Thông báo đã gửi không được gửi lại");
    } else {
      this.props.sendNoti(rowData);
    }
  };

  handleViewNoti = (rowData) => {
    this.props.viewNoti(rowData);
  };

  handleDeleteItem = (rowData) => {
    if (rowData.cellData.status && rowData.cellData.sentAt !== null) {
      alert("Thông báo đã gửi không được xóa");
    } else {
      this.showDeleteConfirm(rowData);
    }
  };

  changePageSize = (pageSize) => {
    this.props.onChangePageSize(pageSize);
  };

  changeCurrentPage = (currentPage) => {
    this.props.onChangeCurrentPage(currentPage);
  };

  handleSort = () => {};

  render() {
    const {
      dataSource,
      totalLength,
      pageSize,
      currentPage,
      loading,
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
                title: ["TÊN LÁI XE"],
                sort: ["nameDriver"],
              },
              {
                name: "col_2",
                title: ["TIÊU ĐỀ"],
                sort: ["title"],
              },
              {
                name: "col_3",
                title: ["MÔ TẢ"],
                sort: ["quote"],
              },
              {
                name: "col_4",
                title: ["NỘI DUNG"],
                sort: ["html"],
              },
              {
                name: "col_5",
                title: ["HÌNH ẢNH"],
                sort: ["dataImage"],
              },

              {
                name: "col_0",
                title: ["TRẠNG THÁI"],
                sort: ["status"],
              },
              {
                name: "col_6",
                title: ["ĐƠN VỊ QUẢN LÝ"],
                sort: ["refParent"],
              },
              {
                name: "col_7",
                title: ["THỜI GIAN"],
                sort: ["ceatedAt"],
              },

              {
                name: "col_8",
                title: [],
              },
            ]}
          >
            <PagingState currentPage={currentPage} pageSize={pageSize} />
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
                { columnName: "col_1", width: 150 },
                { columnName: "col_2", wordWrapEnabled: true, width: 200 },
                { columnName: "col_3", wordWrapEnabled: true, width: 250 },
                { columnName: "col_4", wordWrapEnabled: true },
                { columnName: "col_5", wordWrapEnabled: true, width: 150 },
                { columnName: "col_6", wordWrapEnabled: true, width: 200 },
                { columnName: "col_7", wordWrapEnabled: true, width: 150 },
                { columnName: "col_0", wordWrapEnabled: true, width: 200 },
                {
                  columnName: "col_8",
                  align: "right",
                  textAlign: "right",
                  width: 100,
                },
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
            <TableFixedColumns rightColumns={["col_6"]} />
            <PagingPanel
              messages={{
                info: calculatePageInfo(currentPage, pageSize, totalLength),
                rowsPerPage: "Số bản ghi trên mỗi trang",
              }}
              containerComponent={(props) => (
                <PagingContainer
                  {...props}
                  onCurrentPageChange={this.changeCurrentPage}
                  onPageSizeChange={this.changePageSize}
                  pageSize={pageSize}
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

NotifiCompanyList.propTypes = {
  viewNoti: PropTypes.func,
  onDelete: PropTypes.func,
  onChangeCurrentPage: PropTypes.func,
  onChangePageSize: PropTypes.func,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  loading: PropTypes.bool,
  totalLength: PropTypes.number,
};

export default NotifiCompanyList;
