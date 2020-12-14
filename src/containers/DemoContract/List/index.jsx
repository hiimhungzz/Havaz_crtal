import React, { memo, useState, useCallback } from "react";
import { Modal, Tag } from "antd";
import { Paper } from "@material-ui/core";
import A from "@Components/A";
import {
  PagingContainer,
  TableCell,
  CustomizeTableHeaderRow,
} from "@Components/Utility/common";
import {
  Grid,
  PagingPanel,
  Table,
  TableColumnReordering,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import { calculatePageInfo } from "helpers/utility";

const Cell = ({ ...restProps }, { _onShowDeleteContract, _onReadContract }) => {
  const { column, value, row } = restProps;
  if (column.name === "action") {
    return (
      <TableCell
        {...restProps}
        value={
          <>
            <A
              onClick={(e) => {
                e.preventDefault();
                _onReadContract(row.uuid);
              }}
              title="Sửa hợp đồng"
              className="fa fa-edit pr-2"
            />
            <A
              onClick={(e) => {
                e.preventDefault();
                _onShowDeleteContract(row.uuid);
              }}
              title="Xóa hợp đồng"
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
        value={<Tag color={row.statusColor}>{row.status}</Tag>}
      />
    );
  }
  return <TableCell {...restProps} />;
};

const CorporateList = memo(
  ({ grid, setParam, onDeleteContract, onShowContractModal }) => {
    const [gridConfig] = useState({
      columns: [
        {
          name: "contractNumber",
          title: "SỐ HỢP ĐỒNG",
        },
        {
          name: "contractType",
          title: "LOẠI HỢP ĐỒNG",
        },
        {
          name: "organizationName",
          title: "TÊN DN",
        },
        {
          name: "signatureDate",
          title: "NGÀY KÝ",
        },
        {
          name: "duration",
          title: "THỜI HẠN",
        },
        {
          name: "action",
          title: "",
        },
      ],
      order: [
        "contractNumber",
        "contractType",
        "organizationName",
        "signatureDate",
        "duration",
        "action",
      ],
      rowsPerPage: "Số bản ghi trên mỗi trang",
      columnExtensions: [
        { columnName: "contractNumber", wordWrapEnabled: true, width: 180 },
        { columnName: "contractType", wordWrapEnabled: true, width: 140 },
        { columnName: "organizationName", wordWrapEnabled: true },
        { columnName: "signatureDate", width: 85, wordWrapEnabled: true },
        {
          columnName: "duration",
          width: 80,
          align: "center",
          wordWrapEnabled: true,
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
    const _onShowDeleteContract = useCallback(
      (contractId) => {
        Modal.confirm({
          title: "Xác nhận xóa hợp đồng ?",
          content: "",
          okText: "Xác nhận",
          okType: "danger",
          cancelText: "Hủy",
          onOk() {
            onDeleteContract({ uuid: contractId });
          },
          onCancel() {
            console.log("Cancel");
          },
        });
      },
      [onDeleteContract]
    );
    const _onReadContract = useCallback(
      (contractId) => {
        onShowContractModal({
          actionName: "read",
          isShow: true,
          contractId: contractId,
        });
      },
      [onShowContractModal]
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
              Cell(props, { _onShowDeleteContract, _onReadContract })
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
