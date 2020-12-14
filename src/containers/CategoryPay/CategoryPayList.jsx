import React, { memo } from "react";
import { Divider, Modal, Spin, Tag } from "antd";
import { Typography } from "@material-ui/core";
import {
  Grid,
  PagingPanel,
  Table,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import { PagingContainer } from "@Components/Utility/common";
import { calculatePageInfo } from "@Helpers/utility";
import A from "@Components/A";
import { withStyles } from "@material-ui/core";
import _ from "lodash";

const Cell = ({ ...restProps }, _this) => {
  const { column, value } = restProps;
  let cellData = value;
  if (column.name === "action") {
    return (
      <Table.Cell
        {...restProps}
        value={
          <A
            onClick={(e) => {
              e.preventDefault();
              _this.handleReadCategoryPay({
                uuid: restProps.row.uuid,
              });
            }}
            title="Xem"
          >
            <i className="fa fa-eye" />
          </A>
        }
      />
    );
  }
  return (
    <Table.Cell
      {...restProps}
      value={
        <Typography title={cellData} variant="body2">
          {cellData}
        </Typography>
      }
    />
  );
};

class CategoryPayList extends React.PureComponent {
  state = {
    columns: [
      {
        name: "plate",
        title: "BIỂN SỐ",
      },
      {
        name: "manufactureYear",
        title: "NĂM SX",
      },
      {
        name: "organization",
        title: "DOANH NGHIỆP",
      },
      {
        name: "action",
        title: " ",
      },
    ],
    tip: "Đang lấy dữ liệu...",
    columnExtensions: [
      { columnName: "plate", wordWrapEnabled: true, width: 120 },
      { columnName: "manufactureYear", wordWrapEnabled: true, width: 120 },
      { columnName: "action", wordWrapEnabled: true, width: 80 },
      { columnName: "organization", wordWrapEnabled: true },
    ],
    rowsPerPage: "Số bản ghi trên mỗi trang",
  };
  render() {
    const { changePageSize, changeCurrentPage } = this;
    const _this = this;
    const { grid, classes } = this.props;
    const { columns, tip, columnExtensions, rowsPerPage } = this.state;
    return (
      <Spin spinning={grid.get("loading")} tip={tip}>
        <div className={classes.root}>
          <Grid rows={grid.get("data")} columns={columns}>
            <PagingState
              currentPage={grid.get("currentPage")}
              pageSize={grid.get("pageLimit")}
            />
            <IntegratedPaging />
            <Table
              columnExtensions={columnExtensions}
              cellComponent={(props) => Cell(props, _this)}
            />
            <TableHeaderRow />
            <PagingPanel
              messages={{
                info: calculatePageInfo(
                  grid.get("currentPage"),
                  grid.get("pageLimit"),
                  grid.get("totalLength")
                ),
                rowsPerPage: rowsPerPage,
              }}
              containerComponent={(props) => (
                <PagingContainer
                  {...props}
                  onCurrentPageChange={this.changeCurrentPage}
                  onPageSizeChange={this.changePageSize}
                  pageSize={grid.get("pageLimit")}
                  totalCount={grid.get("totalLength")}
                  currentPage={grid.get("currentPage")}
                />
              )}
            />
            />
          </Grid>
        </div>
      </Spin>
    );
  }

  handleReadCategoryPay(row) {
    let { onShowModal } = this.props;
    onShowModal((prevState) => {
      let nextState = prevState;
      nextState.isShow = true;
      nextState.vehicleId = row.uuid;
      return { ...nextState };
    });
  }
  changeCurrentPage = (currentPage) => {
    let { onSetQuery, onFilter } = this.props;
    onSetQuery((prevState) => {
      let nextState = prevState;
      nextState = nextState.set("pages", currentPage);
      _.delay(() => {
        onFilter(nextState);
      }, 600);
      return nextState;
    });
  };

  changePageSize = (pageSize) => {
    let { onSetQuery, onFilter } = this.props;
    onSetQuery((prevState) => {
      let nextState = prevState;
      nextState = nextState.set("pages", 0);
      nextState = nextState.set("pageSize", pageSize);
      _.delay(() => {
        onFilter(nextState);
      }, 600);
      return nextState;
    });
  };
}
export default memo(
  withStyles({
    root: {
      margin: "0 1rem 1rem 1rem",
      border: "1px solid rgba(0, 0, 0, 0.12)",
    },
  })(CategoryPayList)
);
