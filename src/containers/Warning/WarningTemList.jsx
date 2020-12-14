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
  Spin
} from "antd";
import { fade } from "@material-ui/core/styles/colorManipulator";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import "./style.scss";

import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  PagingPanel,
  TableFixedColumns,
  VirtualTable
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import {
  PagingContainer,
  Loading,
  TableHeaderContent
} from "../../components/Utility/common";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Paper } from '@material-ui/core';

const { confirm } = Modal;
const { Option } = Select;
const { TabPane } = Tabs;
const styles = theme => ({
  tableStriped: {
    "& tbody tr:nth-of-type(odd)": {
      backgroundColor: fade(theme.palette.primary.main, 0.15)
    }
  },
  test: {
    background: "red"
  }
});
const TableComponentBase = ({ classes, ...restProps }) => (
  <Table.Table {...restProps} className={classes.tableStriped} />
);
export const TableComponent = withStyles(styles, { name: "TableComponent" })(
  TableComponentBase
);

const Cell = ({ value, style, ...props }, _this) => {
  const { column, row } = props;
  let cellData = value;
  const border = { border: "1px solid rgb(242, 243, 248)" };
  let styles = {};
  if (cellData.statusEndDate) {
    if (cellData.statusEndDate.value == 1) {
      styles = {
        background: "#ffcc00"
      };
    } else if (cellData.statusEndDate.value == 2) {
      styles = {
        background: "#ff0000"
      };
    }
  }

  

  return (
    <Table.Cell
      {...props}
      style={{ ...style, fontSize: "13px", ...styles, ...border }}
      value={Object.keys(cellData).map((key, index) => {
        if (typeof cellData[key] === "string") {
          return <div key={index}>{cellData[key]}</div>;
        }
      })}
    />
  );
};

export class WarningTemList extends React.Component {
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
        { columnName: "col_2", wordWrapEnabled: true, width: 220 }
      ]
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);

    this.handleViewDriver = this.handleViewDriver.bind(this);
    this.handleEditDriver = this.handleEditDriver.bind(this);
    this.handleDeleteDriver = this.handleDeleteDriver.bind(this);
  }

  onAction = (params, cellData) => {
    let param = {
      id: cellData.id,
      isActived: params
    };
    this.props.saveConfiguration(param);
  };
  onRequired = (params, cellData) => {
    let param = {
      id: cellData.id,
      isRequired: params
    };
    this.props.saveConfiguration(param);
  };

  render() {
    let _this = this;
    const { tableColumnExtensions } = this.state;
    const {
      dataSource,
      listConfigurationSuccess,
      loading,
      totalLength,
      currentPage,
      pageLimit,
      classes
    } = this.props;

    const border = { border: "1px solid #e5e5e5" };

    return (
      <>
        <Paper className="horver_table">
          <Spin spinning={loading} tip="Đang lấy dữ liệu...">
            <Grid
              rows={dataSource}
              columns={[
                {
                  name: "col_1",
                  title: ["XE"]
                },
                {
                  name: "col_2",
                  title: ["TEM XE"]
                },

                {
                  name: "col_3",
                  title: ["NGÀY CẤP"]
                },
                {
                  name: "col_4",
                  title: [
                    "NGÀY HẾT HẠN",
                
                  ]
                },
                
              ]}
            >
              <PagingState currentPage={currentPage} pageSize={pageLimit} />
              <IntegratedPaging />
              <Table
                // tableComponent={TableComponent}
                columnExtensions={tableColumnExtensions}
                cellComponent={props => Cell(props, _this)}
              />

              <TableColumnReordering
                order={[
                  "col_1",
                  "col_2",
                  "col_3",
                  "col_4",
                  
                ]}
              />

              <TableHeaderRow
                cellComponent={props => {
                  return (
                    <TableHeaderRow.Cell
                      {...props}
                      style={{
                        ...props.style,
                        ...border,
                        background: "#f2f3f8"
                      }}
                    />
                  );
                }}
                contentComponent={TableHeaderContent}
              />

              <PagingPanel
                messages={{
                  info: `1-${pageLimit} của ${parseInt(totalLength)}`,
                  rowsPerPage: "Số bản ghi trên mỗi trang"
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
      </>
    );
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
    this.props.onChangeCurrentPage(currentPage, "2");
  }
  changePageSize(pageSize) {
    this.props.onChangePageSize(pageSize, "2");
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
      }
    });
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);
export default connect(
  "",
  mapDispatchToProps
)(withStyles(styles)(WarningTemList));
