import React, { memo, useCallback } from "react";
import { Select, DatePicker } from "antd";
import { withStyles } from "@material-ui/core/styles";
import A from "@Components/A";
import PortletBody from "@Components/Portlet/PortletBody";
import { Grid } from "@material-ui/core";
import classNames from "classnames";
import PortletHead from "@Components/Portlet/PortletHead";
import Corporate from "@Components/SelectContainer/Corporate";
import Tour from "@Components/SelectContainer/Tour";
import { checkMoment, momentRange } from "helpers/utility";
import VehicleTypeNoOrg from "components/SelectContainer/VehicleTypeNoOrg";
import Vehicle from "components/SelectContainer/Vehicle";
import Contract from "components/SelectContainer/Contract";
import ContractType from "components/SelectContainer/ContractType";
import RouteList from "components/SelectContainer/RouteList";
import { DATE_TIME_FORMAT } from "constants/common";
const Filter = memo(({ query, setParam, onShowCorporateTrackingModal, onExportExcel }) => {
  const _clearFilter = useCallback(
    (e) => {
      e.preventDefault();
      setParam((prevState) => {
        let nextState = prevState;
        nextState = nextState.setIn(["currentPage"], 0);
        nextState = nextState.setIn(["query", "contract"], undefined);
        nextState = nextState.setIn(["query", "corporates"], undefined);
        nextState = nextState.setIn(["query", "contractTypes"], []);
        nextState = nextState.setIn(["query", "routes"], []);
        nextState = nextState.setIn(["query", "startDate"], undefined);
        nextState = nextState.setIn(["query", "endDate"], undefined);
        nextState = nextState.setIn(["query", "vehicleTypes"], []);
        nextState = nextState.setIn(["query", "vehicles"], []);
        nextState = nextState.setIn(["query", "status"], []);
        return nextState;
      });
    },
    [setParam]
  );

  const _changeQuery = useCallback(
    (payload) => {
      setParam((prevState) => {
        let nextState = prevState;
        nextState = nextState.setIn(["query", payload.name], payload.value);
        return nextState;
      });
    },
    [setParam]
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
            <A onClick={_clearFilter} className="btn btn-clean btn-icon-sm">
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
              onSelect={(contract) =>
                _changeQuery({ name: "contract", value: contract })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <Corporate
              mode="multiple"
              value={query.get("corporates")}
              onSelect={(corporates) =>
                _changeQuery({ name: "corporates", value: corporates })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <ContractType
              multiple={true}
              value={query.get("contractTypes")}
              onSelect={(selected) =>
                _changeQuery({ name: "contractTypes", value: selected })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <RouteList
              mode="multiple"
              placeholder="Chọn tuyến đường"
              value={query.get("routes")}
              onSelect={(routes) =>
                _changeQuery({ name: "routes", value: routes })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <DatePicker.RangePicker
              format={DATE_TIME_FORMAT.DD_MM_YYYY}
              value={[
                checkMoment(query.get("startDate")),
                checkMoment(query.get("endDate")),
              ]}
              onChange={(dates) => {
                if (dates.length > 0) {
                  _changeQuery({
                    name: "startDate",
                    value: dates[0].startOf("day"),
                  });
                  _changeQuery({
                    name: "endDate",
                    value: dates[1].endOf("day"),
                  });
                } else {
                  _changeQuery({ name: "startDate", value: undefined });
                  _changeQuery({ name: "endDate", value: undefined });
                }
              }}
              ranges={momentRange}
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
          <Grid item xs={4}>
            <Select
              placeholder="Chọn trạng thái"
              mode="multiple"
              style={{ width: "100%" }}
              value={query.get("status")}
              onChange={(status) =>
                _changeQuery({ name: status, value: status })
              }
            >
              <Select.Option value={0}>Chưa xác nhận</Select.Option>
              <Select.Option value={1}>Đã xác nhận</Select.Option>
            </Select>
          </Grid>
        </Grid>
      </PortletBody>
    </>
  );
});
export default withStyles({})(Filter);
