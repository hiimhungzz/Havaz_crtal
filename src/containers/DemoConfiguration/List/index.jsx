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

const Cell = ({ ...restProps }, { _onReadConfiguration }) => {
  const { column, value, row } = restProps;
  if (column.name === "action") {
    return (
      <TableCell
        {...restProps}
        customStyle={{ paddingTop: 10, paddingBottom: 10 }}
        value={
          <A
            onClick={(e) => {
              e.preventDefault();
              _onReadConfiguration(row.id);
            }}
            title="Sửa cấu hình"
            className="fa fa-edit pr-2"
          />
        }
      />
    );
  }
  if (column.name === "isActived" || column.name === "isRequired") {
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

const ConfigurationList = memo(
  ({ grid, setParam, onShowConfigurationModal }) => {
    const [gridConfig] = useState({
      columns: [
        {
          name: "name",
          title: "ĐỐI TƯỢNG",
        },
        {
          name: "description",
          title: "MÔ TẢ CẢNH BÁO",
        },
        {
          name: "value",
          title: "GIÁ TRỊ",
        },
        {
          name: "parentName",
          title: "ĐƠN VỊ QUẢN LÝ",
        },
        {
          name: "unit",
          title: "ĐƠN VỊ",
        },
        {
          name: "isActived",
          title: "KÍCH HOẠT",
        },
        {
          name: "isRequired",
          title: "BẮT BUỘC",
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
        "value",
        "unit",
        "isActived",
        "isRequired",
        "action",
      ],
      rowsPerPage: "Số bản ghi trên mỗi trang",
      columnExtensions: [
        { columnName: "name", wordWrapEnabled: true },
        { columnName: "description", wordWrapEnabled: true },
        { columnName: "code", width: 150, align: "left" },
        { columnName: "value", width: 60, align: "right" },
        {
          columnName: "parentName",
          width: 250,
          wordWrapEnabled: true,
          align: "left",
        },
        { columnName: "unit", width: 60, align: "center" },
        { columnName: "isActived", width: 70, align: "center" },
        { columnName: "isRequired", width: 70, align: "center" },
        {
          columnName: "action",
          width: 30,
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
    const _onReadConfiguration = useCallback(
      (configurationId) => {
        onShowConfigurationModal({
          actionName: "read",
          isShow: true,
          configurationId: configurationId,
        });
      },
      [onShowConfigurationModal]
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
            cellComponent={(props) => Cell(props, { _onReadConfiguration })}
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
export default ConfigurationList;
