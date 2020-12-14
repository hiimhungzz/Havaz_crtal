import {
  Grid,
  Table,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import { Paper } from "@material-ui/core";
import { Checkbox } from "antd";
import { TableHeaderContent } from "components/Utility/common";
import React, { memo, useCallback } from "react";

const Cell = (props, { _hanldeCheckRole }) => {
  const { column, value, style } = props;
  if (column.title === "~") {
    return (
      <Table.Cell
        {...props}
        style={{ ...style, paddingTop: 8, paddingBottom: 8 }}
        value={value}
      />
    );
  }

  return (
    <Table.Cell
      {...props}
      style={{ ...style, paddingTop: 8, paddingBottom: 8 }}
      value={
        <Checkbox
          onChange={(e) => {
            _hanldeCheckRole({
              columnIndex: props.column.name,
              rowIndex: props.row["~"],
              checked: e.target.checked,
            });
          }}
          checked={value}
        />
      }
    />
  );
};

const UserRole = memo(({ permissions, setRole }) => {
  let dataSource = permissions.toJS();
  let header = dataSource["~"] || [];
  let columns = [{ name: "~", title: "~" }].concat(
    header.map((value) => {
      return {
        name: value,
        title: value,
      };
    })
  );
  let data = [];
  Object.keys(dataSource).forEach((value) => {
    let temp = dataSource[value];
    if (value !== "~") {
      data.push({
        "~": value,
        ...temp,
      });
    }
  });
  const _hanldeCheckRole = useCallback(
    (payload) => {
      if (dataSource[payload.rowIndex]) {
        setRole((prevState) => {
          let nextState = prevState;
          nextState = nextState.update("permissions", (x) => {
            x = x.setIn(
              [payload.rowIndex, payload.columnIndex],
              payload.checked
            );
            return x;
          });
          return nextState;
        });
      }
    },
    [dataSource, setRole]
  );
  if (columns.length < 2) {
    return null;
  }

  return (
    <Paper>
      <Grid rows={data} columns={columns}>
        <Table
          columnExtensions={columns.map((item) => {
            if (item.name === "~") {
              return {
                columnName: item.name,
                width: 150,
                wordWrapEnabled: true,
              };
            } else {
              return {
                columnName: item.name,
                width: "auto",
                wordWrapEnabled: true,
              };
            }
          })}
          cellComponent={(props) => Cell(props, { _hanldeCheckRole })}
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
      </Grid>
    </Paper>
  );
});
export default UserRole;
