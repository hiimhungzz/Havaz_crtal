import React, { memo, useCallback, useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import PointSelect from "@Components/SelectContainer/PointSelect";
import PlacesLocation from "@Components/SelectContainer/PlacesLocation";
import CitySelect from "@Components/SelectContainer/City";
import DistrictSelect from "@Components/SelectContainer/District";
import { Modal, Button, Input, Select } from "antd";
import { Map } from "immutable";
import ServiceBase from "@Services/ServiceBase";
import _ from "lodash";
import { Ui } from "@Helpers/Ui";
import * as Yup from "yup";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { connect } from "react-redux";
import classNames from "classnames";
const pointSchema = Yup.object().shape({
  address: Yup.string().required("*Trường bắt buộc"),
  name: Yup.string().required("*Trường bắt buộc"),
  typeId: Yup.mixed().required("*Trường bắt buộc"),
  provinceId: Yup.string().required("*Trường bắt buộc"),
});
const mapStateToProps = createStructuredSelector({
  appConfig: makeSelectAppConfig(),
});

const withConnect = connect(mapStateToProps, null);
const AddPoint = withConnect(
  memo(({ appConfig, point, pointErrors, setPoint }) => {
    const _handleSelectPlace = useCallback(
      async (place) => {
        setPoint((prevState) =>
          prevState.set("address", place ? place.label : "")
        );
        if (place && place.key) {
          _.delay(async () => {
            let result = await ServiceBase.requestJson({
              baseUrl: "https://place.havaz.vn/api",
              method: "GET",
              url: `/v1/places/${place.key}`,
              data: {
                api_token:
                  "hmtvxAd5AQLAaUpjDGEqTZIj2DnR1dGBW7uugUG1gJyvsWVFzIh6n5It6RMk",
              },
            });
            if (result.hasErrors) {
              Ui.showErrors(result.errors);
            } else {
              let location = `${result.value.location.lat},${result.value.location.lng}`;
              setPoint((prevState) => prevState.set("location", location));
            }
          }, 100);
        }
      },
      [setPoint]
    );
    return (
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <label htmlFor="">
                Địa chỉ <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={9}>
              <PlacesLocation
                className={classNames({
                  "border-invalid": pointErrors.get("address"),
                })}
                value={{
                  key: point.get("address"),
                  label: point.get("address"),
                }}
                onSelect={_handleSelectPlace}
              />
            </Grid>
            <Grid item xs={3}>
              <label htmlFor="">
                Tên địa điểm <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={9}>
              <Input
                className={classNames({
                  "border-invalid": pointErrors.get("name"),
                })}
                type="text"
                placeholder="Nhập tên địa điểm"
                value={point.get("name")}
                onChange={(e) => {
                  let value = e.target.value;
                  setPoint((prevState) => prevState.set("name", value));
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <label htmlFor="">
                Loại <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={9}>
              <Select
                className={classNames({
                  "border-invalid": pointErrors.get("typeId"),
                })}
                style={{ width: "100%" }}
                value={point.get("typeId")}
                onChange={(typeId) =>
                  setPoint((prevState) => prevState.set("typeId", typeId))
                }
              >
                {(appConfig.typePlace || []).map((type, typeId) => {
                  return (
                    <Select.Option key={typeId} value={type.id}>
                      {type.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <label htmlFor="">
                Tỉnh/Thành phố <span className="kt-font-danger">*</span>
              </label>
            </Grid>
            <Grid item xs={7}>
              <CitySelect
                className={classNames({
                  "border-invalid": pointErrors.get("provinceId"),
                })}
                value={
                  point.get("provinceIds")
                    ? point.get("provinceIds")
                    : undefined
                }
                onSelect={(provinceIds) =>
                  setPoint((prevState) => {
                    let nextState = prevState;
                    nextState = nextState.set("provinceIds", provinceIds);
                    nextState = nextState.set(
                      "provinceId",
                      provinceIds ? provinceIds.key : ""
                    );
                    nextState = nextState.set("districtIds", undefined);
                    nextState = nextState.set("districtId", null);
                    return nextState;
                  })
                }
              />
            </Grid>
            {point.get("provinceIds") && point.get("provinceIds").key && (
              <>
                <Grid item xs={5}>
                  <label htmlFor="">Quận/Huyện</label>
                </Grid>
                <Grid item xs={7}>
                  <DistrictSelect
                    provinceIds={point.get("provinceIds")}
                    value={point.get("districtIds")}
                    onSelect={(districtIds) =>
                      setPoint((prevState) => {
                        let nextState = prevState;
                        nextState = nextState.set("districtIds", districtIds);
                        nextState = nextState.set(
                          "districtId",
                          districtIds ? districtIds.key : null
                        );
                        return nextState;
                      })
                    }
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  })
);

const Name = memo(
  withStyles({
    col: {},
  })(({ name, classes, errors, rowId, setRoute }) => {
    const [open, setOpen] = useState(false);
    const [point, setPoint] = useState(Map());
    const [pointErrors, setPointErrors] = useState(Map());
    const _handleAddPlace = useCallback(async () => {
      let data = {
        address: point.get("address"),
        name: point.get("name"),
        typeId: point.get("typeId"),
        provinceId: point.get("provinceId"),
        districtId: point.get("districtId"),
        location: point.get("location"),
      };
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: `/place`,
        data: data,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        setRoute((prevState) => {
          let nextState = prevState;
          console.log(
            "nextState.setIn",
            nextState.setIn(["point", rowId, "name"], data.name)
          );
          nextState = nextState.setIn(["point", rowId, "name"], data.name);
          nextState = nextState.setIn(
            ["point", rowId, "address"],
            data.address
          );
          nextState = nextState.setIn(
            ["point", rowId, "location"],
            data.location
          );
          return nextState;
        });
        Ui.showSuccess({ message: "Tạo địa điểm thành công." });
        _.delay(() => {
          setOpen(false);
        }, 300);
      }
    }, [point, rowId, setRoute]);
    const _handleChangePoint = useCallback(
      ({ uuid, name, location, address }) => {
        setRoute((prevState) => {
          let nextState = prevState;
          nextState = nextState.setIn(["point", rowId, "name"], name);
          nextState = nextState.setIn(["point", rowId, "address"], address);
          nextState = nextState.setIn(["point", rowId, "location"], location);
          return nextState;
        });
      },
      [rowId, setRoute]
    );
    useEffect(() => {
      pointSchema
        .validate(point.toJS(), {
          abortEarly: false,
        })
        .then(() => {
          setPointErrors((prevState) => {
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
          setPointErrors((prevState) => {
            let nextState = prevState;
            nextState = nextState.clear();
            _.forEach(tempErrors, (tempValue, tempKey) => {
              nextState = nextState.set(tempKey, tempValue);
            });
            return nextState;
          });
        });
      return () => {};
    }, [point]);
    return (
      <td
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        <PointSelect
          className={classNames({
            "border-invalid": errors,
          })}
          value={name}
          onSelect={_handleChangePoint}
          setOpen={setOpen}
        />
        <Modal
          width={800}
          title="LỰA CHỌN ĐỊA ĐIỂM"
          closable
          onCancel={(e) => setOpen(false)}
          visible={open}
          footer={[
            <Button key="back" onClick={(e) => setOpen(false)}>
              Hủy
            </Button>,
            <Button
              disabled={pointErrors.size > 0}
              key="submit"
              type="danger"
              loading={false}
              onClick={_handleAddPlace}
            >
              Xác nhận
            </Button>,
          ]}
        >
          <AddPoint
            point={point}
            pointErrors={pointErrors}
            setPoint={setPoint}
          />
        </Modal>
      </td>
    );
  })
);
export default Name;
