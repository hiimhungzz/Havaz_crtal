import React, { memo, useState, useCallback } from "react";
import { Checkbox, Tag, Popover } from "antd";
import _ from "lodash";
import { Paper } from "@material-ui/core";
import A from "@Components/A";
import {
  PagingContainer,
  CustomizeTableHeaderRow,
} from "@Components/Utility/common";
import {
  Grid,
  PagingPanel,
  TableFixedColumns,
  TableColumnReordering,
  TableHeaderRow,
  VirtualTable,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import { calculatePageInfo } from "@Helpers/utility";
import { Map } from "immutable";
import { withStyles } from "@material-ui/core/styles";
import { TableCell } from "@Components/Utility/common";
const TableHeaderContentBase = ({
  column,
  classes,
  isSelectAllDriver,
  setIsSelectAllDriver,
  setSelectDriverList,
  isSelectAllGuideInfo,
  setIsSelectAllGuideInfo,
  setSelectGuideInfoList,
  gridSize,
  ...restProps
}) => {
  restProps.style = {
    ...restProps.style,
    fontSize: 13,
    display: "block",
    color: "#6c7293",
  };
  if (column.name === "driverName") {
    return (
      <TableHeaderRow.Content column={column} {...restProps}>
        <Checkbox
          checked={isSelectAllDriver}
          onChange={(e) => {
            if (e.target.checked) {
              setIsSelectAllDriver(true);
              setSelectDriverList((prevState) => {
                let nextState = prevState;
                for (let index = 0; index < gridSize; index++) {
                  nextState = nextState.set(index, true);
                }
                return nextState;
              });
            } else {
              setIsSelectAllDriver(false);
              setSelectDriverList(Map());
            }
          }}
          type="checkbox"
        >
          {column.title}
        </Checkbox>
      </TableHeaderRow.Content>
    );
  }
  if (column.name === "guideInfo") {
    return (
      <TableHeaderRow.Content column={column} {...restProps}>
        <Checkbox
          checked={isSelectAllGuideInfo}
          onChange={(e) => {
            if (e.target.checked) {
              setIsSelectAllGuideInfo(true);
              setSelectGuideInfoList((prevState) => {
                let nextState = prevState;
                for (let index = 0; index < gridSize; index++) {
                  nextState = nextState.set(index, true);
                }
                return nextState;
              });
            } else {
              setIsSelectAllGuideInfo(false);
              setSelectGuideInfoList(Map());
            }
          }}
          type="checkbox"
        >
          {column.title}
        </Checkbox>
      </TableHeaderRow.Content>
    );
  }
  return (
    <TableHeaderRow.Content column={column} {...restProps}>
      {column.title}
    </TableHeaderRow.Content>
  );
};

const TableHeaderContent = withStyles({})(TableHeaderContentBase);

const Cell = (
  { ...restProps },
  {
    selectDriverList,
    setSelectDriverList,
    isSelectAllDriver,
    setIsSelectAllDriver,
    selectGuideInfoList,
    setSelectGuideInfoList,
    isSelectAllGuideInfo,
    setIsSelectAllGuideInfo,
    gridSize,
    onCommandSendMessage,
  }
) => {
  const { column, value, row } = restProps;
  if (column.name === "driverName") {
    return (
      <TableCell
        {...restProps}
        value={
          <Checkbox
            checked={
              isSelectAllDriver ? true : selectDriverList.get(row.recordId)
            }
            onChange={(e) => {
              let isChecked = e.target.checked;
              setSelectDriverList((prevState) => {
                let nextState = prevState;
                nextState = nextState.set(row.recordId, isChecked);
                let countChecked = nextState.count((x) => x === true);
                if (countChecked === gridSize) {
                  setIsSelectAllDriver(true);
                } else {
                  setIsSelectAllDriver(false);
                }
                return nextState;
              });
            }}
          >
            {value}
            <Popover
              content={
                <div
                  style={{
                    maxWidth: 300,
                  }}
                >
                  <label htmlFor="">
                    Trạng thái: <code>{row.notificationsAction}</code>
                  </label>
                  <br />
                  <label htmlFor="">
                    Nội dung: <code>{row.notificationsContents}</code>
                  </label>
                  <br />
                  {row.notificationsAction.toString().toLowerCase() ===
                  "gửi thất bại" ? (
                    <label htmlFor="">
                      Nội dung lỗi:&nbsp;
                      <code>{row.notificationsMessage}</code>
                    </label>
                  ) : null}
                  <br />
                  <A
                    onClick={() => {
                      // _this.props.commandSendMessage({ data: [record] });
                      onCommandSendMessage({ data: [row] });
                    }}
                    class="kt-link"
                  >
                    {row.notificationsAction.toString().toLowerCase() !==
                    "gửi thất bại"
                      ? "Gửi"
                      : "Gửi lại"}
                  </A>
                </div>
              }
              title={
                <label className="mb-0">
                  Lái xe: <code>{row.driverName}</code>
                </label>
              }
              trigger="click"
            >
              <button className="btn btn-clean btn-sm btn-icon btn-icon-xs">
                <i
                  style={{
                    color:
                      row.notificationsAction.toString().toLowerCase() ===
                      "gửi thất bại"
                        ? "#fd397a"
                        : row.notificationsAction.toString().toLowerCase() ===
                          "gửi thành công"
                        ? "#0abb87"
                        : "#e2e5ec",
                  }}
                  className="fa fa-bell"
                ></i>
              </button>
            </Popover>
          </Checkbox>
        }
      />
    );
  }
  if (column.name === "guideInfo") {
    return (
      <TableCell
        {...restProps}
        value={_.map(row.guideinfo, (guide, guideId) => {
          return (
            <Checkbox
              key={guideId}
              checked={
                isSelectAllGuideInfo
                  ? true
                  : selectGuideInfoList.get(row.recordId)
              }
              onChange={(e) => {
                let isChecked = e.target.checked;
                setSelectGuideInfoList((prevState) => {
                  let nextState = prevState;
                  nextState = nextState.set(row.recordId, isChecked);
                  let countChecked = nextState.count((x) => x === true);
                  if (countChecked === gridSize) {
                    setIsSelectAllGuideInfo(true);
                  } else {
                    setIsSelectAllGuideInfo(false);
                  }
                  return nextState;
                });
              }}
            >
              {guide.name}
              <Popover
                content={
                  <div
                    style={{
                      maxWidth: 300,
                    }}
                  >
                    <label htmlFor="">
                      Trạng thái:
                      <code>{_.get(row, "notificationsGuideInfoAction")}</code>
                    </label>
                    <br />
                    <label htmlFor="">
                      Nội dung:
                      <code>
                        {_.get(row, "notificationsGuideInfoContents")}
                      </code>
                    </label>
                    <br />
                    {_.get(row, "notificationsGuideInfoAction", "")
                      .toString()
                      .toLowerCase() === "gửi thất bại" ? (
                      <label htmlFor="">
                        Nội dung lỗi:&nbsp;
                        <code>
                          {_.get(row, "notificationsGuideInfoMessage", "")}
                        </code>
                      </label>
                    ) : null}
                    <br />
                    <A
                      onClick={() => {
                        // _this.props.commandSendMessage({ data: [record] });
                        onCommandSendMessage({ data: [row] });
                      }}
                      class="kt-link"
                    >
                      {_.get(row, "notificationsGuideInfoAction", "")
                        .toString()
                        .toLowerCase() !== "gửi thất bại"
                        ? "Gửi"
                        : "Gửi lại"}
                    </A>
                  </div>
                }
                title={
                  <label className="mb-0">
                    HDV: <code>{guide.name}</code>
                  </label>
                }
                trigger="click"
              >
                <button className="btn btn-clean btn-sm btn-icon btn-icon-xs">
                  <i
                    style={{
                      color:
                        _.get(row, "notificationsGuideInfoAction", "")
                          .toString()
                          .toLowerCase() === "gửi thất bại"
                          ? "#fd397a"
                          : _.get(row, "notificationsGuideInfoAction", "")
                              .toString()
                              .toLowerCase() === "gửi thành công"
                          ? "#0abb87"
                          : "#e2e5ec",
                    }}
                    className="fa fa-sms"
                  ></i>
                </button>
              </Popover>
            </Checkbox>
          );
        })}
      />
    );
  }
  if (column.name === "comfirmedByDriver") {
    return (
      <TableCell
        {...restProps}
        value={
          <Tag color={row.comfirmedByDriver ? "#0abb87" : "#fd397a"}>
            {row.comfirmedByDriver ? "ĐÃ XÁC NHẬN" : "CHƯA XÁC NHẬN"}
          </Tag>
        }
      />
    );
  }
  if (column.name === "status") {
    return (
      <TableCell
        {...restProps}
        value={<Tag color={row.statusColor}>{row.status}</Tag>}
      />
    );
  }
  return <TableCell {...restProps} />;
};

const CommandList = memo(
  ({
    classes,
    grid,
    setParam,
    onCommandSendMessage,
    selectDriverList,
    setSelectDriverList,
    isSelectAllDriver,
    setIsSelectAllDriver,
    selectGuideInfoList,
    setSelectGuideInfoList,
    isSelectAllGuideInfo,
    setIsSelectAllGuideInfo,
  }) => {
    const [gridConfig] = useState({
      columns: [
        {
          name: "tripsCode",
          title: "MÃ LỆNH",
        },
        {
          name: "bookingCode",
          title: "MÃ BOOKING",
        },
        {
          name: "organizationName",
          title: "KHÁCH HÀNG",
        },
        {
          name: "fixedRoutesName",
          title: "TUYẾN",
        },
        {
          name: "pickUpAt",
          title: "NGÀY ĐI",
        },
        {
          name: "guestNumber",
          title: "SỐ KHÁCH",
        },
        {
          name: "plate",
          title: "BIỂN SỐ",
        },
        {
          name: "driverName",
          title: "LÁI XE",
        },
        {
          name: "stewardessName",
          title: "TIẾP VIÊN",
        },
        {
          name: "guideInfo",
          title: "HDV",
        },
        {
          name: "comfirmedByDriver",
          title: "TÌNH TRẠNG",
        },
        {
          name: "status",
          title: "TRẠNG THÁI",
        },
      ],
      order: [
        "tripsCode",
        "bookingCode",
        "organizationName",
        "fixedRoutesName",
        "pickUpAt",
        "guestNumber",
        "plate",
        "driverName",
        "stewardessName",
        "guideInfo",
        "comfirmedByDriver",
        "status",
      ],
      tableMessages: { noData: "Không có dữ liệu" },
      rowsPerPage: "Số bản ghi trên mỗi trang",
      columnExtensions: [
        { columnName: "tripsCode", wordWrapEnabled: true, width: 100 },
        { columnName: "bookingCode", wordWrapEnabled: true, width: 120 },
        {
          columnName: "organizationName",
          wordWrapEnabled: true,
          width: 250,
        },
        { columnName: "fixedRoutesName", wordWrapEnabled: true, width: 200 },
        { columnName: "pickUpAt", width: 90 },
        { columnName: "guestNumber", width: 80, align: "right" },
        { columnName: "plate", width: 100 },
        { columnName: "driverName", width: 220, align: "left" },
        { columnName: "guideInfo", width: 220, align: "left" },
        { columnName: "stewardessName", width: 150, align: "center" },
        { columnName: "comfirmedByDriver", width: 150, align: "center" },
        { columnName: "status", width: 150, align: "center" },
      ],
    });
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
        <Grid
          rootComponent={(props) => {
            return <Grid.Root {...props} className={classes.rootBase} />;
          }}
          rows={grid.get("data")}
          columns={gridConfig.columns}
        >
          <PagingState
            currentPage={grid.get("currentPage")}
            pageSize={grid.get("pageLimit")}
          />
          <IntegratedPaging />
          <VirtualTable
            messages={gridConfig.tableMessages}
            tableComponent={(props) => {
              return (
                <VirtualTable.Table
                  {...props}
                  style={{ ...props.style, marginBottom: 0 }}
                />
              );
            }}
            columnExtensions={gridConfig.columnExtensions}
            cellComponent={(props) =>
              Cell(props, {
                selectDriverList,
                setSelectDriverList,
                isSelectAllDriver,
                setIsSelectAllDriver,
                selectGuideInfoList,
                setSelectGuideInfoList,
                isSelectAllGuideInfo,
                setIsSelectAllGuideInfo,
                gridSize: grid.get("data").length,
                onCommandSendMessage: onCommandSendMessage,
              })
            }
          />
          <TableColumnReordering order={gridConfig.order} />
          <CustomizeTableHeaderRow
            contentComponent={(props) => (
              <TableHeaderContent
                {...props}
                gridSize={grid.get("data").length}
                isSelectAllDriver={isSelectAllDriver}
                setIsSelectAllDriver={setIsSelectAllDriver}
                setSelectDriverList={setSelectDriverList}
                isSelectAllGuideInfo={isSelectAllGuideInfo}
                setIsSelectAllGuideInfo={setIsSelectAllGuideInfo}
                setSelectGuideInfoList={setSelectGuideInfoList}
              />
            )}
          />
          <TableFixedColumns leftColumns={["tripsCode", "bookingCode"]} />
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
  }
);
export default withStyles({
  rootBase: {
    maxHeight: "calc(100vh - 288px)",
    "& div:first-child": {
      height: "auto !important",
    },
  },
})(CommandList);
