import React from "react";
import { Spin } from "antd";

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
} from "../../../components/Utility/common";
import { Paper } from "@material-ui/core";
import { calculatePageInfo } from "helpers/utility";

const Cell = (props, _this) => {
  let cellData = props.value;
  return (
    <Table.Cell
      {...props}
      style={props.row.typeRow === "booking" ? { background: "#8ca5b3" } : {}}
      className="dev_table_body"
      value={Object.keys(cellData).map((key, index) => (
        <div key={index}>{cellData[key]}</div>
      ))}
    />
  );
};

export class CustomerDebtByMonthStatisticsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
      input: new Map(),
      tableColumnExtensions: [
        { columnName: "col_7", wordWrapEnabled: true, width: 220 },
        // {columnName: 'col_2', width: 220},
        // {columnName: 'col_3', width: 150},
        // {columnName: 'col_6',wordWrapEnabled: true,width: 200},
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
                title: ["Ngày IN", "Code Booking", "Mã khách hàng"],
              },
              {
                name: "col_2",
                title: ["Ngày thực hiện", "Tên loại xe", "Tuyến đường"],
              },
              {
                name: "col_3",
                title: ["Biển kiểm soát", "Km"],
              },
              {
                name: "col_4",
                title: ["Đơn giá", "Lưu đêm"],
              },
              {
                name: "col_5",
                title: ["Tăng giảm", "Thành tiền"],
              },
              {
                name: "col_6",
                title: ["Trả CTV", "Lợi nhuận CTV"],
              },
              {
                name: "col_7",
                title: ["Ghi Chú"],
              },
              {
                name: "col_8",
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

export default CustomerDebtByMonthStatisticsList;
