import React, { memo, useCallback } from "react";
import { DatePicker } from "antd";
import { withStyles } from "@material-ui/core/styles";
import A from "@Components/A";
import classNames from "classnames";
import PortletBody from "@Components/Portlet/PortletBody";
import { Grid } from "@material-ui/core";
import PortletHead from "@Components/Portlet/PortletHead";
import VehicleTypeNoOrg from "components/SelectContainer/VehicleTypeNoOrg";
import Driver from "components/SelectContainer/Driver";
import Vehicle from "components/SelectContainer/Vehicle";
import Contract from "components/SelectContainer/Contract";
import RouteList from "components/SelectContainer/RouteList";
const Filter = memo(({ query, onSetParam, onClearParam, onExportExcel }) => {
  const _changeQuery = useCallback(
    (payload) => {
      onSetParam(payload);
    },
    [onSetParam]
  );
  return (
    <>
      <PortletHead>
        <div className="kt-portlet__head-label"></div>
        <div className="kt-portlet__head-toolbar">
          <div className="kt-portlet__head-wrapper">
            <button
              type="button"
              onClick={onExportExcel}
              className={classNames({
                "btn btn-danger btn-icon-sm mr-3": true,
              })}
            >
              Xuất excel
          </button>
          </div>
          <div className="kt-portlet__head-wrapper">
            <A onClick={onClearParam} className="btn btn-clean btn-icon-sm">
              Xóa bộ lọc
            </A>
          </div>
        </div>
      </PortletHead>
      <PortletBody>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Contract
              value={query.get("contract")}
              onSelect={(contract, data) => {
                console.log("contract", contract)
                _changeQuery({ name: "contract", value: contract })
              }
              }
            />
          </Grid>
          <Grid item xs={4}>
            <RouteList
              mode="multiple"
              value={query.get("routes")}
              onSelect={(routes) =>
                _changeQuery({ name: "routes", value: routes })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <DatePicker.MonthPicker
              value={query.get("date")}
              onChange={(date) =>  _changeQuery({ name: "date", value: date })}
            />
          </Grid>
          <Grid item xs={4}>
            <VehicleTypeNoOrg
              mode="multiple"
              style={{ width: "100%" }}
              value={query.get("vehicleTypes")}
              onSelect={(vehicleTypes) =>
                _changeQuery({ name: "vehicleTypes", value: vehicleTypes })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <Vehicle
              mode="multiple"
              value={query.get("vehicles")}
              onSelect={(vehicles) =>
                _changeQuery({ name: "vehicles", value: vehicles })
              }
            />
          </Grid>
          {/* <Grid item xs={4}>
            <Driver
              mode="multiple"
              value={query.get("drivers")}
              onSelect={(drivers) =>
                _changeQuery({ name: "drivers", value: drivers })
              }
            />
          </Grid> */}
        </Grid>
      </PortletBody>
    </>
  );
});
export default withStyles({})(Filter);
