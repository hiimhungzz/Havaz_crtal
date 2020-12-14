import React, { memo, useCallback } from "react";
import { NoTypeCustomerSelect, OwnerSelect } from "@Components/Utility/common";
import I from "@Components/I";
import { Rate, Input, InputNumber, Checkbox, Tag } from "antd";
import classNames from "classnames";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { isEmpty } from "@Helpers/utility";
import { Grid } from "@material-ui/core";
import { API_URI } from "@Constants";
import { fromJS } from "immutable";
import { Ui } from "@Helpers/Ui";
import A from "components/A";
import NoTypeBranchCustomer from "components/SelectContainer/NoTypeBranchCustomer";
import Owner from "components/SelectContainer/Owner";
const CheckboxGroup = Checkbox.Group;

const Top = ({
  errors,
  setTopData,
  values,
  initialDataSource,
  setBottomInitialDataSource
}) => {
  const handleChange = useCallback(
    e => {
      e.preventDefault();
      let fieldName = e.target.name;
      let fieldValue = e.target.value;
      setTopData(prevState => {
        let nextState = prevState;
        nextState = nextState.setIn(["dataSource", `${fieldName}`], fieldValue);
        return nextState;
      });
    },
    [setTopData]
  );
  const onSetFieldValue = useCallback(
    ({ fieldName, fieldValue }) => {
      setTopData(prevState => {
        let nextState = prevState;
        nextState = nextState.setIn(["dataSource", `${fieldName}`], fieldValue);
        return nextState;
      });
    },
    [setTopData]
  );
  const onSetFieldsValue = useCallback(
    payload => {
      setTopData(prevState => {
        let nextState = prevState;
        _.forEach(payload, pay => {
          nextState = nextState.setIn(
            ["dataSource", `${pay.fieldName}`],
            pay.fieldValue
          );
          if (pay.fieldName === "organizationId") {
            let needToCall = [];
            _.forEach(
              initialDataSource.get("initial").toJS(),
              (init, initId) => {
                _.forEach(init.requireVehicleTypes, (rq, rqId) => {
                  if (init.fixedRoutesId && rq.requireVehicleTypeId) {
                    let data = {
                      rowInfo: {
                        itemIndex: rqId,
                        rowIndex: initId
                      },
                      fixedRoutesId: init.fixedRoutesId,
                      customerId: pay.fieldValue,
                      filterDatetime: init.tripDate,
                      vehicleTypeId: rq.requireVehicleTypeId
                    };
                    needToCall.push(data);
                  }
                });
              }
            );
            Promise.all(
              _.map(needToCall, need => {
                return ServiceBase.requestJson({
                  url: API_URI.READ_ROUTE_BOOKING,
                  method: "POST",
                  data: need
                });
              })
            )
              .then(data => {
                if (data.length > 0) {
                  setBottomInitialDataSource(prevState => {
                    let nextState = prevState;
                    _.forEach(data, dt => {
                      let vehicle = dt.value.data;
                      let mergeObj = {
                        distance: vehicle.distance || undefined,
                        costPerKm: vehicle.costPerKm || 0,
                        perDay: vehicle.perDay || 0,
                        overNightCost: vehicle.overNightCost || 0,
                        highway: vehicle.highway || 0,
                        hasHighway: vehicle.hasHighway || false,
                        hasOverNightCost: vehicle.hasOverNightCost || false
                      };
                      nextState = nextState.update("initial", x => {
                        x = x.setIn(
                          [
                            vehicle.rowInfo.rowIndex,
                            "requireVehicleTypes",
                            vehicle.rowInfo.itemIndex
                          ],
                          fromJS({
                            ...x
                              .getIn([
                                vehicle.rowInfo.rowIndex,
                                "requireVehicleTypes",
                                vehicle.rowInfo.itemIndex
                              ])
                              .toJS(),
                            ...mergeObj
                          })
                        );
                        return x;
                      });
                    });
                    return nextState;
                  });
                }
              })
              .catch(err => {
                Ui.showErrors(err.message);
              });
          }
        });
        return nextState;
      });
    },
    [initialDataSource, setBottomInitialDataSource, setTopData]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={5}>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <label className="small-label">
              Phụ trách <span className="mark-required-color">*</span>
            </label>
          </Grid>
          <Grid item xs={7}>
            <Owner
              multiple={false}
              className={classNames({
                "p-0": true,
                "border-invalid": errors.get("ownerId")
              })}
              value={
                values.get("ownerId")
                  ? {
                      key: values.get("ownerId"),
                      label: values.get("ownerName")
                    }
                  : undefined
              }
              onSelect={owner => {
                onSetFieldsValue([
                  {
                    fieldName: "ownerId",
                    fieldValue: _.get(owner, "key")
                  },
                  {
                    fieldName: "ownerName",
                    fieldValue: _.get(owner, "label")
                  },
                  {
                    fieldName: "ownerCode",
                    fieldValue: _.get(owner, "usersCode", "")
                  }
                ]);
              }}
            />
          </Grid>
          <Grid item xs={1}>
            <label>Mã</label>
          </Grid>
          <Grid item xs={2}>
            <Input disabled value={values.get("ownerCode")} />
          </Grid>
        </Grid>
      </Grid>
      {values.get("source") && (
        <Grid item xs={7}>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <label>Nguồn tạo:</label>
            </Grid>
            <Grid item xs={3}>
              <A
                target="_blank"
                href={values.get("sourceUrl")}
                title={`Đến ${values.get("sourceUrl")}`}
              >
                {values.get("source")}
              </A>
            </Grid>
          </Grid>
        </Grid>
      )}

      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h4>
                  <I className="fa fa-user-lock" />
                  THÔNG TIN KHÁCH HÀNG
                </h4>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <label>
                      Tên <span className="mark-required-color">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={7}>
                    <NoTypeBranchCustomer
                      className={classNames({
                        "p-0": true,
                        "border-invalid": errors.get("organizationId")
                      })}
                      value={
                        values.get("organizationId")
                          ? {
                              key: values.get("organizationId"),
                              label: values.get("enterprise")
                            }
                          : undefined
                      }
                      onSelect={selectOrg => {
                        onSetFieldsValue([
                          {
                            fieldName: "organizationId",
                            fieldValue: selectOrg.key
                          },
                          {
                            fieldName: "enterprise",
                            fieldValue: selectOrg.label
                          },
                          {
                            fieldName: "enterpriseCode",
                            fieldValue: selectOrg.organizationCode || ""
                          },
                          {
                            fieldName: "MOU",
                            fieldValue: selectOrg.MOU || false
                          },
                          {
                            fieldName: "contactAddress",
                            fieldValue: selectOrg.contactAddress || ""
                          },
                          {
                            fieldName: "contactPhone",
                            fieldValue: selectOrg.contactPhone || ""
                          },
                          {
                            fieldName: "contactFax",
                            fieldValue: selectOrg.contactFax || ""
                          },
                          {
                            fieldName: "contactEmail",
                            fieldValue: selectOrg.contactEmail || ""
                          }
                        ]);
                      }}
                      mode="single"
                    />
                    {values.get("MOU !== true") &&
                    values.get("organizationId") ? (
                      <span className="form-text text-muted">
                        KH này chưa ký Hợp đồng nguyên tắc(Biên bản ghi nhớ -
                        MOU)
                      </span>
                    ) : null}
                  </Grid>
                  <Grid item xs={1}>
                    <label>Mã</label>
                  </Grid>
                  <Grid item xs={2}>
                    <Input disabled value={values.get("enterpriseCode")} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <label>Địa chỉ</label>
                  </Grid>
                  <Grid item xs={10}>
                    <Input
                      name="contactAddress"
                      onChange={handleChange}
                      value={values.get("contactAddress")}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <label>Loại KH</label>
                  </Grid>
                  <Grid item xs={7}>
                    <CheckboxGroup
                      value={values.get("typeContact")}
                      name="typeContact"
                      options={[
                        {
                          label: "Inbound",
                          value: "inbound"
                        },
                        {
                          label: "Trực tiếp",
                          value: "trực tiếp"
                        },
                        {
                          label: "Nội địa",
                          value: "nội địa"
                        }
                      ]}
                      onChange={checkedValues => {
                        let newValue = checkedValues.splice(-1).pop();
                        onSetFieldValue({
                          fieldName: "typeContact",
                          fieldValue: newValue
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CheckboxGroup
                      value={[values.get("typeContactHD")]}
                      options={[
                        {
                          label: "KH in HĐ",
                          value: "KH in HĐ"
                        }
                      ]}
                      onChange={checkedValues => {
                        onSetFieldValue({
                          fieldName: "typeContactHD",
                          fieldValue: checkedValues.slice(-1).pop()
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <label>
                      Liên hệ<span className="ml-2 mark-required-color">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={10}>
                    <Input
                      className={classNames({
                        "border-invalid": errors.get("contactName")
                      })}
                      name="contactName"
                      onChange={handleChange}
                      value={values.get("contactName")}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <label>Email</label>
                  </Grid>
                  <Grid item xs={10}>
                    <Input
                      name="contactEmail"
                      onChange={handleChange}
                      value={values.get("contactEmail")}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <label>
                      SĐT <span className="mark-required-color">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={10}>
                    <Input
                      className={classNames({
                        "border-invalid": errors.get("contactPhone")
                      })}
                      name="contactPhone"
                      onChange={handleChange}
                      value={values.get("contactPhone")}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <label>Fax</label>
                  </Grid>
                  <Grid item xs={10}>
                    <Input
                      name="contactFax"
                      onChange={handleChange}
                      value={values.get("contactFax")}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={7}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h4>
                  <I className="fa fa-user" />
                  THÔNG TIN ĐOÀN
                </h4>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <label>Loại KH</label>
                  </Grid>
                  <Grid item xs={10}>
                    <CheckboxGroup
                      value={values.get("vehicleThingInformation")}
                      name="vehicleThingInformation"
                      options={[
                        {
                          label: "Lo ăn ngủ cho lái xe",
                          value: "Lo ăn ngủ cho lái xe"
                        },
                        {
                          label: "Đặt xe CTV",
                          value: "Đặt xe CTV"
                        }
                      ]}
                      onChange={checkedValues => {
                        let newValue = checkedValues.splice(-1).pop();
                        onSetFieldValue({
                          fieldName: "vehicleThingInformation",
                          fieldValue: newValue
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <label>
                      Code booking
                      <span className="mark-required-color">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={5}>
                    <Input
                      name="code"
                      onChange={handleChange}
                      placeholder="Code booking"
                      className={classNames({
                        "border-invalid": errors.get("code")
                      })}
                      value={values.get("code")}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <label>
                      Số khách <span className="mark-required-color">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={3}>
                    <InputNumber
                      min={0}
                      value={values.get("guestNumber")}
                      className={classNames({
                        "border-invalid": errors.get("guestNumber")
                      })}
                      onChange={e => {
                        let guestNumber = e;
                        onSetFieldValue({
                          fieldName: "guestNumber",
                          fieldValue: guestNumber
                        });
                      }}
                      name="guestNumber"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <label className="small-label">
                      Tên KH/Quốc gia
                      <span className="mark-required-color">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={5}>
                    <Input
                      name="nameCountry"
                      placeholder="Tên KH/Quốc gia"
                      onChange={handleChange}
                      className={classNames({
                        "border-invalid": errors.get("nameCountry")
                      })}
                      value={values.get("nameCountry")}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <label>Xếp hạng</label>
                  </Grid>
                  <Grid item xs={3}>
                    <Rate
                      value={values.get("rating")}
                      onChange={e => {
                        onSetFieldValue({
                          fieldName: "rating",
                          fieldValue: e
                        });
                      }}
                      name="rating"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <label>Loại phục vụ</label>
                  </Grid>
                  <Grid item xs={10}>
                    <CheckboxGroup
                      value={values.get("typeOfService")}
                      name="typeOfService"
                      options={[
                        {
                          label: "BLĐ Cty du lịch",
                          value: "BLĐ Cty du lịch"
                        },
                        {
                          label: "Chủ hãng/Khảo sát",
                          value: "Chủ hãng/Khảo sát"
                        },
                        {
                          label: "Khách VIP",
                          value: "Khách VIP"
                        }
                      ]}
                      onChange={checkedValues => {
                        let newValue = checkedValues.splice(-1).pop();
                        onSetFieldValue({
                          fieldName: "typeOfService",
                          fieldValue: newValue
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <label>Tên HDV</label>
                  </Grid>
                  <Grid item xs={5}>
                    <Input
                      placeholder="Tên HDV"
                      name="guideName"
                      onChange={handleChange}
                      value={values.get("guideName")}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <label>SĐT</label>
                  </Grid>
                  <Grid item xs={3}>
                    <Input
                      value={values.get("guidePhone")}
                      onChange={handleChange}
                      className={classNames({
                        "border-invalid": errors.get("guidePhone")
                      })}
                      placeholder="SĐT"
                      name="guidePhone"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <label>Yêu cầu đặc biệt</label>
                  </Grid>
                  <Grid item xs={10}>
                    <Input.TextArea
                      rows={5}
                      name="note"
                      onChange={handleChange}
                      value={values.get("note")}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h4>
                  <I className="fa fa-credit-card" />
                  THÔNG TIN THANH TOÁN
                </h4>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <label>Thanh toán trước</label>
                  </Grid>
                  <Grid item xs={3}>
                    <InputNumber
                      value={values.get("prepayment")}
                      name="prepayment"
                      onChange={e => {
                        onSetFieldValue({
                          fieldName: "prepayment",
                          fieldValue: e
                        });
                      }}
                      formatter={value =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={value => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <label>Khuyến mãi</label>
                  </Grid>
                  <Grid item xs={3}>
                    <InputNumber
                      value={values.get("promotion")}
                      name="promotion"
                      onChange={e => {
                        onSetFieldValue({
                          fieldName: "promotion",
                          fieldValue: e
                        });
                      }}
                      formatter={value =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={value => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={7}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h4>
                  <I className="fa fa-credit-card" />
                  THÔNG TIN TOUR
                </h4>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <label>Tên tour</label>
                  </Grid>
                  <Grid item xs={4}>
                    <Input
                      value={values.get("tourName")}
                      name="tourName"
                      onChange={e => {
                        onSetFieldValue({
                          fieldName: "tourName",
                          fieldValue: e.target.value
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <label>Số ngày</label>
                  </Grid>
                  <Grid item xs={4}>
                    <InputNumber
                      value={values.get("tourDays")}
                      name="tourDays"
                      onChange={e => {
                        onSetFieldValue({
                          fieldName: "tourDays",
                          fieldValue: e
                        });
                      }}
                      formatter={value =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={value => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default memo(Top);
