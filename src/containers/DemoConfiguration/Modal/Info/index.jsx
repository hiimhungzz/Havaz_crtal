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
import Configuration from "components/SelectContainer/Configuration";
import Globals from "globals.js";
import BranchCustomer from "components/SelectContainer/BranchCustomer";
const configurationSchema = Yup.object().shape({
  parentId: Yup.object()
    .required("*Trường bắt buộc")
    .shape({
      key: Yup.string().required("*Trường bắt buộc")
    }),
  name: Yup.string().required("*Trường bắt buộc"),
  value: Yup.string().required("*Trường bắt buộc")
});

const ConfigurationInfo = ({
  configurationId,
  appConfig,
  onShowModal,
  actionName,
  classes
}) => {
  const [
    isSaveConfigurationFetching,
    setIsSaveConfigurationFetching
  ] = useState(false);
  const [readConfigurationFetching, setReadConfigurationFetching] = useState(
    false
  );
  const [canValidate, setCanValidate] = useState(false);
  const [configuration, setConfiguration] = useState(() => {
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
      description: "",
      value: null,
      isActived: false,
      isRequired: false
    });
  });
  const [configurationErrors, setConfigurationErrors] = useState(() => Map());

  /**
   * Callback
   */
  const _validate = useCallback(() => {
    configurationSchema
      .validate(configuration.toJS(), {
        abortEarly: false
      })
      .then(() => {
        setConfigurationErrors(prevState => {
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
        setConfigurationErrors(prevState => {
          let nextState = prevState;
          nextState = nextState.clear();
          _.forEach(tempErrors, (tempValue, tempKey) => {
            nextState = nextState.set(tempKey, tempValue);
          });
          return nextState;
        });
      });
  }, [configuration]);

  const _handleSaveConfiguration = useCallback(async () => {
    let jsData = _.pick(configuration.toJS(), [
      "id",
      "name",
      "value",
      "isActived",
      "isRequired",
      "parentId"
    ]);
    let data = {
      id: _.get(jsData, "id"),
      key: _.get(jsData, "name.key"),
      value: _.get(jsData, "value"),
      isActived: _.get(jsData, "isActived"),
      isRequired: _.get(jsData, "isRequired"),
      parentId: _.get(jsData, "parentId.key")
    };
    let method = "PUT";
    if (actionName === "add") {
      delete data.id;
      method = "POST";
    }
    setIsSaveConfigurationFetching(true);
    let result = await ServiceBase.requestJson({
      method: method,
      url:
        actionName === "add"
          ? URI.ADD_CONFIGURATION
          : `${URI.EDIT_CONFIGURATION}/${_.get(data, "id")}`,
      data: data
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      if (actionName === "add") {
        Ui.showSuccess({ message: "Tạo cấu hình thành công." });
      } else {
        Ui.showSuccess({ message: "Lưu cấu hình thành công." });
      }
      onShowModal({ isShow: false, actionName: "", configurationId: "" });
    }
    setIsSaveConfigurationFetching(false);
  }, [actionName, onShowModal, configuration]);
  const _handleSelectConfiguration = useCallback(
    conf => {
      setConfiguration(prevState => {
        let nextState = prevState;
        nextState = nextState.set("name", conf);
        nextState = nextState.set("description", _.get(conf, "description"));
        return nextState;
      });
    },
    [setConfiguration]
  );
  //----------------------

  /**
   * Effect
   */
  useEffect(() => {
    if (configurationId) {
      _.delay(async () => {
        setReadConfigurationFetching(true);
        let result = await ServiceBase.requestJson({
          url: `${URI.READ_CONFIGURATION}/${configurationId}`,
          method: "POST",
          data: {}
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          let temp = {
            name: {
              key: _.get(result, "value.key"),
              label: _.get(result, "value.name")
            },
            id: _.get(result, "value.id"),
            description: _.get(result, "value.description"),
            value: _.get(result, "value.value"),
            isActived: _.get(result, "value.isActived"),
            isRequired: _.get(result, "value.isRequired"),
            parentId: _.get(result, "value.parentKey", undefined)
          };
          setConfiguration(Map(temp));
        }
        setReadConfigurationFetching(false);
        setCanValidate(true);
      }, 600);
    } else {
      setCanValidate(true);
    }
  }, [appConfig, configurationId]);
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
      <Spin spinning={readConfigurationFetching} tip="...Đang lấy dữ liệu">
        <div className="content">
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <label>
                Đơn vị QL <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={10}>
              <BranchCustomer
                className={classNames({
                  "border-invalid": configurationErrors.get("parentId")
                })}
                value={configuration.get("parentId")}
                onSelect={unit =>
                  setConfiguration(prevState => prevState.set("parentId", unit))
                }
              />
            </Grid>
            <Grid item xs={2}>
              <label>
                Đối tượng <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={10}>
              <Configuration
                className={classNames({
                  "border-invalid": configurationErrors.get("name")
                })}
                value={configuration.get("name")}
                onSelect={_handleSelectConfiguration}
              />
            </Grid>
            <Grid item xs={2}>
              <label>
                Mô tả <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={10}>
              <Input.TextArea
                disabled
                rows={5}
                placeholder="Mô tả"
                name="name"
                value={configuration.get("description")}
              />
            </Grid>
            <Grid item xs={2}>
              <label>
                Giá trị <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={10}>
              <Input
                className={classNames({
                  "border-invalid": configurationErrors.get("value")
                })}
                placeholder="Nhập giá trị"
                name="value"
                value={configuration.get("value")}
                onChange={e => {
                  let value = e.target.value;
                  setConfiguration(prevState => prevState.set("value", value));
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <label>Kích hoạt</label>
            </Grid>
            <Grid item xs={4}>
              <Checkbox
                checked={configuration.get("isActived")}
                onChange={e =>
                  setConfiguration(prevState =>
                    prevState.set("isActived", e.target.checked)
                  )
                }
              />
            </Grid>
            <Grid item xs={2}>
              <label>Bắt buộc</label>
            </Grid>
            <Grid item xs={4}>
              <Checkbox
                checked={configuration.get("isRequired")}
                onChange={e =>
                  setConfiguration(prevState =>
                    prevState.set("isRequired", e.target.checked)
                  )
                }
              />
            </Grid>
          </Grid>
        </div>
      </Spin>
      <div className="action">
        <button
          disabled={configurationErrors.size}
          type="button"
          className={classNames({
            "btn btn-info btn-icon-sm": true,
            "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger": isSaveConfigurationFetching
          })}
          onClick={_handleSaveConfiguration}
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
)(ConfigurationInfo);
