import React, { memo, useEffect, useState, useCallback } from "react";
import { Grid, withStyles } from "@material-ui/core";
import { Input, Spin, Checkbox } from "antd";
import _ from "lodash";
import classNames from "classnames";
import { Ui } from "@Helpers/Ui";
import ServiceBase from "@Services/ServiceBase";
import { URI } from "../../constants";
import { Map } from "immutable";
import * as Yup from "yup";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { compose } from "recompose";
import { connect } from "react-redux";
import Globals from "globals.js";
import BranchCustomer from "components/SelectContainer/BranchCustomer";
const utilitiesSchema = Yup.object().shape({
  parentId: Yup.object()
    .required("*Trường bắt buộc")
    .shape({
      key: Yup.string().required("*Trường bắt buộc")
    }),
  name: Yup.string().required("*Trường bắt buộc"),
  key: Yup.string().required("*Trường bắt buộc"),
  sort: Yup.string().required("*Trường bắt buộc")
});

const UtilitiesInfo = ({
  utilitiesId,
  appConfig,
  onShowModal,
  actionName,
  classes
}) => {
  const [isSaveUtilitiesFetching, setIsSaveUtilitiesFetching] = useState(false);
  const [readUtilitiesFetching, setReadUtilitiesFetching] = useState(false);
  const [canValidate, setCanValidate] = useState(false);
  const [utilities, setUtilities] = useState(() => {
    const profile = Globals.currentUser;
    const objParentId = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName
        }
      : undefined;
    return Map({
      parentId: objParentId,
      name: undefined,
      key: undefined,
      description: "",
      sort: null,
      status: false
    });
  });
  const [utilitiesErrors, setUtilitiesErrors] = useState(() => Map());

  /**
   * Callback
   */
  const _validate = useCallback(() => {
    utilitiesSchema
      .validate(utilities.toJS(), {
        abortEarly: false
      })
      .then(() => {
        setUtilitiesErrors(prevState => {
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
        setUtilitiesErrors(prevState => {
          let nextState = prevState;
          nextState = nextState.clear();
          _.forEach(tempErrors, (tempValue, tempKey) => {
            nextState = nextState.set(tempKey, tempValue);
          });
          return nextState;
        });
      });
  }, [utilities]);

  const _handleSaveUtilities = useCallback(async () => {
    let jsData = _.pick(utilities.toJS(), [
      "id",
      "key",
      "name",
      "description",
      "status",
      "sort",
      "parentId"
    ]);
    let data = {
      id: _.get(jsData, "id"),
      key: utilities.get("key"),
      name: _.get(jsData, "name"),
      status: _.get(jsData, "status"),
      description: _.get(jsData, "description"),
      sort: _.get(jsData, "sort"),
      parentId: _.get(jsData, "parentId.key")
    };
    let method = "PUT";
    if (actionName === "add") {
      delete data.id;
      method = "POST";
    }
    setIsSaveUtilitiesFetching(true);
    let result = await ServiceBase.requestJson({
      method: method,
      url:
        actionName === "add"
          ? URI.ADD_UTILITIES
          : `${URI.EDIT_UTILITIES}/${_.get(data, "id")}`,
      data: data
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      if (actionName === "add") {
        Ui.showSuccess({ message: "Tạo tiện ích thành công." });
      } else {
        Ui.showSuccess({ message: "Lưu tiện ích thành công." });
      }
      onShowModal({ isShow: false, actionName: "", utilitiesId: "" });
    }
    setIsSaveUtilitiesFetching(false);
  }, [actionName, onShowModal, utilities]);
  //----------------------

  /**
   * Effect
   */
  useEffect(() => {
    if (utilitiesId) {
      _.delay(async () => {
        setReadUtilitiesFetching(true);
        let result = await ServiceBase.requestJson({
          url: `${URI.READ_UTILITIES}/${utilitiesId}`,
          method: "POST",
          data: {}
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          let temp = {
            id: _.get(result, "value.id"),
            key: _.get(result, "value.key"),
            name: _.get(result, "value.name"),
            description: _.get(result, "value.description"),
            sort: _.get(result, "value.sort"),
            status: _.get(result, "value.status"),
            parentId: _.get(result, "value.parentKey", undefined)
          };
          setUtilities(Map(temp));
        }
        setReadUtilitiesFetching(false);
        setCanValidate(true);
      }, 600);
    } else {
      setCanValidate(true);
    }
  }, [appConfig, utilitiesId]);
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
      <Spin spinning={readUtilitiesFetching} tip="...Đang lấy dữ liệu">
        <div className="content">
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <label>
                Key <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={10}>
              <Input
                className={classNames({
                  "border-invalid": utilitiesErrors.get("key")
                })}
                placeholder="Nhập giá trị Key"
                name="key"
                onChange={e => {
                  let value = e.target.value;
                  setUtilities(prevState => prevState.set("key", value));
                }}
                value={utilities.get("key")}
              />
            </Grid>
            <Grid item xs={2}>
              <label>
                Đơn vị QL <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={10}>
              <BranchCustomer
                className={classNames({
                  "border-invalid": utilitiesErrors.get("parentId")
                })}
                value={utilities.get("parentId")}
                onSelect={unit =>
                  setUtilities(prevState => prevState.set("parentId", unit))
                }
              />
            </Grid>

            <Grid item xs={2}>
              <label>
                Tên <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={10}>
              <Input
                className={classNames({
                  "border-invalid": utilitiesErrors.get("name")
                })}
                placeholder="Nhập tên tiện ích"
                name="name"
                onChange={e => {
                  let value = e.target.value;
                  setUtilities(prevState => prevState.set("name", value));
                }}
                value={utilities.get("name")}
              />
            </Grid>
            <Grid item xs={2}>
              <label>
                Mô tả <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={10}>
              <Input.TextArea
                rows={5}
                placeholder="Mô tả"
                name="name"
                value={utilities.get("description")}
                onChange={e => {
                  let value = e.target.value;
                  setUtilities(prevState =>
                    prevState.set("description", value)
                  );
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <label>
                Thứ tự <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={10}>
              <Input
                className={classNames({
                  "border-invalid": utilitiesErrors.get("sort")
                })}
                placeholder="Nhập thứ tự"
                name="sort"
                value={utilities.get("sort")}
                onChange={e => {
                  let value = e.target.value;
                  setUtilities(prevState => prevState.set("sort", value));
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <label>Kích hoạt</label>
            </Grid>
            <Grid item xs={4}>
              <Checkbox
                checked={utilities.get("status")}
                onChange={e =>
                  setUtilities(prevState =>
                    prevState.set("status", e.target.checked)
                  )
                }
              />
            </Grid>
          </Grid>
        </div>
      </Spin>
      <div className="action">
        <button
          disabled={utilitiesErrors.size}
          type="button"
          className={classNames({
            "btn btn-info btn-icon-sm": true,
            "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger": isSaveUtilitiesFetching
          })}
          onClick={_handleSaveUtilities}
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
)(UtilitiesInfo);
