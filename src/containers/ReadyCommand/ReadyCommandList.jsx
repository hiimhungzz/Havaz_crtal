import React from "react";
import { Spin, Tag } from "antd";
import { withStyles } from "@material-ui/core/styles";

import {
  Grid,
  PagingPanel,
  Table,
  TableColumnReordering,
  TableHeaderRow,
  TableFixedColumns,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import {
  PagingContainer,
  TableHeaderContent,
} from "../../components/Utility/common";
import * as PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
import { calculatePageInfo } from "helpers/utility";

const Cell = (props, _this) => {
  const { column } = props;
  let cellData = props.value;
  if (column.name === "col_5") {
    return (
      <Table.Cell
        {...props}
        className="dev_table_body"
        value={<Tag color={cellData.color}>{cellData.label}</Tag>}
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

class ReadyCommandList extends React.Component {
  render() {
    let _this = this;
    const {
      dataSource,
      currentPage,
      totalLength,
      pageLimit,
      loading,
    } = this.props;
    return (
      <Spin spinning={loading} tip="Đang lấy dữ liệu...">
        <Paper>
          <Grid
            rows={dataSource}
            columns={[
              {
                name: "col_1",
                title: ["LÁI XE"],
              },
              {
                name: "col_2",
                title: ["BIỂN SỐ"],
              },
              {
                name: "col_3",
                title: ["THỜI GIAN"],
              },
              {
                name: "col_4",
                title: ["VỊ TRÍ"],
              },
              {
                name: "col_5",
                title: ["TRẠNG THÁI"],
              },
            ]}
          >
            <PagingState currentPage={currentPage} pageSize={pageLimit} />
            <IntegratedPaging />
            <Table
              columnExtensions={[{ columnName: "col_5", width: 160 }]}
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
            <TableFixedColumns
              //   leftColumns={[TableSelection.COLUMN_TYPE]}
              rightColumns={["col_10"]}
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

  changeCurrentPage = (currentPage) => {
    this.props.onChangeCurrentPage(currentPage);
  };

  changePageSize = (pageSize) => {
    this.props.onChangePageSize(pageSize);
  };
}

ReadyCommandList.propTypes = {
  dataSource: PropTypes.array,
  viewBooking: PropTypes.func,
  deleteBooking: PropTypes.func,
  onChangeCurrentPage: PropTypes.func,
  onChangePageSize: PropTypes.func,
  currentPage: PropTypes.number,
  pageLimit: PropTypes.number,
  loading: PropTypes.bool,
  totalLength: PropTypes.number,
};

export default ReadyCommandList;
