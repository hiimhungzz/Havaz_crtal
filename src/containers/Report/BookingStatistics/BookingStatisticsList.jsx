import React from "react";
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
} from "@Components/Utility/common";
import { Spin } from "antd";
import { Paper } from "@material-ui/core";
import { calculatePageInfo } from "helpers/utility";

const Cell = (props, _this) => {
  let cellData = props.value;
  return (
    <Table.Cell
      {...props}
      value={Object.keys(cellData).map((key, index) => (
        <div key={index}>{cellData[key]}</div>
      ))}
    />
  );
};

export class BookingStatisticsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableColumnExtensions: [
        { columnName: "col_1", width: 130 },
        { columnName: "col_2", wordWrapEnabled: true },
        { columnName: "col_3", wordWrapEnabled: true, width: 80 },
        { columnName: "col_4", wordWrapEnabled: true, width: 80 },
        { columnName: "col_5", wordWrapEnabled: true },
        { columnName: "col_6", wordWrapEnabled: true, width: 200 },
        { columnName: "col_7", wordWrapEnabled: true, width: 140 },

        // {columnName: 'col_4', width: 150},
        // {columnName: 'col_5', width: 150},
        // {columnName: 'col_9', width: 100},
        // {columnName: 'col_10', width: 100},
        // {columnName: 'col_11', width: 80},
      ],
    };
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
      <Paper>
        <Spin spinning={loading} tip="Đang lấy dữ liệu...">
          <Grid
            rows={dataSource || []}
            columns={[
              {
                name: "col_1",
                title: ["Ngày thực hiện", "Mã chuyến đi"],
              },
              {
                name: "col_2",
                title: ["Mã khách hàng", "Khách hàng", "Code Booking"],
              },
              {
                name: "col_3",
                title: ["Ngày IN", "Ngày OUT"],
              },
              {
                name: "col_4",
                title: ["Người đặt"],
              },
              {
                name: "col_5",
                title: ["Tên hành khách", "Mã loại xe", "Tuyến đường"],
              },
              {
                name: "col_6",
                title: ["Giờ đón khách"],
              },
              {
                name: "col_7",
                title: ["Trạng thái"],
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
                  onCurrentPageChange={this.props.onChangeCurrentPage}
                  onPageSizeChange={this.props.onChangePageSize}
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
}

export default BookingStatisticsList;
