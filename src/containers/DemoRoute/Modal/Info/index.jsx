import React, { memo, useEffect, useState, useCallback } from "react";
import { Grid, withStyles } from "@material-ui/core";
import { Input, Select, Checkbox, Spin } from "antd";
import _ from "lodash";
import classNames from "classnames";
import Globals from "globals.js";
import { Ui } from "@Helpers/Ui";
import ServiceBase from "@Services/ServiceBase";
import { URI } from "../../constants";
import { Map, List, fromJS } from "immutable";
import * as Yup from "yup";
import { API_URI } from "@Constants";
import { CustomerSelect } from "@Components/Utility/common";
import { STATUS } from "@Constants/common";
import HighwaySelect from "@Components/SelectContainer/Highway";
import Point from "./Point";
import moment from "moment";

const routeSchema = Yup.object().shape({
  parentId: Yup.string().required("*Trường bắt buộc"),
  code: Yup.string().required("*Trường bắt buộc"),
  name: Yup.string().required("*Trường bắt buộc"),
  days: Yup.string().required("*Trường bắt buộc"),
  isHighway: Yup.boolean(),
  highway: Yup.array().when("isHighway", {
    is: true,
    then: Yup.array().required("*Trường bắt buộc"),
  }),
  point: Yup.array()
    .required("*Chưa có điểm nào.")
    .of(
      Yup.object().shape({
        name: Yup.string().required("*Trường bắt buộc"),
      })
    ),
});

