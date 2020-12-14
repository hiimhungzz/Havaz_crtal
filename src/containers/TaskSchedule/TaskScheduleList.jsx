import React, { useState } from "react";
import {
  Divider,
  Icon,
  Input,
  Tag,
  Tooltip,
  Checkbox,
  Radio,
  Row,
  Col,
  Modal,
  Button,
  Popover,
  Select,
  Tabs,
  DatePicker,
  Spin,
} from "antd";
import { fade } from "@material-ui/core/styles/colorManipulator";
import TaskSheduleItem from "./TaskSheduleItem";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  PagingPanel,
  TableFixedColumns,
  VirtualTable,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import {
  PagingContainer,
  Loading,
  TableHeaderContent,
} from "../../components/Utility/common";
import "./style.scss";
import TaskScheduleAction from "../../redux/taskSchedule/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { calculatePageInfo } from "helpers/utility";

const {
  saveSchudule,
  comfirmchudule,
  saveSabbaticalChudule,
  deleteTaskSchudule,
} = TaskScheduleAction;
const { confirm } = Modal;
const { Option } = Select;
const { TabPane } = Tabs;
const styles = (theme) => ({
  tableStriped: {
    "& tbody tr:nth-of-type(odd)": {
      backgroundColor: fade(theme.palette.primary.main, 0.15),
    },
  },
  test: {
    background: "red",
  },
});
const TableComponentBase = ({ classes, ...restProps }) => (
  <Table.Table {...restProps} className={classes.tableStriped} />
);
export const TableComponent = withStyles(styles, { name: "TableComponent" })(
  TableComponentBase
);

