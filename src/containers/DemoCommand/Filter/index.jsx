import React, { memo, useCallback } from "react";
import { Input, Select, DatePicker } from "antd";
import moment from "moment";
import _ from "lodash";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import A from "@Components/A";
import PortletBody from "@Components/Portlet/PortletBody";
import { Grid } from "@material-ui/core";
import PortletHead from "@Components/Portlet/PortletHead";
import BranchSubDriver from "components/SelectContainer/BranchSubDriver";
import { momentRange, checkMoment } from "helpers/utility";
import { DATE_TIME_FORMAT } from "constants/common";
import BranchDriver from "components/SelectContainer/BranchDriver";
import NoTypeBranchCustomer from "components/SelectContainer/NoTypeBranchCustomer";
import Corporate from "components/SelectContainer/Corporate";

const Filter = memo(
  ({
    query,
    grid,
    statusTrip,
    setParam,
    selectDriverList,
    selectGuideInfoList,
    onCommandSendMessage,
    onCommandSendSms,
  }) => {
    const _clearFilter = useCallback(
      (e) => {
        e.preventDefault();
        setParam((prevState) => {
          let nextState = prevState;
          nextState = nextState.setIn(
            ["query", "startDate"],
            moment().startOf("day")
          );
          nextState = nextState.setIn(
            ["query", "endDate"],
            moment().endOf("day")
          );
          nextState = nextState.setIn(["currentPage"], 0);
          nextState = nextState.setIn(["query", "tripCode"], "");
          nextState = nextState.setIn(["query", "bookingCode"], "");
          nextState = nextState.setIn(["query", "plate"], "");
          nextState = nextState.setIn(["query", "namePhoneGuide"], "");
          nextState = nextState.setIn(["query", "status"], []);
          nextState = nextState.setIn(["query", "startDate"], null);
          nextState = nextState.setIn(["query", "endDate"], null);
          nextState = nextState.setIn(["query", "organizationUuids"], []);
          nextState = nextState.setIn(["query", "driverUuids"], []);
          nextState = nextState.setIn(["query", "driverUuid"], []);
          nextState = nextState.setIn(["query", "subDriverUuids"], []);
          nextState = nextState.setIn(["query", "subDriverUuid"], []);
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
              <div className="btn-group mr-2" role="group" aria-label="...">
                <button
                  type="button"
                  onClick={(e) => {
                    let submitData = [];
                    selectGuideInfoList.map((x, xId) => {
                      if (x) {
                        submitData.push(grid.get("data")[xId]);
                      }
                    });
                    onCommandSendSms({
                      uuid: _.map(submitData, (x) => x.uuid),
                    });
                  }}
                  className={classNames({
                    "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger disabled": false,
                    "btn btn-secondary d-flex": true,
                  })}
                >
                  <i className="fa fa-sms" /> Gửi tin nhắn &nbsp;
                  <span className="kt-badge kt-badge--danger kt-badge--md kt-badge--rounded">
                    {selectGuideInfoList.count((x) => x === true)}
                  </span>
                  &nbsp;
                </button>
                <button
                  onClick={(e) => {
                    let submitData = [];
                    selectDriverList.map((x, xId) => {
                      if (x) {
                        submitData.push(grid.get("data")[xId]);
                      }
                    });
                    onCommandSendMessage({
                      data: submitData,
                    });
                  }}
                  type="button"
                  className={classNames({
                    "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger disabled": false,
                    "btn btn-secondary d-flex": true,
                  })}
                >
                  <i className="fa fa-bell" /> Gửi thông báo &nbsp;
                  <span className="kt-badge kt-badge--danger kt-badge--md kt-badge--rounded">
                    {selectDriverList.count((x) => x === true)}
                  </span>
                  &nbsp;
                </button>
                <button
                  disabled
                  type="button"
                  className="btn btn-secondary d-flex"
                >
                  <i className="fa fa-envelope" /> Gửi E-mail
                </button>
              </div>
              <A onClick={_clearFilter} className="btn btn-clean btn-icon-sm">
                Xóa bộ lọc
              </A>
            </div>
          </div>
        </PortletHead>
        <PortletBody>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <Input
                value={query.get("tripCode")}
                onChange={(e) =>
                  _changeQuery({ name: "tripCode", value: e.target.value })
                }
                placeholder="Mã lệnh"
              />
            </Grid>
            <Grid item xs={3}>
              <NoTypeBranchCustomer
                value={query.get("organizationUuids")}
                multiple={true}
                parentSelectable={true}
                onSelect={(customer) => {
                  setParam((prevState) => {
                    let nextState = prevState;
                    nextState = nextState.setIn(
                      ["query", "organizationUuids"],
                      customer
                    );
                    return nextState;
                  });
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                value={query.get("plate")}
                onChange={(e) =>
                  _changeQuery({ name: "plate", value: e.target.value })
                }
                placeholder="Biển số xe"
              />
            </Grid>

            <Grid item xs={2}>
              <BranchSubDriver
                value={query.get("subDriverUuids")}
                mode="multiple"
                onSelect={(subDrivers) =>
                  _changeQuery({
                    name: "subDriverUuids",
                    value: subDrivers,
                  })
                }
              />
            </Grid>
            <Grid item xs={3}>
              <DatePicker.RangePicker
                format={DATE_TIME_FORMAT.DD_MM_YYYY}
                allowClear={false}
                value={[
                  checkMoment(query.get("startDate")),
                  checkMoment(query.get("endDate")),
                ]}
                onChange={(dates) => {
                  setParam((prevState) => {
                    let nextState = prevState;
                    if (dates) {
                      nextState = nextState.setIn(
                        ["query", "startDate"],
                        dates[0].startOf("day")
                      );
                      nextState = nextState.setIn(
                        ["query", "endDate"],
                        dates[1].endOf("day")
                      );
                    } else {
                      nextState = nextState.setIn(
                        ["query", "startDate"],
                        undefined
                      );
                      nextState = nextState.setIn(
                        ["query", "endDate"],
                        undefined
                      );
                    }

                    return nextState;
                  });
                }}
                ranges={momentRange}
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                value={query.get("bookingCode")}
                onChange={(e) =>
                  _changeQuery({ name: "bookingCode", value: e.target.value })
                }
                placeholder="Mã booking"
              />
            </Grid>
            <Grid item xs={3}>
              <Input
                value={query.get("namePhoneGuide")}
                onChange={(e) =>
                  _changeQuery({
                    name: "namePhoneGuide",
                    value: e.target.value,
                  })
                }
                placeholder="Tên/SĐT Hướng dẫn viên"
              />
            </Grid>
            <Grid item xs={2}>
              <BranchDriver
                value={query.get("driverUuids")}
                mode="multiple"
                onSelect={(drivers) => {
                  _changeQuery({ name: "driverUuids", value: drivers });
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Select
                showArrow
                allowClear
                mode="multiple"
                value={query.get("status") ? query.get("status") : []}
                style={{ width: "100%" }}
                onChange={(status) =>
                  _changeQuery({ name: "status", value: status })
                }
                placeholder="Trạng thái"
              >
                {_.map(statusTrip, (status, statusId) => {
                  return (
                    <Select.Option key={statusId} value={status.id}>
                      {status.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Grid>
          </Grid>
        </PortletBody>
      </>
    );
  }
);
export default withStyles({})(Filter);
