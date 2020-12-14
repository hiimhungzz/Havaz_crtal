import React from "react";
import { Divider, Tag, Tooltip, Spin } from "antd";
import { Modal } from "antd";

import {
  Grid,
  DragDropProvider,
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

  if (column.name === "col_5") {
    return (
      <Table.Cell
        {...props}
        value={
          <Tooltip title={cellData.description} placement="topLeft">
            {cellData.desShort}
          </Tooltip>
        }
        style={{ textAlign: "left" }}
      />
    );
  }
  if (column.name === "col_7") {
    return (
      <Table.Cell
        {...props}
        style={{ textAlign: "center" }}
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
  if (column.name === "col_8") {
    return (
      <Table.Cell
        {...props}
        style={{ textAlign: "right" }}
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

export class CreateList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
      input: new Map(),
      tableColumnExtensions: [
        { columnName: "col_1", width: 80 },
        { columnName: "col_2", wordWrapEnabled: true },
        { columnName: "col_3", width: 180, wordWrapEnabled: true },
        { columnName: "col_4", width: 180, wordWrapEnabled: true },
        { columnName: "col_5", wordWrapEnabled: true },
        { columnName: "col_6", wordWrapEnabled: true },
        { columnName: "col_7", width: 100, wordWrapEnabled: true },
        { columnName: "col_8", width: 80 },
      ],
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);

    this.handleViewCategory = this.handleViewCategory.bind(this);
    this.handleEditCategory = this.handleEditCategory.bind(this);
    this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
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
      <Spin spinning={loading} tip="Đang lấy dữ liệu...">
        <Paper>
          <Grid
            rows={dataSource}
            columns={[
              {
                name: "col_1",
                title: ["ID"],
              },
              {
                name: "col_2",
                title: ["TÊN DANH MỤC"],
              },
              {
                name: "col_3",
                title: ["MÃ CHI PHÍ"],
              },
              {
                name: "col_4",
                title: ["TÀI KHOẢN"],
              },
              {
                name: "col_5",
                title: ["MÔ TẢ"],
              },
              {
                name: "col_6",
                title: ["ĐƠN VỊ QUẢN LÝ"],
              },
              {
                name: "col_7",
                title: ["TRẠNG THÁI"],
              },
              {
                name: "col_8",
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
        </Paper>
      </Spin>
    );
  }

  onShowSizeChange(current, pageSize) {
    console.log(current, pageSize);
  }

  handleHideVehilceResponse(value, rowId) {
    this.setState((prevState) => {
      let newState = { ...prevState };
      newState.input.set(rowId, <Tag color={"#87d068"}>{value}</Tag>);
      return newState;
    });
  }

  handleViewCategory(rowData) {
    this.props.handleViewCategory(rowData);
  }

  handleEditCategory(rowData) {
    this.props.handleEditCategory(rowData);
  }

  handleDeleteCategory(rowData) {
    this.showDeleteConfirm(rowData.col_1.id);
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
        _this.props.deleteCategory(rowData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
}

export default CreateList;
