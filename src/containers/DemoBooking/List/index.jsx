import React, { memo, useState, useCallback } from "react";
import { Tag } from "antd";
import { Typography } from "@material-ui/core";
import {
  Grid,
  PagingPanel,
  Table,
  TableColumnReordering,
  TableFixedColumns,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import {
  PagingContainer,
  CustomizeTableHeaderRow,
} from "@Components/Utility/common";
import { calculatePageInfo } from "@Helpers/utility";
import A from "@Components/A";
import { Paper } from "@material-ui/core";
import { TableCell } from "@Components/Utility/common";
import I from "components/I";
import _ from "lodash";
import { FormattedNumber } from "react-intl";

const Cell = ({ ...restProps }, { handleDeleteBooking, handleReadBooking }) => {
  const { column, style, value, row } = restProps;
  let cellData = value;
  if (column.name === "col_7") {
    return (
      <TableCell
        {...restProps}
        value={<Tag color={cellData.color}>{cellData.status}</Tag>}
      />
    );
  }
  if (column.name === "col_12") {
    return (
      <TableCell
        {...restProps}
        value={cellData.requireVehiclesTypeName.map((requireVehicle, index) => {
          if (requireVehicle) {
            return (
              <Typography
                noWrap={true}
                title={requireVehicle}
                key={index}
                variant="body2"
              >
                {requireVehicle}
              </Typography>
            );
          }
          return null;
        })}
      />
    );
  }
  if (column.name === "col_6") {
    return (
      <TableCell
        {...restProps}
        value={_.map(cellData, (cell, cellIndex) => {
          if (cellIndex === "initialPrice") {
            return (
              <Typography
                noWrap={true}
                title={cell}
                key={cellIndex}
                variant="body2"
              >
                <FormattedNumber value={cell} />
              </Typography>
            );
          }
          return (
            <Typography
              noWrap={true}
              title={cell}
              key={cellIndex}
              variant="body2"
            >
              {cell}
            </Typography>
          );
        })}
      />
    );
  }
  if (column.name === "col_11") {
    return (
      <TableCell
        {...restProps}
        style={{
          textAlign: "center",
          paddingRight: 5,
          paddingLeft: 5,
          ...style,
        }}
        value={
          <>
            <A
              onClick={(e) => {
                e.preventDefault();
                handleReadBooking({ bookingId: row.uuid, status: row.status });
              }}
              title="Sửa booking"
            >
              <I className="fa fa-edit" />
            </A>
            {_.get(row, "status", 0).toString() !== "500" && (
              <A
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteBooking(row);
                }}
                title="Hủy booking"
              >
                <I className="fa fa-trash" />
              </A>
            )}
          </>
        }
      />
    );
  } else if (column.name === "col_1") {
    return (
      <TableCell
        {...restProps}
        style={style}
        value={Object.keys(cellData).map((key, index) => (
          <A
            title={cellData[key]}
            key={index}
            onClick={(e) => {
              e.preventDefault();
              handleReadBooking({ bookingId: row.uuid, status: row.status });
            }}
          >
            {cellData[key]}
          </A>
        ))}
      />
    );
  }
  return (
    <TableCell
      {...restProps}
      value={Object.keys(cellData).map((key, index) => (
        <Typography title={cellData[key]} key={index} variant="body2">
          {cellData[key]}
        </Typography>
      ))}
    />
  );
};
const BookingList = ({ grid, onShowDeleteConfirm, onShowModal, setParam }) => {
  const [gridConfig] = useState({
    columns: [
      {
        name: "col_1",
        title: ["CODE BOOKING"],
      },
      {
        name: "col_2",
        title: ["DOANH NGHIỆP"],
      },
      {
        name: "col_3",
        title: ["TÊN LIÊN HỆ", "SĐT", "EMAIL"],
      },
      {
        name: "col_5",
        title: ["NGÀY IN", "NGÀY OUT"],
      },
      {
        name: "col_12",
        title: ["LOẠI XE"],
      },
      {
        name: "col_6",
        title: ["GIÁ", "SỐ KHÁCH", "SỐ NGÀY"],
      },
      {
        name: "col_7",
        title: ["TRẠNG THÁI"],
        sort: ["status"],
      },
      {
        name: "col_8",
        title: ["NV PHỤ TRÁCH", "NGUỒN"],
      },
      {
        name: "col_9",
        title: ["NGÀY TẠO", "NGÀY SỬA"],
      },
      {
        name: "col_11",
        title: [],
      },
    ],
    tip: "Đang lấy dữ liệu...",
    order: [
      "col_1",
      "col_2",
      "col_3",
      "col_5",
      "col_12",
      "col_6",
      "col_8",
      "col_9",
      "col_7",
      "col_11",
    ],
    columnExtensions: [
      { columnName: "col_6", width: 80, align: "right", textAlign: "right" },
      { columnName: "col_7", wordWrapEnabled: true, width: 140 },
      { columnName: "col_3", wordWrapEnabled: true, width: 200 },
      { columnName: "col_8", wordWrapEnabled: true, width: 120 },
      { columnName: "col_1", wordWrapEnabled: true, width: 300 },
      { columnName: "col_2", wordWrapEnabled: true },
      { columnName: "col_12", wordWrapEnabled: true, width: 160 },
      { columnName: "col_5", wordWrapEnabled: true, width: 90 },
      { columnName: "col_9", wordWrapEnabled: true, width: 100 },
      {
        columnName: "col_11",
        align: "right",
        textAlign: "right",
        width: 50,
      },
    ],
    rowsPerPage: "Số bản ghi trên mỗi trang",
    rightColumns: ["col_11"],
  });
  const [] = useState([]);
  const handleReadBooking = useCallback(
    ({ bookingId, status }) => {
      onShowModal({
        isShow: true,
        actionName: "read",
        bookingId: bookingId,
        bookingStatus: status,
      });
    },
    [onShowModal]
  );
  const handleDeleteBooking = useCallback(
    (rowData) => {
      onShowDeleteConfirm(rowData);
    },
    [onShowDeleteConfirm]
  );

  const _onChangePageSize = useCallback(
    (pageSize) => {
      setParam((prevState) => {
        let nextState = prevState;
        nextState = nextState.set("pageLimit", pageSize);
        nextState = nextState.set("currentPage", 0);
        return nextState;
      });
    },
    [setParam]
  );
  const _onChangeCurrentPage = useCallback(
    (currentPage) => {
      setParam((prevState) => {
        let nextState = prevState;
        nextState = nextState.set("currentPage", currentPage);
        return nextState;
      });
    },
    [setParam]
  );
  return (
    <Paper variant="outlined" square>
      <Grid rows={grid.get("data")} columns={gridConfig.columns}>
        <PagingState
          currentPage={grid.get("currentPage")}
          pageSize={grid.get("pageLimit")}
        />
        <IntegratedPaging />
        <Table
          tableComponent={({ style, ...props }) => {
            return (
              <Table.Table {...props} style={{ ...style, minWidth: 1550 }} />
            );
          }}
          columnExtensions={gridConfig.columnExtensions}
          cellComponent={(props) =>
            Cell(props, { handleDeleteBooking, handleReadBooking })
          }
        />
        <TableColumnReordering order={gridConfig.order} />
        <CustomizeTableHeaderRow />
        <TableFixedColumns rightColumns={gridConfig.rightColumns} />
        <PagingPanel
          messages={{
            info: calculatePageInfo(
              grid.get("currentPage"),
              grid.get("pageLimit"),
              grid.get("totalLength")
            ),
            rowsPerPage: gridConfig.rowsPerPage,
          }}
          containerComponent={(props) => (
            <PagingContainer
              {...props}
              onCurrentPageChange={_onChangeCurrentPage}
              onPageSizeChange={_onChangePageSize}
              pageSize={grid.get("pageLimit")}
              totalCount={grid.get("totalLength")}
              currentPage={grid.get("currentPage")}
            />
          )}
        />
      </Grid>
    </Paper>
  );
};

export default memo(BookingList);