export class TaskScheduleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      checkDay: 1,
      selectedRowKeys: [],
      selection: [],
      disabled: true,
      input: new Map(),
      tableColumnExtensions: [
        { columnName: "col_1", width: 150 },
        { columnName: "col_2", width: 150 },
        { columnName: "col_3", width: 150 },
        { columnName: "col_4", width: 150 },
        { columnName: "col_5", width: 150 },
        { columnName: "col_6", width: 150 },
        { columnName: "col_7", width: 150 },
        { columnName: "col_8", width: 150 },
        { columnName: "col_9", width: 150 },
        { columnName: "col_10", width: 150 },
        { columnName: "col_11", width: 150 },
        { columnName: "col_12", width: 150 },
        { columnName: "col_12", width: 150 },
        { columnName: "col_13", width: 150 },
        { columnName: "col_14", width: 150 },
        { columnName: "col_15", width: 150 },
        { columnName: "col_16", width: 150 },
        { columnName: "col_17", width: 150 },
        { columnName: "col_18", width: 150 },
        { columnName: "col_19", width: 150 },
        { columnName: "col_20", width: 150 },
        { columnName: "col_21", width: 150 },
        { columnName: "col_22", width: 150 },
        { columnName: "col_23", width: 150 },
        { columnName: "col_24", width: 150 },
        { columnName: "col_25", width: 150 },
        { columnName: "col_26", width: 150 },
        { columnName: "col_27", width: 150 },
        { columnName: "col_28", width: 150 },
        { columnName: "col_29", width: 150 },
        { columnName: "col_30", width: 150 },
        { columnName: "col_31", width: 150 },
        { columnName: "col_32", width: 150 },
      ],
    };
    this.reason = "";
    this.choice = 1;
    this.option = 1;
    this.toTime = "";
    this.fromTime = "";
    this.choiceGoto = "";
    this.optionGoto = "";
    this.toTimeGoto = "";
    this.fromTimeGoto = "";
    this.loop = "";
    this.onSelectChange = this.onSelectChange.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);

    this.handleViewDriver = this.handleViewDriver.bind(this);
    this.handleEditDriver = this.handleEditDriver.bind(this);
    this.handleDeleteDriver = this.handleDeleteDriver.bind(this);
    this.handleShowVehilceResponse = this.handleShowVehilceResponse.bind(this);
    this.handleHideVehilceResponse = this.handleHideVehilceResponse.bind(this);
  }

  onSaveGoTo = (params) => {
    this.props.saveSchudule(params);
  };
  onSave = (params) => {
    this.props.saveSchudule(params);
  };
  onComfirmchudule = (params) => {
    this.props.comfirmchudule(params);
  };
  onSaveSabbticalchudule = (params) => {
    this.props.saveSabbaticalChudule(params);
  };
  onDeleteSabbticalchudule = (params) => {
    this.props.deleteTaskSchudule(params);
  };

  render() {
    let _this = this;
    const { tableColumnExtensions } = this.state;
    const {
      dataSource,
      listScheduleSuccess,
      loading,
      totalLength,
      currentPage,
      pageLimit,
      classes,
    } = this.props;
    const [pageSizes] = [5, 10, 15];

    const border = { border: "1px solid #e5e5e5" };

    return (
      <div className="pt-3">
        <Paper className="hoverTable">
          <Spin spinning={loading} tip="Đang lấy dữ liệu...">
            <Grid
              rootComponent={(props) => {
                return (
                  <Grid.Root
                    {...props}
                    style={{ ...props.style, height: 600 }}
                  />
                );
              }}
              rows={dataSource}
              columns={listScheduleSuccess}
            >
              <PagingState currentPage={currentPage} pageSize={pageLimit} />
              <IntegratedPaging />
              <Table
                // tableComponent={TableComponent}
                height="auto"
                columnExtensions={tableColumnExtensions}
                cellComponent={(props) => (
                  <TaskSheduleItem
                    onSaveGoto={this.onSaveGoTo}
                    onComfirmchudule={this.onComfirmchudule}
                    onSaveSabbticalchudule={this.onSaveSabbticalchudule}
                    onDeleteSabbticalchudule={this.onDeleteSabbticalchudule}
                    onSave={this.onSave}
                    props={props}
                  />
                )}
                // cellComponent={props => Cell(props, _this)}
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
                  "col_9",
                  "col_10",
                  "col_11",
                  "col_12",
                  "col_13",
                  "col_14",
                  "col_15",
                  "col_16",
                  "col_17",
                  "col_18",
                  "col_19",
                  "col_20",
                  "col_21",
                  "col_22",
                  "col_23",
                  "col_24",
                  "col_25",
                  "col_26",
                  "col_27",
                  "col_28",
                  "col_29",
                  "col_30",
                  "col_31",
                  "col_32",
                ]}
              />

              <TableHeaderRow
                cellComponent={(props) => {
                  if (props.column.isToday == true) {
                    return (
                      <TableHeaderRow.Cell
                        {...props}
                        style={{
                          ...props.style,
                          ...border,
                          background: "#ffcc00",
                          position: "sticky",
                          top: 0,
                          zIndex: "299",
                        }}
                      />
                    );
                  }
                  if (
                    props.column.dateOfWeek == "CN" ||
                    props.column.dateOfWeek == "Thứ 7"
                  ) {
                    return (
                      <TableHeaderRow.Cell
                        {...props}
                        style={{
                          ...props.style,
                          ...border,
                          background: "#fc9999",
                          position: "sticky",
                          top: 0,
                          zIndex: "299",
                        }}
                      />
                    );
                  }
                  if (props.column.name == "col_1") {
                    return (
                      <TableHeaderRow.Cell
                        {...props}
                        style={{
                          ...props.style,
                          ...border,
                          background: "#f2f3f8",
                          position: "sticky",
                          top: 0,
                          zIndex: "300",
                        }}
                      />
                    );
                  }
                  return (
                    <TableHeaderRow.Cell
                      {...props}
                      style={{
                        ...props.style,
                        ...border,
                        background: "#f2f3f8",
                        position: "sticky",
                        top: 0,
                        zIndex: "299",
                      }}
                    />
                  );
                }}
                contentComponent={TableHeaderContent}
              />
              <TableFixedColumns leftColumns={["col_1"]} />

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
      </div>
    );
  }

  onShowSizeChange(current, pageSize) {
    console.log(current, pageSize);
  }

  handleShowVehilceResponse(value, rowId) {
    this.setState((prevState) => {
      let newState = { ...prevState };
      newState.input.set(
        rowId,
        <div className="form-group form-md-line-input inline-div">
          <label
            className="col-md-4 control-label inline-label"
            htmlFor="form_control_1"
          >
            {" "}
            <Icon type="check" />
          </label>
          <div className="col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <select
              className="form-control"
              name="status"
              onChange={this.handleAssignVehicle}
              value={value}
            >
              {this.props.listVehicle.map((vehicle) => {
                return (
                  <option key={vehicle.uuid} value={vehicle.uuid}>
                    {vehicle.code}
                  </option>
                );
              })}
            </select>
            <div className="form-control-focus"></div>
          </div>
        </div>
      );

      return newState;
    });
  }

  handleHideVehilceResponse(value, rowId) {
    this.setState((prevState) => {
      let newState = { ...prevState };
      newState.input.set(rowId, <Tag color={"#87d068"}>{value}</Tag>);
      return newState;
    });
  }

  handleViewDriver(rowData) {
    this.props.handleViewDriver(rowData);
  }

  handleEditDriver(rowData) {
    this.props.handleEditDriver(rowData);
  }

  handleDeleteDriver(rowData) {
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
        _this.props.deleteDriver(rowData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      saveSchudule,
      comfirmchudule,
      saveSabbaticalChudule,
      deleteTaskSchudule,
    },
    dispatch
  );
export default connect(
  "",
  mapDispatchToProps
)(withStyles(styles)(TaskScheduleList));
