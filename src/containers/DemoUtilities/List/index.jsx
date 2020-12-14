import React, { memo, useState, useCallback } from "react";
import { Modal, Checkbox } from "antd";
import _ from "lodash";
import { Paper } from "@material-ui/core";
import A from "@Components/A";
import {
  PagingContainer,
  TableHeaderContent,
  TableCell,
} from "@Components/Utility/common";
import {
  Grid,
  PagingPanel,
  Table,
  TableColumnReordering,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import { calculatePageInfo } from "helpers/utility";

const Cell = (
  { ...restProps },
  { _onShowDeleteUtilities, _onReadUtilities }
) => {
  const { column, value, row } = restProps;
  if (column.name === "action") {
    return (
      <TableCell
        {...restProps}
        customStyle={{ paddingTop: 10, paddingBottom: 10 }}
        value={
          <>
            <A
              onClick={(e) => {
                e.preventDefault();
                _onReadUtilities(row.id);
              }}
              title="Sửa tiện ích"
              className="fa fa-edit pr-2"
            />
            <A
              onClick={(e) => {
                e.preventDefault();
                _onShowDeleteUtilities(row.id);
              }}
              title="Xóa tiện ích"
              className="fa fa-trash"
            />
          </>
        }
      />
    );
  }
  if (column.name === "status") {
    return (
      <TableCell
        {...restProps}
        customStyle={{ paddingTop: 10, paddingBottom: 10 }}
        value={<Checkbox disabled checked={value} />}
      />
    );
  }
  return (
    <TableCell
      {...restProps}
      customStyle={{ paddingTop: 10, paddingBottom: 10 }}
    />
  );
};

const UtilitiesList = memo(
  ({ grid, setParam, onDeleteUtilities, onShowUtilitiesModal }) => {
    const [gridConfig] = useState({
      columns: [
        {
          name: "name",
          title: "TIỆN ÍCH",
        },
        {
          name: "description",
          title: "MÔ TẢ",
        },
        {
          name: "parentName",
          title: "ĐƠN VỊ QUẢN LÝ",
        },
        {
          name: "sort",
          title: "THỨ TỰ",
        },
        {
          name: "status",
          title: "KÍCH HOẠT",
        },
        {
          name: "action",
          title: "",
        },
      ],
      order: [
        "name",
        "description",
        "parentName",
        "sort",
        "status",
        "isActived",
        "action",
      ],
      rowsPerPage: "Số bản ghi trên mỗi trang",
      columnExtensions: [
        { columnName: "name", wordWrapEnabled: true },
        { columnName: "description", wordWrapEnabled: true },
        { columnName: "sort", width: 60, align: "right" },
        {
          columnName: "parentName",
          width: 250,
          wordWrapEnabled: true,
          align: "left",
        },
        { columnName: "status", width: 70, align: "center" },
        {
          columnName: "action",
          width: 50,
        },
      ],
    });
    const _onChangePageSize = useCallback(
      (pageSize) => {
        setParam((prevState) => {
          let nextState = prevState;
          nextState = nextState.set("pageSize", pageSize);
          nextState = nextState.set("pages", 0);
          return nextState;
        });
      },
      [setParam]
    );
    const _onChangeCurrentPage = useCallback(
      (currentPage) => {
        setParam((prevState) => {
          let nextState = prevState;
          nextState = nextState.set("pages", currentPage);
          return nextState;
        });
      },
      [setParam]
    );
    const _onReadUtilities = useCallback(
      (utilitiesId) => {
        onShowUtilitiesModal({
          actionName: "read",
          isShow: true,
          utilitiesId: utilitiesId,
        });
      },
      [onShowUtilitiesModal]
    );
    const _onShowDeleteUtilities = useCallback(
      (utilitiesId) => {
        Modal.confirm({
          title: "Xác nhận xóa tiện ích ?",
          content: "",
          okText: "Xác nhận",
          okType: "danger",
          cancelText: "Hủy",
          onOk() {
            onDeleteUtilities({ id: utilitiesId });
          },
          onCancel() {
            console.log("Cancel");
          },
        });
      },
      [onDeleteUtilities]
    );
    return (
      <Paper variant="outlined" square>
        <Grid rows={grid.get("data")} columns={gridConfig.columns}>
          <PagingState
            currentPage={grid.get("pages")}
            pageSize={grid.get("pageSize")}
          />
          <IntegratedPaging />
          <Table
            columnExtensions={gridConfig.columnExtensions}
            cellComponent={(props) =>
              Cell(props, { _onShowDeleteUtilities, _onReadUtilities })
            }
          />
          <TableColumnReordering order={gridConfig.order} />
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
              info: calculatePageInfo(
                grid.get("pages"),
                grid.get("pageSize"),
                grid.get("total")
              ),
              rowsPerPage: gridConfig.rowsPerPage,
            }}
            containerComponent={(props) => (
              <PagingContainer
                {...props}
                onCurrentPageChange={_onChangeCurrentPage}
                onPageSizeChange={_onChangePageSize}
                pageSize={grid.get("pageSize")}
                totalCount={grid.get("total")}
                currentPage={grid.get("pages")}
              />
            )}
          />
        </Grid>
      </Paper>
    );
  }
);
export default UtilitiesList;
