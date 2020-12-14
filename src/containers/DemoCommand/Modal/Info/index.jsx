import React, { memo, useEffect, useState, useCallback } from "react";
import { Grid, withStyles } from "@material-ui/core";
import { Input, Spin, Select, Button, Checkbox } from "antd";
import _ from "lodash";
import classNames from "classnames";
import { Ui } from "@Helpers/Ui";
import ServiceBase from "@Services/ServiceBase";
import { URI } from "../../constants";
import { Map, List, fromJS, isList } from "immutable";
import * as Yup from "yup";
import TourPlaces from "./TourPlaces";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { compose } from "recompose";
import { connect } from "react-redux";
import BranchCustomer from "@Components/SelectContainer/BranchCustomer";
import Globals from "globals.js";
const tourSchema = Yup.object().shape({
  code: Yup.string().required("*Trường bắt buộc"),
  name: Yup.string().required("*Trường bắt buộc"),
  route: Yup.string().required("*Trường bắt buộc"),
  listRoute: Yup.array()
    .required("*Chưa có điểm nào.")
    .of(
      Yup.object().shape({
        name: Yup.string().required("*Trường bắt buộc")
      })
    )
});
let days = [];
for (var i = 1; i < 31; i++) {
  days.push(i);
}
const TourInfo = ({ tourId, appConfig, onShowModal, actionName, classes }) => {
  const [isSaveTourFetching, setIsSaveTourFetching] = useState(false);
  const [readTourFetching, setReadTourFetching] = useState(false);
  const [canValidate, setCanValidate] = useState(false);
  const [tour, setTour] = useState(() => {
    const profile = Globals.currentUser;
    const objParentId = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName
        }
      : undefined;
    return Map({
      code: "",
      name: "",
      route: "",
      parentId: objParentId ? objParentId.key : "",
      objParentId: Map(objParentId),
      description: "",
      isPublic: false,
      listRoute: List()
    });
  });
  const [tourErrors, setTourErrors] = useState(() => Map());

  /**
   * Callback
   */
  const _validate = useCallback(() => {
    tourSchema
      .validate(tour.toJS(), {
        abortEarly: false
      })
      .then(() => {
        setTourErrors(prevState => {
          let nextState = prevState;
          nextState = nextState.clear();
          return nextState;
        });
      })
      .catch(err => {
        let tempErrors = {};
        _.map(err.inner, ner => {
          _.set(tempErrors, ner.path, ner.message);
        });
        setTourErrors(prevState => {
          let nextState = prevState;
          nextState = nextState.clear();
          _.forEach(tempErrors, (tempValue, tempKey) => {
            nextState = nextState.set(tempKey, tempValue);
          });
          return nextState;
        });
      });
  }, [tour]);

  const _handleSaveTour = useCallback(async () => {
    let data = _.pick(tour.toJS(), [
      "uuid",
      "code",
      "name",
      "type",
      "route",
      "status",
      "rating",
      "parentId",
      "isPublic",
      "numberOfDays",
      "numberOfNights",
      "description",
      "listRoute"
    ]);
    setIsSaveTourFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: actionName === "add" ? URI.ADD_TOUR : URI.EDIT_TOUR,
      data: data
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      if (actionName === "add") {
        Ui.showSuccess({ message: "Tạo tour thành công." });
      } else {
        Ui.showSuccess({ message: "Lưu tour thành công." });
      }
      onShowModal({ isShow: false, actionName: "", tourId: "" });
    }
    setIsSaveTourFetching(false);
  }, [actionName, onShowModal, tour]);
  const _handleChange = useCallback(
    e => {
      let name = e.target.name;
      let value = e.target.value;
      setTour(prevState => prevState.set(name, value));
    },
    [setTour]
  );
  const _handleAddPlace = useCallback(
    e => {
      setTour(prevState => {
        let nextState = prevState;
        if (nextState.get("listRoute").size === 0) {
          nextState = nextState.update("listRoute", x => {
            x = x.push(
              Map({
                dateOffSet: 1,
                order: 1,
                ETA: "00:00"
              })
            );
            return x;
          });
        } else {
          nextState = nextState.update("listRoute", x => {
            x = x.push(
              Map({
                dateOffSet:
                  x.maxBy(y => y.get("dateOffSet")).get("dateOffSet") + 1,
                order: x.maxBy(y => y.get("order")).get("order") + 1,
                ETA: "00:00"
              })
            );
            return x;
          });
        }
        return nextState;
      });
    },
    [setTour]
  );
  //----------------------

  /**
   * Effect
   */
  useEffect(() => {
    if (tourId) {
      _.delay(async () => {
        setReadTourFetching(true);
        let result = await ServiceBase.requestJson({
          url: URI.READ_TOUR,
          method: "POST",
          data: { uuid: tourId }
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          let rs = result.value.data;
          setTour(fromJS(rs));
        }
        setReadTourFetching(false);
        setCanValidate(true);
      }, 600);
    } else {
      setCanValidate(true);
    }
  }, [appConfig, tourId]);
  useEffect(() => {
    if (canValidate) {
      _.delay(() => {
        _validate();
      }, 800);
    }
  }, [_validate, canValidate]);

  useEffect(() => {}, [_validate, canValidate]);
  //-------------------------

  return (
    <div className={classes.info}>
      <Spin spinning={readTourFetching} tip="...Đang lấy dữ liệu">
        <div className="content">
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <label>
                Tên <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={5}>
              <Input
                className={classNames({
                  "border-invalid": tourErrors.get("name")
                })}
                placeholder="Nhập tên tour"
                name="name"
                value={tour.get("name")}
                onChange={_handleChange}
              />
            </Grid>

            <Grid item xs={2}>
              <label>
                Mã tour <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={3}>
              <Input
                className={classNames({
                  "border-invalid": tourErrors.get("code")
                })}
                placeholder="Nhập mã tour"
                name="code"
                value={tour.get("code")}
                onChange={_handleChange}
              />
            </Grid>
            <Grid item xs={2}>
              <label>
                Lộ trình <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={10}>
              <Input
                className={classNames({
                  "border-invalid": tourErrors.get("route")
                })}
                placeholder="Nhập tên lộ trình"
                name="route"
                value={tour.get("route")}
                onChange={_handleChange}
              />
            </Grid>
            <Grid item xs={2}>
              <label>
                Đơn vị quản lý <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={10}>
              <BranchCustomer
                value={
                  tour.get("objParentId")
                    ? tour.get("objParentId").toJS()
                    : undefined
                }
                className={classNames({
                  "border-invalid": tourErrors.get("parentId")
                })}
                onSelect={customer => {
                  setTour(prevState => {
                    let nextState = prevState;
                    nextState = nextState.set("objParentId", fromJS(customer));
                    nextState = nextState.set(
                      "parentId",
                      customer ? customer.key : ""
                    );
                    return nextState;
                  });
                }}
              />
            </Grid>
            <Grid className="d-flex align-items-center" item xs={2}>
              <label>Số ngày đêm</label>
            </Grid>
            <Grid item xs={10}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Select
                    showArrow
                    allowClear
                    value={tour.get("numberOfDays")}
                    placeholder="Chọn ngày"
                    onChange={e =>
                      setTour(prevState => prevState.set("numberOfDays", e))
                    }
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {days.map((d, đId) => {
                      return (
                        <Select.Option key={đId} value={d}>
                          {d}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Grid>
                <Grid className="d-flex align-items-center" item xs={2}>
                  <code>Ngày</code>
                </Grid>
                <Grid item xs={5}>
                  <Select
                    showArrow
                    allowClear
                    value={tour.get("numberOfNights")}
                    placeholder="Chọn đêm"
                    onChange={e =>
                      setTour(prevState => prevState.set("numberOfNights", e))
                    }
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {days.map((d, đId) => {
                      return (
                        <Select.Option key={đId} value={d}>
                          {d}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Grid>
                <Grid className="d-flex align-items-center" item xs={1}>
                  <code>Đêm</code>
                </Grid>
              </Grid>
            </Grid>

            <Grid className="d-flex align-items-center" item xs={2}>
              <label>Xếp hạng</label>
            </Grid>
            <Grid item xs={10}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Select
                    showArrow
                    allowClear
                    value={tour.get("rating")}
                    placeholder="Chọn hạng"
                    onChange={e =>
                      setTour(prevState => prevState.set("rating", e))
                    }
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value={1}>1</Select.Option>
                    <Select.Option value={2}>2</Select.Option>
                    <Select.Option value={3}>3</Select.Option>
                    <Select.Option value={4}>4</Select.Option>
                    <Select.Option value={5}>5</Select.Option>
                  </Select>
                </Grid>
                <Grid className="d-flex align-items-center" item xs={2}>
                  <label>Trạng thái</label>
                </Grid>
                <Grid item xs={6}>
                  <Select
                    showArrow
                    value={
                      tour.get("status") ? tour.get("status").toString() : "1"
                    }
                    placeholder="Chọn trạng thái"
                    onChange={e =>
                      setTour(prevState =>
                        prevState.set("status", e ? _.parseInt(e) : undefined)
                      )
                    }
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {_.map(appConfig.tourStatus, (status, statusId) => {
                      return (
                        <Select.Option key={statusId} value={status.id}>
                          {status.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            <Grid className="d-flex align-items-center" item xs={2}>
              <label>Loại hoạt động</label>
            </Grid>

            <Grid item xs={10}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Select
                    showArrow
                    allowClear
                    mode="multiple"
                    value={
                      List.isList(tour.get("type"))
                        ? tour.get("type").toJS()
                        : []
                    }
                    placeholder="Chọn loại hoạt động"
                    onChange={e =>
                      setTour(prevState => prevState.set("type", fromJS(e)))
                    }
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {_.map(
                      appConfig.tourActivityType,
                      (activity, activityId) => {
                        return (
                          <Select.Option key={activityId} value={activity.id}>
                            {activity.name}
                          </Select.Option>
                        );
                      }
                    )}
                  </Select>
                </Grid>

                <Grid className="d-flex align-items-center" item xs={2}>
                  <label>Công khai</label>
                </Grid>
                <Grid className="d-flex align-items-center" item xs={6}>
                  <Checkbox
                    checked={tour.get("isPublic") || false}
                    onChange={e => {
                      let isPublic = e.target.checked;
                      setTour(prevState => prevState.set("isPublic", isPublic));
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid className="d-flex align-items-center" item xs={2}>
              <label>Mô tả</label>
            </Grid>
            <Grid item xs={10}>
              <Input.TextArea
                placeholder="Nhập mô tả"
                name="description"
                rows={5}
                value={tour.get("description")}
                onChange={e => {
                  let des = e.target.value;
                  setTour(prevState => prevState.set("description", des));
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Button onClick={_handleAddPlace}>Thêm Tuyến/Điểm</Button>
              {_.isString(tourErrors.get("listRoute")) ? (
                <span className="ml-1 kt-font-danger">
                  *Chưa có tuyến/điểm nào
                </span>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <TourPlaces
                setTour={setTour}
                grid={tour.get("listRoute")}
                errors={
                  _.isArray(tourErrors.get("listRoute"))
                    ? tourErrors.get("listRoute")
                    : []
                }
              />
            </Grid>
          </Grid>
        </div>
      </Spin>
      <div className="action">
        <button
          disabled={tourErrors.size}
          type="button"
          className={classNames({
            "btn btn-info btn-icon-sm": true,
            "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger": isSaveTourFetching
          })}
          onClick={_handleSaveTour}
        >
          <i className="fa fa-save" />
          Lưu
        </button>
      </div>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  appConfig: makeSelectAppConfig()
});

export default compose(
  memo,
  connect(mapStateToProps, null),
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
        textAlign: "left"
      },
      "& .content": {}
    }
  })
)(TourInfo);
