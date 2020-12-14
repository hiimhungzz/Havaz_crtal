import React from "react";
import {
  Grid,
  PagingPanel,
  Table,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import moment from "moment";
import * as PropTypes from "prop-types";
import { Tooltip } from "antd";
import { PagingContainer, Loading } from "../../components/Utility/common";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { calculatePageInfo } from "helpers/utility";

const styles = (theme) => ({
  root_paper: {
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(),
  },
});
const TableHeaderContentBase = ({
  column,
  children,
  classes,
  orderBy,
  handleSort,
  ...restProps
}) => {
  let sort = column.sort;
  return (
    <TableHeaderRow.Content
      column={column}
      {...restProps}
      className="dev_table_content_header"
    >
      {column.title.map((e, index) => {
        // let orderBy = {};
        if (index === 0) {
          return (
            <div key={index}>
              <a
                onClick={(e) => {
                  orderBy[sort[index]] = orderBy[sort[index]] > 0 ? -1 : 1;
                  let temp = {};
                  temp[sort[index]] = orderBy[sort[index]];
                  orderBy = {
                    ...temp,
                    ...orderBy,
                  };
                  handleSort(orderBy);
                }}
              >
                {orderBy[sort[index]] > 0 ? (
                  <i className="fa fa-arrow-up" />
                ) : (
                  <i className="fa fa-arrow-down" />
                )}
                &nbsp;
                {e}
              </a>
              {column.title.length > 1 && " /"}
            </div>
          );
        } else {
          return (
            <div key={index}>
              <a
                onClick={(e) => {
                  orderBy[sort[index]] = orderBy[sort[index]] > 0 ? -1 : 1;
                  let temp = {};
                  temp[sort[index]] = orderBy[sort[index]];
                  orderBy = {
                    ...temp,
                    ...orderBy,
                  };
                  handleSort(orderBy);
                }}
              >
                {orderBy[sort[index]] > 0 ? (
                  <i className="fa fa-arrow-up" />
                ) : (
                  <i className="fa fa-arrow-down" />
                )}
                &nbsp;
                {e}
              </a>
              {index === column.title.length - 1 ? "" : " /"}
            </div>
          );
        }
      })}
    </TableHeaderRow.Content>
  );
};

export const TableHeaderContent = withStyles(styles, {
  name: "TableHeaderContent",
})(TableHeaderContentBase);

const Cell = ({ value, style, ...restProps }, _this) => {
  const { column } = restProps;
  let cellData = value;
  if (column.name === "col_1") {
    if (!cellData.command) {
      return (
        <Table.Cell
          {...restProps}
          className="dev_table_body"
          value={<div>Không có</div>}
        />
      );
    }
    return (
      <Table.Cell
        {...restProps}
        className="dev_table_body"
        value={cellData.command.map((item, index) => (
          <div key={index}>{item.codeTrip}</div>
        ))}
      />
    );
  }
  if (column.name === "col_2") {
    if (!cellData.vehicleRouter) {
      return (
        <Table.Cell
          {...restProps}
          className="dev_table_body"
          value={<div>Không có</div>}
        />
      );
    }
    return (
      <Table.Cell
        {...restProps}
        className="dev_table_body"
        value={cellData.vehicleRouter.map((item, index) => (
          <div key={index}>{item.fixedRoutesName}</div>
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
          <div title={cellData[key]} key={index}>
            <button
              className="viewContent"
              onClick={(f) => _this.onhandleShowModal(restProps.row.key)}
            >
              {cellData[key]}
            </button>
          </div>
        ))}
      />
    );
  }
  if (column.name === "col_5") {
    if (!cellData.date) {
      return (
        <Table.Cell
          {...restProps}
          className="dev_table_body"
          value={<div>Không có</div>}
        />
      );
    }
    return (
      <Table.Cell
        {...restProps}
        className="dev_table_body"
        value={cellData.date.map((item, index) => (
          <div key={index}>{moment(item.pickUpAt).format("DD-MM-YYYY")}</div>
        ))}
      />
    );
  }
  if (column.name === "col_6") {
    const timer = moment(cellData.createdAt).format("DD-MM-YYYY HH:mm:ss");
    return (
      <Table.Cell
        {...restProps}
        className="dev_table_body"
        value={<div>{timer}</div>}
      />
    );
  }
  if (column.name === "col_7") {
    return (
      <Table.Cell
        {...restProps}
        className="dev_table_body"
        value={
          <Tooltip title={_this.renderRoles(cellData.moderator.roles)}>
            <span>{cellData.moderator.fullName}</span>
          </Tooltip>
        }
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

class BookingHistoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderRoles = (roles) => {
    return roles.map((item, index) => <div key={index}>{item.roleName}</div>);
  };

  onhandleShowModal(id) {
    this.props.handleShowModal(id);
  }

  changePageSize = (pageSize) => {
    this.props.onChangePageSize(pageSize);
  };

  changeCurrentPage = (currentPage) => {
    this.props.onChangeCurrentPage(currentPage);
  };

  handleSort = (orderBy) => {};

  render() {
    const orderBy = {
      createdAt: -1,
    };
    let _this = this;
    const {
      dataSource,
      pageSize,
      totalLength,
      currentPage,
      loading,
    } = this.props;
    return (
      <Paper>
        <Grid
          rows={dataSource}
          columns={[
            {
              name: "col_0",
              title: ["MÃ BOOKING"],
              sort: ["codeBooking"],
            },
            {
              name: "col_1",
              title: ["LỆNH"],
              sort: ["command"],
            },
            {
              name: "col_2",
              title: ["TUYẾN"],
              sort: ["vehicleRouter"],
            },
            {
              name: "col_3",
              title: ["HÀNH ĐỘNG"],
              sort: ["action"],
            },

            {
              name: "col_4",
              title: ["NỘI DUNG THAY ĐỔI"],
              sort: ["content"],
            },
            {
              name: "col_5",
              title: ["NGÀY ĐI"],
              sort: ["date"],
            },
            {
              name: "col_6",
              title: ["THỜI GIAN"],
              sort: ["time"],
            },
            {
              name: "col_7",
              title: ["NGƯỜI TÁC ĐỘNG"],
              sort: ["moderator"],
            },
          ]}
        >
          <PagingState currentPage={currentPage} pageSize={pageSize} />
          <IntegratedPaging />
          <Table
            tableComponent={({ style, ...restProps }) => {
              return (
                <Table.Table
                  {...restProps}
                  style={{ ...style, minWidth: 1366 }}
                />
              );
            }}
            columnExtensions={[
              { columnName: "col_0", wordWrapEnabled: true, width: 150 },
              { columnName: "col_1", width: 150 },
              // { columnName: "col_2", wordWrapEnabled: true, width: 250 },
              { columnName: "col_3", wordWrapEnabled: true, width: 200 },
              { columnName: "col_4", wordWrapEnabled: true, width: 150 },
              { columnName: "col_5", wordWrapEnabled: true, width: 150 },
              { columnName: "col_6", wordWrapEnabled: true, width: 150 },
              { columnName: "col_7", wordWrapEnabled: true, width: 150 },
            ]}
            cellComponent={(props) => Cell(props, _this)}
          />
          <TableHeaderRow
            contentComponent={(props) => (
              <TableHeaderContent
                {...props}
                handleSort={this.handleSort}
                orderBy={orderBy}
              />
            )}
            cellComponent={({ className, ...restProps }) => {
              let newClassName = "";
              if (className) {
                newClassName = className + " dev_table_header";
              } else {
                newClassName = "dev_table_header";
              }
              return (
                <TableHeaderRow.Cell {...restProps} className={newClassName} />
              );
            }}
          />
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
        {loading && <Loading />}
      </Paper>
    );
  }
}

BookingHistoryList.propTypes = {
  dataSource: PropTypes.array,
  pageSize: PropTypes.number,
  totalLength: PropTypes.number,
  currentPage: PropTypes.number,
  loading: PropTypes.bool,
};

export default withStyles(styles)(BookingHistoryList);
