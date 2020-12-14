import React, { memo } from "react";
import { Drawer, Select } from "antd";
import { Grid, Divider } from "@material-ui/core";
import _ from "lodash";
import { fromJS } from "immutable";
import Booking from "@Components/SelectContainer/Booking";
import ContractType from "components/SelectContainer/ContractType";

const FilterModal = ({
  isShowFilter,
  onSetIsShowFilter,
  vehicleTypes,
  param,
  onSetParam,
}) => {
  const onClose = (e) => {
    if (e) {
      e.preventDefault();
    }
    onSetIsShowFilter(false);
  };
  const _handleChangeBookingCodes = (bookingCodes) => {
    onSetParam((prevState) => {
      let nextState = prevState;
      nextState = nextState.set("bookingCode", fromJS(bookingCodes));
      return nextState;
    });
  };
  const _handleChangeVehicles = (vehicles) => {
    onSetParam((prevState) => {
      let nextState = prevState;
      nextState = nextState.set("vehicleTypes", fromJS(vehicles));
      return nextState;
    });
  };
  const _handleChangeContractType = (contractType) => {
    onSetParam((prevState) => {
      let nextState = prevState;
      nextState = nextState.set("contractType", fromJS(contractType));
      return nextState;
    });
  };
  return (
    <Drawer
      width="25%"
      placement="left"
      closable={false}
      visible={isShowFilter}
      onClose={onClose}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          MÃ BOOKING
          <Booking
            value={param.get("bookingCode").toJS()}
            mode="multiple"
            onSelect={_handleChangeBookingCodes}
          />
        </Grid>
        <Grid item xs={12}>
          LOẠI XE
          <Select
            allowClear
            mode="multiple"
            style={{ width: "100%" }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            placeholder="Chọn loại xe"
            onChange={_handleChangeVehicles}
            value={param.get("vehicleTypes").toJS()}
          >
            {_.map(vehicleTypes, (ve) => (
              <Select.Option key={ve.key} value={ve.key}>
                {ve.label}
              </Select.Option>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          LOẠI HỢP ĐỒNG
          <ContractType
            value={param.get("contractType") || undefined}
            onSelect={_handleChangeContractType}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider light />
        </Grid>
      </Grid>
    </Drawer>
  );
};
export default memo(FilterModal);
