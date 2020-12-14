import React, { memo, useEffect, useState, useCallback } from "react";
import { Grid, withStyles } from "@material-ui/core";
import { Input, Spin } from "antd";
import _ from "lodash";
import classNames from "classnames";
import { Ui } from "@Helpers/Ui";
import ServiceBase from "@Services/ServiceBase";
import { URI } from "../../constants";
import { Map, List, fromJS } from "immutable";
import * as Yup from "yup";
import HighwayVehicle from "./HighwayVehicle";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { compose } from "recompose";
import { connect } from "react-redux";
const highwaySchema = Yup.object().shape({
  code: Yup.string().required("*Trường bắt buộc"),
  name: Yup.string().required("*Trường bắt buộc"),
  distance: Yup.string().required("*Trường bắt buộc")
});

const HighwayInfo = ({
  highwayId,
  appConfig,
  onShowModal,
  actionName,
  classes
}) => {
  const [isSaveHighwayFetching, setIsSaveHighwayFetching] = useState(false);
  const [readHighwayFetching, setReadHighwayFetching] = useState(false);
  const [canValidate, setCanValidate] = useState(false);
  const [highway, setHighway] = useState(() => {
    let priceTable = _.map(appConfig.vehicleType, x => {
      return {
        type: x.id,
        price: null
      };
    });
    return Map({
      code: "",
      name: "",
      distance: "",
      note: "",
      highwayVehicle: priceTable ? fromJS(priceTable) : List()
    });
  });
  const [highwayErrors, setHighwayErrors] = useState(() => Map());

  /**
   * Callback
   */
  const _validate = useCallback(() => {
    highwaySchema
      .validate(highway.toJS(), {
        abortEarly: false
      })
      .then(() => {
        setHighwayErrors(prevState => {
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
        setHighwayErrors(prevState => {
          let nextState = prevState;
          nextState = nextState.clear();
          _.forEach(tempErrors, (tempValue, tempKey) => {
            nextState = nextState.set(tempKey, tempValue);
          });
          return nextState;
        });
      });
  }, [highway]);

  const _handleSaveHighway = useCallback(async () => {
    let data = _.pick(highway.toJS(), [
      "id",
      "code",
      "name",
      "distance",
      "note",
      "highwayVehicle"
    ]);
    setIsSaveHighwayFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: actionName === "add" ? URI.ADD_HIGHWAY : URI.EDIT_HIGHWAY,
      data: data
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      if (actionName === "add") {
        Ui.showSuccess({ message: "Tạo cao tốc thành công." });
      } else {
        Ui.showSuccess({ message: "Lưu cao tốc thành công." });
      }
      onShowModal({ isShow: false, actionName: "", highwayId: "" });
    }
    setIsSaveHighwayFetching(false);
  }, [actionName, onShowModal, highway]);
  const _handleChange = useCallback(
    e => {
      let name = e.target.name;
      let value = e.target.value;
      setHighway(prevState => prevState.set(name, value));
    },
    [setHighway]
  );
  //----------------------

  /**
   * Effect
   */
  useEffect(() => {
    if (highwayId) {
      _.delay(async () => {
        setReadHighwayFetching(true);
        let result = await ServiceBase.requestJson({
          url: URI.READ_HIGHWAY,
          method: "POST",
          data: { id: highwayId }
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          const r = _.filter(appConfig.vehicleType, ({ id: idv }) =>
            _.every(
              result.value.data.highwayVehicle,
              ({ type: idc }) => idv !== idc
            )
          );
          const newArr = _.concat(result.value.data.highwayVehicle, r).map(v =>
            v.price
              ? { type: v.id || v.type, price: v.price }
              : { type: v.id || v.type, price: null }
          );

          let rs = result.value.data;
          rs.highwayVehicle = newArr;
          setHighway(fromJS(rs));
        }
        setReadHighwayFetching(false);
        setCanValidate(true);
      }, 600);
    } else {
      setCanValidate(true);
    }
  }, [appConfig, highwayId]);
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
      <Spin spinning={readHighwayFetching} tip="...Đang lấy dữ liệu">
        <div className="content">
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <label>
                Mã cao tốc <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={8}>
              <Input
                className={classNames({
                  "border-invalid": highwayErrors.get("code")
                })}
                placeholder="Nhập mã cao tốc"
                name="code"
                value={highway.get("code")}
                onChange={_handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <label>
                Tên cao tốc <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={8}>
              <Input
                className={classNames({
                  "border-invalid": highwayErrors.get("name")
                })}
                placeholder="Nhập tên cao tốc"
                name="name"
                value={highway.get("name")}
                onChange={_handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <label>
                KM <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={8}>
              <Input
                className={classNames({
                  "border-invalid": highwayErrors.get("distance")
                })}
                placeholder="Nhập số Km"
                name="distance"
                value={highway.get("distance")}
                onChange={_handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <label>Ghi chú</label>
            </Grid>
            <Grid item xs={8}>
              <Input.TextArea
                placeholder="Nhập ghi chú"
                name="note"
                rows={5}
                value={highway.get("note")}
                onChange={_handleChange}
              />
            </Grid>
            {actionName === "read" && (
              <>
                <Grid item xs={12}>
                  <h5>Bảng giá cao tốc</h5>
                </Grid>
                <Grid item xs={12}>
                  <HighwayVehicle
                    grid={highway.get("highwayVehicle")}
                    setHighway={setHighway}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </div>
      </Spin>
      <div className="action">
        <button
          disabled={highwayErrors.size}
          type="button"
          className={classNames({
            "btn btn-info btn-icon-sm": true,
            "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger": isSaveHighwayFetching
          })}
          onClick={_handleSaveHighway}
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
)(HighwayInfo);
