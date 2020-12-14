import React from "react";
import { Switch, Tag, Spin } from "antd";
import { Modal } from "antd";
import { Paper } from "@material-ui/core";
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
import { calculatePageInfo } from "helpers/utility";

const confirm = Modal.confirm;

const Cell = (props, _this) => {
  const { column } = props;
  let cellData = props.value;

  if (column.name === "col_5") {
    return (
      <Table.Cell
        {...props}
        value={cellData.action.map((e, index) => (
          <Switch
            disabled={e.status}
            defaultChecked={e.status}
            onChange={(f) => {
              _this[e.handle](props.row);
            }}
          />
        ))}
        style={{ textAlign: "center" }}
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

export class FeedBackList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
      input: new Map(),
      tableColumnExtensions: [
        { columnName: "col_1", wordWrapEnabled: true, width: 250 },
        { columnName: "col_2", wordWrapEnabled: true },
        { columnName: "col_3", wordWrapEnabled: true },
        { columnName: "col_4", wordWrapEnabled: true },
        { columnName: "col_5", width: 100 },
      ],
    };

    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);

    this.handleEditFeedBack = this.handleEditFeedBack.bind(this);
    this.handleHideVehilceResponse = this.handleHideVehilceResponse.bind(this);
  }

  componentDidMount() {}

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
                title: ["NGƯỜI ĐÁNH GIÁ", "NGUỒN ĐÁNH GIÁ"],
              },
              {
                name: "col_2",
                title: ["LÝ DO"],
              },
              {
                name: "col_3",
                title: ["MÔ TẢ"],
              },
              {
                name: "col_4",
                title: ["ĐƠN VỊ QUẢN LÝ"],
              },
              {
                name: "col_5",
                title: ["HÀNH ĐỘNG"],
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
              order={["col_1", "col_2", "col_3", "col_4", "col_5"]}
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

  handleHideVehilceResponse(value, rowId) {
    this.setState((prevState) => {
      let newState = { ...prevState };
      newState.input.set(rowId, <Tag color={"#87d068"}>{value}</Tag>);
      return newState;
    });
  }

  handleEditFeedBack(rowData) {
    this.props.handleEditFeedBack(rowData);
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

export default FeedBackList;
