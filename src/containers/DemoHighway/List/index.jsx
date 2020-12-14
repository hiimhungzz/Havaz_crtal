import React, { memo, useState, useCallback } from "react";
import { Modal } from "antd";
import _ from "lodash";
import { Paper } from "@material-ui/core";
import A from "@Components/A";
import { PagingContainer, TableHeaderContent } from "components/Utility/common";
import {
  Grid,
  PagingPanel,
  Table,
  TableColumnReordering,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import { calculatePageInfo } from "helpers/utility";

const Cell = ({ ...restProps }, { _onShowDeleteHighway, _onReadHighway }) => {
  const { column, row } = restProps;
  if (column.name === "action") {
    return (
      <Table.Cell
        {...restProps}
        value={
          <>
            <A
              onClick={(e) => {
                e.preventDefault();
                _onReadHighway(row.id);
              }}
              title="Sửa cao tốc"
              className="fa fa-edit pr-2"
            />
            <A
              onClick={(e) => {
                e.preventDefault();
                _onShowDeleteHighway(row.id);
              }}
              title="Xóa cao tốc"
              className="fa fa-trash"
            />
          </>
        }
      />
    );
  }
  return <Table.Cell {...restProps} />;
};

const HighwayList = memo(
  ({ grid, setParam, onDeleteHighway, onShowHighwayModal }) => {
    const [gridConfig] = useState({
      columns: [
        {
          name: "code",
          title: "MÃ",
        },
        {
          name: "name",
          title: "TÊN",
        },
        {
          name: "distance",
          title: "KM",
        },
        {
          name: "note",
          title: "GHI CHÚ",
        },
        {
          name: "action",
          title: "",
        },
      ],
      order: ["code", "name", "distance", "note", "action"],
      rowsPerPage: "Số bản ghi trên mỗi trang",
      columnExtensions: [
        { columnName: "code", width: 150, align: "left" },
        { columnName: "distance", width: 100, align: "right" },
        { columnName: "note", width: 200, align: "left" },
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
    const _onShowDeleteHighway = useCallback(
      (highwayId) => {
        Modal.confirm({
          title: "Xác nhận xóa cao tốc ?",
          content: "",
          okText: "Xác nhận",
          okType: "danger",
          cancelText: "Hủy",
          onOk() {
            onDeleteHighway({ id: highwayId });
          },
          onCancel() {
            console.log("Cancel");
          },
        });
      },
      [onDeleteHighway]
    );
    const _onReadHighway = useCallback(
      (highwayId) => {
        onShowHighwayModal({
          actionName: "read",
          isShow: true,
          highwayId: highwayId,
        });
      },
      [onShowHighwayModal]
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
            columnExtensions={gridConfig.columnExtensions}
            cellComponent={(props) =>
              Cell(props, { _onShowDeleteHighway, _onReadHighway })
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
export default HighwayList;
