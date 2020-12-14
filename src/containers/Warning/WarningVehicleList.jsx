import React from "react";
import { Modal, Spin } from "antd";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import "./style.scss";

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
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Paper } from "@material-ui/core";
import { calculatePageInfo } from "helpers/utility";

const { confirm } = Modal;
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

const Cell = ({ value, style, ...props }, _this) => {
  let cellData = value;
  const border = { border: "1px solid rgb(242, 243, 248)" };
  let styles = {};
  if (cellData.circulatedStatus) {
    if (cellData.circulatedStatus.value == 1) {
      styles = {
        background: "#ffcc00",
      };
    } else if (cellData.circulatedStatus.value == 2) {
      styles = {
        background: "#ff0000",
      };
    }
  }
  if (cellData.civilInsuranceaStatus) {
    if (cellData.civilInsuranceaStatus.value == 1) {
      styles = {
        background: "#ffcc00",
      };
    } else if (cellData.civilInsuranceaStatus.value == 2) {
      styles = {
        background: "#ff0000",
      };
    }
  }
  if (cellData.hullInsuranceStatus) {
    if (cellData.hullInsuranceStatus.value == 1) {
      styles = {
        background: "#ffcc00",
      };
    } else if (cellData.hullInsuranceStatus.value == 2) {
      styles = {
        background: "#ff0000",
      };
    }
  }
  if (cellData.roadFeeStatus) {
    if (cellData.roadFeeStatus.value == 1) {
      styles = {
        background: "#ffcc00",
      };
    } else if (cellData.roadFeeStatus.value == 2) {
      styles = {
        background: "#ff0000",
      };
    }
  }
  if (cellData.registeredStatus) {
    if (cellData.registeredStatus.value == 1) {
      styles = {
        background: "#ffcc00",
      };
    } else if (cellData.registeredStatus.value == 2) {
      styles = {
        background: "#ff0000",
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

export class WarningVehicleList extends React.Component {
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
        { columnName: "col_5", wordWrapEnabled: true },
        { columnName: "col_4", wordWrapEnabled: true },
        { columnName: "col_3", wordWrapEnabled: true, width: 130 },
        { columnName: "col_6", wordWrapEnabled: true, width: 130 },
        { columnName: "col_7", wordWrapEnabled: true, width: 130 },
      ],
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
      isActived: params,
    };
    this.props.saveConfiguration(param);
  };
  onRequired = (params, cellData) => {
    let param = {
      id: cellData.id,
      isRequired: params,
    };
    this.props.saveConfiguration(param);
  };

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
                  title: ["BKS"],
                },
                {
                  name: "col_2",
                  title: ["NGÂN HÀNG"],
                },

                {
                  name: "col_3",
                  title: ["HẠN LƯU HÀNH"],
                },
                {
                  name: "col_4",
                  title: [
                    "HẠN BẢO HIỂM DÂN SỰ",
                    "ĐƠN VỊ CUNG CẤP BẢO HIỂM DÂN SỰ",
                  ],
                },
                {
                  name: "col_5",
                  title: [
                    "HẠN BẢO HIỂM THÂN VỎ",
                    "NHÀ CUNG CẤP BẢO HIỂM THÂN VỎ",
                  ],
                },
                {
                  name: "col_6",
                  title: ["HẠN PHÍ ĐƯỜNG BỘ"],
                },
                {
                  name: "col_7",
                  title: ["HẠN ĐĂNG KIỂM"],
                },
              ]}
            >
              <PagingState currentPage={currentPage} pageSize={pageLimit} />
              <IntegratedPaging />
              <Table
                // tableComponent={TableComponent}
                columnExtensions={tableColumnExtensions}
                cellComponent={(props) => Cell(props, _this)}
              />

              <TableColumnReordering
                order={[
                  "col_1",
                  "col_2",
                  "col_4",
                  "col_5",
                  "col_6",
                  "col_7",
                  "col_3",
                ]}
              />

              <TableHeaderRow
                cellComponent={(props) => {
                  return (
                    <TableHeaderRow.Cell
                      {...props}
                      style={{
                        ...props.style,
                        ...border,
                        background: "#f2f3f8",
                      }}
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
      },
    });
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);
export default connect(
  "",
  mapDispatchToProps
)(withStyles(styles)(WarningVehicleList));
