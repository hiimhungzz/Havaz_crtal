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
      className="dev_table_body"
      style={props.row.type === "sumary" ? { background: "#8ca5b3" } : {}}
      value={Object.keys(cellData).map((key, index) => (
        <div key={index}>{cellData[key]}</div>
      ))}
    />
  );
};

class RevenueByVehicleStatisticsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
      input: new Map(),
      tableColumnExtensions: [
        { columnName: "col_1", wordWrapEnabled: true, width: 220 },
        // {columnName: 'col_1', width: 100},
        // {columnName: 'col_2', width: 220},
        // {columnName: 'col_3', width: 150},
        // {columnName: 'col_6',wordWrapEnabled: true,width: 200},
        { columnName: "col_4", wordWrapEnabled: true, width: 220 },
        { columnName: "col_5", wordWrapEnabled: true, width: 220 },
        { columnName: "col_6", wordWrapEnabled: true, width: 220 },
        { columnName: "col_7", wordWrapEnabled: true, width: 220 },
        { columnName: "col_8", wordWrapEnabled: true, width: 220 },
        { columnName: "col_9", wordWrapEnabled: true, width: 220 },
        { columnName: "col_10", wordWrapEnabled: true, width: 220 },
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
                title: ["Biển số xe"],
              },
              {
                name: "col_2",
                title: ["Mã KH"],
              },
              {
                name: "col_3",
                title: ["Code đoàn"],
              },
              {
                name: "col_4",
                title: ["Doanh thu KH"],
              },
              {
                name: "col_5",
                title: ["Tiền CTV"],
              },
              {
                name: "col_6",
                title: ["Lợi nhuận CTV"],
              },
              {
                name: "col_7",
                title: ["Doanh thu có VAT"],
              },
              {
                name: "col_8",
                title: ["DT có VAT 4-16C"],
              },
              {
                name: "col_9",
                title: ["DT có VAT 30-35C"],
              },
              {
                name: "col_10",
                title: ["DT có VAT 45C"],
              },
              {
                name: "col_11",
                title: ["DT có VAT CTV"],
              },
              {
                name: "col_12",
                title: ["Doanh thu K VAT"],
              },
              {
                name: "col_13",
                title: ["DT có VAT 4-16C"],
              },
              {
                name: "col_14",
                title: ["DT chưa VAT 30-45C"],
              },
              {
                name: "col_15",
                title: ["DT chưa VAT 45C"],
              },
              {
                name: "col_16",
                title: ["DT chưa VAT CTV"],
              },
              {
                name: "col_17",
                title: ["Ngày in", "Ngày out"],
              },
              {
                name: "col_18",
                title: ["Loại xe"],
              },
              {
                name: "col_19",
                title: ["Lái xe 1", "Lái xe 2"],
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

export default RevenueByVehicleStatisticsList;