const RouteInfo = ({ routeId, onShowModal, actionName, classes }) => {
  const profile = Globals.currentUser;

  const [isSaveRouteFetching, setIsSaveRouteFetching] = useState(false);
  const [readRouteFetching, setReadRouteFetching] = useState(false);
  const [canValidate, setCanValidate] = useState(false);
  const [isFetchPath, setIsFetchPath] = useState(false);
  const [route, setRoute] = useState(() => {
    const parentIds = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName,
        }
      : undefined;
    return Map({
      refCode: "",
      status: "1",
      days: "1",
      parentIds: Map(parentIds),
      parentId: parentIds ? parentIds.key : "",
      isHighway: false,
      point: List(),
      highway: List(),
    });
  });
  const [routeErrors, setRouteErrors] = useState(() => Map());

  /**
   * Callback
   */
  const _validate = useCallback(() => {
    routeSchema
      .validate(route.toJS(), {
        abortEarly: false,
      })
      .then(() => {
        setRouteErrors((prevState) => {
          let nextState = prevState;
          nextState = nextState.clear();
          return nextState;
        });
      })
      .catch((err) => {
        let tempErrors = {};
        _.map(err.inner, (ner) => {
          _.set(tempErrors, ner.path, ner.message);
        });
        setRouteErrors((prevState) => {
          let nextState = prevState;
          nextState = nextState.clear();
          _.forEach(tempErrors, (tempValue, tempKey) => {
            nextState = nextState.set(tempKey, tempValue);
          });
          return nextState;
        });
      });
  }, [route]);

  const _handleSaveRoute = useCallback(async () => {
    let data = _.pick(route.toJS(), [
      "uuid",
      "parentId",
      "refCode",
      "code",
      "name",
      "days",
      "path",
      "distance",
      "preDistance",
      "isHighway",
      "highway",
      "status",
      "point",
    ]);
    let path = {
      path: {
        "0": null,
      },
      color: "#d50000",
      distance: 0,
      preDistance: 0,
      astimateTime: 0,
    };
    data.highway = _.map(data.highway, (x) => x.key) || [];
    data.path = path;
    data.path.preDistance = parseFloat(data.preDistance) || null;
    data.path.distance = parseFloat(data.distance) || null;
    data.point = _.map(data.point, (x) => {
      if (_.isObject(x.location)) {
        x.location = `${x.location.x},${x.location.y}`;
      }
      if (x.timePickup == null) {
        delete x.timePickup;
      }
      if (x.timeLatency == null) {
        delete x.timeLatency;
      }
      if (x.typePlace == null) {
        delete x.typePlace;
      }
      // if(moment.isMoment(x.timeLatency)){
      //   x.timeLatency = x.timeLatency.format("HH:mm")
      // }
      return x;
    });
    setIsSaveRouteFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: actionName === "add" ? `/routes/create` : `/routes/update`,
      data: data,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      if (actionName === "add") {
        Ui.showSuccess({ message: "Tạo tuyến đường thành công." });
        setRoute((prevState) => {
          let nextState = prevState;
          nextState = Map({
            status: "1",
            days: "1",
            isHighway: false,
            point: List(),
          });
          return nextState;
        });
      } else {
        Ui.showSuccess({ message: "Lưu tuyến đường thành công." });
        onShowModal({ isShow: false, actionName: "", routeId: "" });
      }
    }
    setIsSaveRouteFetching(false);
  }, [actionName, onShowModal, route]);
  const _handleChange = useCallback(
    (e) => {
      let name = e.target.name;
      let value = e.target.value;
      setRoute((prevState) => prevState.set(name, value));
    },
    [setRoute]
  );
  const currentPoint = route.get("point");
  const _handleGetPath = useCallback(async () => {
    const point = currentPoint.filter(
      (x) => x.get("name") && x.get("location")
    );
    if (point.size > 1 && canValidate) {
      let pathData = point.map((x) => {
        let location = "";
        if (x.get("location") && Map.isMap(x.get("location"))) {
          location = `${x.get("location").get("x")},${x
            .get("location")
            .get("y")}`;
        } else {
          location = x.get("location");
        }
        return {
          name: x.get("name"),
          location: location,
          order: x.get("order"),
          dateOffset: 1,
        };
      });
      setIsFetchPath(true);
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: `/routes/path/create`,
        data: pathData,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        setRoute((prevState) => {
          let nextState = prevState;
          nextState = nextState.set("distance", result.value.data.distance);
          return nextState;
        });
      }
      setIsFetchPath(false);
    }
  }, [canValidate, currentPoint]);
  //----------------------

  /**
   * Effect
   */
  useEffect(() => {
    if (routeId) {
      _.delay(async () => {
        setReadRouteFetching(true);
        let result = await ServiceBase.requestJson({
          url: URI.READ_ROUTE,
          method: "POST",
          data: { uuid: routeId },
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          let rs = { ...result.value };
          rs.highway = [];
          _.forEach(result.value.highway, (x) => {
            if (x) {
              if (_.isObject(x)) {
                rs.highway.push(x);
              } else {
                rs.highway.push({ key: x });
              }
            }
          });
          rs.distance = _.get(result.value, "path.distance");
          rs.preDistance = _.get(result.value, "path.preDistance");
          rs.parentIds = _.get(result.value, "objParentId");
          setRoute(fromJS(rs));
        }
        setReadRouteFetching(false);
        setCanValidate(true);
      }, 600);
    } else {
      setCanValidate(true);
    }
  }, [routeId]);
  useEffect(() => {
    if (canValidate) {
      _.delay(() => {
        _validate();
      }, 600);
    }
  }, [_validate, canValidate]);
  useEffect(() => {
    _handleGetPath();
  }, [_handleGetPath]);

  useEffect(() => {}, [_validate, canValidate]);
  //-------------------------

  return (
    <div className={classes.info}>
      <Spin spinning={readRouteFetching} tip="...Đang lấy dữ liệu">
        <div className="content">
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <label>
                Đơn vị quản lý <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={8}>
              <CustomerSelect
                className={classNames({
                  "border-invalid": routeErrors.get("parentId"),
                })}
                value={
                  route.get("parentIds")
                    ? route.get("parentIds").toJS()
                    : undefined
                }
                url={API_URI.GET_LIST_COMPANY_FOR_ENTERPRISE}
                placeholder="Đơn vị quản lý"
                onSelect={(customer) => {
                  setRoute((prevState) => {
                    let nextState = prevState;
                    nextState = nextState.set("parentIds", Map(customer));
                    nextState = nextState.set(
                      "parentId",
                      customer ? customer.key : ""
                    );
                    return nextState;
                  });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <label>Ref Code</label>
            </Grid>
            <Grid item xs={8}>
              <Input
                placeholder="Nhập refCode"
                name="refCode"
                value={route.get("refCode")}
                onChange={_handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <label>
                Mã tuyến <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={8}>
              <Input
                className={classNames({
                  "border-invalid": routeErrors.get("code"),
                })}
                placeholder="Mã tuyến đường"
                name="code"
                value={route.get("code")}
                onChange={_handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <label>
                Tên tuyến <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={8}>
              <Input
                className={classNames({
                  "border-invalid": routeErrors.get("name"),
                })}
                placeholder="Tên tuyến đường"
                name="name"
                value={route.get("name")}
                onChange={_handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <label>
                Số ngày <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={8}>
              <Select
                name="days"
                showArrow
                style={{ width: "100%" }}
                placeholder="Số ngày"
                value={route.get("days")}
                onChange={(days) =>
                  setRoute((prevState) => prevState.set("days", days))
                }
              >
                <Select.Option value="0.5">0.5</Select.Option>
                <Select.Option value="1">1</Select.Option>
              </Select>
            </Grid>
            <Grid item xs={4}>
              <label>Trạng thái</label>
            </Grid>
            <Grid item xs={8}>
              <Select
                showArrow
                style={{ width: "100%" }}
                placeholder="Trạng thái"
                value={route.get("status")}
                onChange={(status) =>
                  setRoute((prevState) => prevState.set("status", status))
                }
              >
                {STATUS.map((status, statusId) => {
                  return (
                    <Select.Option key={statusId} value={status.value}>
                      {status.label}
                    </Select.Option>
                  );
                })}
              </Select>
            </Grid>
            <Grid item xs={4}>
              <label>Số KM thực tế</label>
            </Grid>
            <Grid item xs={8}>
              <Input disabled value={route.get("distance")} />
              {isFetchPath && (
                <span className="kt-label-font-color-1">
                  ...Đang lấy số KM thực tế
                </span>
              )}
            </Grid>
            <Grid item xs={4}>
              <label>Số KM đề xuất</label>
            </Grid>
            <Grid item xs={8}>
              <Input
                name="preDistance"
                placeholder="Số Km đề xuất"
                value={route.get("preDistance")}
                onChange={_handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <label>Đi cao tốc</label>
            </Grid>
            <Grid item xs={8}>
              <Checkbox
                name="isHighway"
                checked={route.get("isHighway")}
                onChange={(e) =>
                  setRoute((prevState) =>
                    prevState.set("isHighway", e.target.checked)
                  )
                }
              />
            </Grid>
            <Grid item xs={4}>
              <label>
                Tên cao tốc
                {route.get("isHighway") && (
                  <span className="kt-font-danger">*</span>
                )}
              </label>
            </Grid>
            <Grid item xs={8}>
              <HighwaySelect
                mode={"multiple"}
                value={
                  route.get("highway") ? route.get("highway").toJS() : List()
                }
                onSelect={(highway) =>
                  setRoute((prevState) =>
                    prevState.set("highway", fromJS(highway))
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Point
                grid={route.get("point")}
                setRoute={setRoute}
                routeErrors={routeErrors.get("point")}
              />
            </Grid>
          </Grid>
        </div>
      </Spin>
      <div className="action">
        <button
          disabled={routeErrors.size}
          type="button"
          className={classNames({
            "btn btn-info btn-icon-sm": true,
            "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger": isSaveRouteFetching,
          })}
          onClick={_handleSaveRoute}
        >
          <i className="fa fa-save" />
          Lưu
        </button>
      </div>
    </div>
  );
};
export default memo(
  withStyles({
    info: {
      paddingBottom: 55,
      "& .action": {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        borderTop: "1px solid #e9e9e9",
        padding: "5px 16px",
        background: "#fff",
        textAlign: "left",
      },
      "& .content": {},
    },
  })(RouteInfo)
);
