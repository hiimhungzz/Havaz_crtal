import React, { memo, useState, useCallback } from "react";
import { Modal } from "antd";
import { Paper } from "@material-ui/core";
import A from "@Components/A";
import {
  PagingContainer,
  CustomizeTableHeaderRow,
  TableCell,
} from "components/Utility/common";
import {
  Grid,
  PagingPanel,
  Table,
  TableColumnReordering,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import { calculatePageInfo } from "helpers/utility";

const Cell = (
  { ...restProps },
  { _onShowDeleteCorporate, _onReadCorporate }
) => {
  const { column, value, row } = restProps;
  if (column.name === "status") {
    return (
      <TableCell
        {...restProps}
        value={
          <i
            style={{ color: row.color, fontSize: 14 }}
            title={value}
            className={`fa ${row.icon}`}
          />
        }
      />
    );
  }
  if (column.name === "action") {
    return (
      <TableCell
        {...restProps}
        value={
          <>
            <A
              onClick={(e) => {
                e.preventDefault();
                _onReadCorporate(row.uuid, row.name);
              }}
              title="Sửa doanh nghiệp"
              className="fa fa-edit pr-2"
            />
            <A
              onClick={(e) => {
                e.preventDefault();
                _onShowDeleteCorporate(row.uuid);
              }}
              title="Xóa doanh nghiệp"
              className="fa fa-trash"
            />
          </>
        }
      />
    );
  }
  return <TableCell {...restProps} />;
};

const CorporateList = memo(
  ({ grid, setParam, onDeleteCorporate, onShowCorporateModal }) => {
    const [gridConfig] = useState({
      columns: [
        {
          name: "code",
          title: "MÃ",
        },
        {
          name: "name",
          title: "TÊN DOANH NGHIỆP",
        },
        {
          name: "unit",
          title: "ĐỊA CHỈ",
        },
        {
          name: "parentName",
          title: "ĐƠN VỊ QUẢN LÝ",
        },
        {
          name: "ownerName",
          title: "PHỤ TRÁCH",
        },
        {
          name: "status",
          title: "TRẠNG THÁI",
        },
        {
          name: "action",
          title: "",
        },
      ],
      tableMessages: { noData: "Không có dữ liệu" },
      order: [
        "code",
        "name",
        "parentName",
        "ownerName",
        "unit",
        "status",
        "action",
      ],
      rowsPerPage: "Số bản ghi trên mỗi trang",
      columnExtensions: [
        { columnName: "code", wordWrapEnabled: true, width: 90 },
        { columnName: "name", width: 350, wordWrapEnabled: true },
        { columnName: "parentName", width: 200, wordWrapEnabled: true },
        { columnName: "ownerName", width: 120, wordWrapEnabled: true },
        { columnName: "unit" },
        {
          columnName: "status",
          wordWrapEnabled: true,
          align: "center",
          width: 110,
        },
        { columnName: "action", width: 50 },
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
    const _onShowDeleteCorporate = useCallback(
      (corporateId) => {
        Modal.confirm({
          title: "Xác nhận xóa doanh nghiệp ?",
          content: "",
          okText: "Xác nhận",
          okType: "danger",
          cancelText: "Hủy",
          onOk() {
            onDeleteCorporate({ uuid: corporateId });
          },
          onCancel() {
            console.log("Cancel");
          },
        });
      },
      [onDeleteCorporate]
    );
    const _onReadCorporate = useCallback(
      (corporateId, corporateName) => {
        onShowCorporateModal({
          actionName: "read",
          isShow: true,
          corporateId: corporateId,
          corporateName: corporateName,
        });
      },
      [onShowCorporateModal]
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
            messages={gridConfig.tableMessages}
            columnExtensions={gridConfig.columnExtensions}
            cellComponent={(props) =>
              Cell(props, { _onShowDeleteCorporate, _onReadCorporate })
            }
          />
          <TableColumnReordering order={gridConfig.order} />
          <CustomizeTableHeaderRow />
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
export default CorporateList;
