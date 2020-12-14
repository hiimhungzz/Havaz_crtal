import React, { useCallback } from "react";
import _ from "lodash";
import Table from "react-bootstrap/Table";
import { withStyles } from "@material-ui/core/styles";
import PointTableHead from "./Head";
import PointTableBody from "./Body";
import { Paper, Grid } from "@material-ui/core";
import { Button } from "antd";
import { Map } from "immutable";

export const columns = {
  stt: {
    name: "order",
    title: "STT",
  },

  name: {
    name: "name",
    title: "ĐỊA ĐIỂM",
  },
  dateOffSet: {
    name: "dateOffSet",
    title: "NGÀY THỨ",
  },
  typeCity: {
    name: "typeCity",
    title: "LOẠI ĐỊA DANH",
  },
  time: {
    name: "time",
    title: "THỜI GIAN DI CHUYỂN",
  },
  timeLatency: {
    name: "timeLatency",
    title: "THỜI GIAN TRỄ",
  },
  action: {
    name: "action",
    title: " ",
  },
};

const Point = ({ grid, setRoute, routeErrors, classes }) => {
  const _handleAddPoint = useCallback(() => {
    setRoute((prevState) => {
      let nextState = prevState;
      nextState = nextState.update("point", (x) => {
        let nextOrder = 0;
        if (prevState.get("point").size === 0) {
          nextOrder = 1;
        } else {
          let maxRow = prevState.get("point").maxBy((p) => p.get("order"));
          if (maxRow) {
            nextOrder = maxRow.get("order") + 1;
          } else {
            nextOrder = 1;
          }
        }
        let newPoint = Map({
          order: nextOrder,
          dateOffSet: 1,
          name: "",
          timePickup: null,
          typePlace: null,
          timeLatency: null,
        });
        x = x.push(newPoint);
        return x;
      });
      return nextState;
    });
  }, [setRoute]);
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <div>
          <Button onClick={_handleAddPoint}>Thêm địa điểm</Button>
          {routeErrors && _.isString(routeErrors) && (
            <span className="ml-2 kt-font-danger">{routeErrors}</span>
          )}
        </div>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={2}>
          <Table hover className="mb-0">
            <PointTableHead columns={columns} />
            <PointTableBody
              grid={grid}
              columns={columns}
              setRoute={setRoute}
              routeErrors={_.isArray(routeErrors) ? routeErrors : []}
            />
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};
export default withStyles({})(Point);
