import React from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";

const Booking = ({
  onSelect,
  mode = "multiple",
  labelInValue = true,
  value
}) => {
  const [self, setState] = useState({
    data: [],
    fetching: false
  });
  const fetch = async ({ searchInput }) => {
    let data = [];
    setState({ ...self, fetching: true });
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: `/booking/list`,
      data: {
        searchInput: "",
        pageLimit: 10,
        currentPage: 0,
        orderBy: { createdAt: 1 },
        query: {
          code: [searchInput]
        }
      }
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      data = _.map(result.value.data, x => ({ key: x.uuid, label: x.code }));
    }
    setState({
      ...self,
      fetching: false,
      data: data
    });
  };
  let timer = null;
  return (
    <Select
      showArrow
      allowClear
      showSearch
      mode={mode}
      value={value}
      labelInValue={labelInValue}
      defaultActiveFirstOption={false}
      filterOption={false}
      placeholder="Mã booking"
      notFoundContent={
        self.fetching ? <Spin size="small" /> : "Không có dữ liệu"
      }
      onChange={onSelect}
      onFocus={() => {
        if (self.data.length === 0) {
          fetch({ searchInput: "" });
        }
      }}
      onSearch={input => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fetch({ searchInput: input });
        }, 500);
      }}
      style={{ width: "100%" }}
    >
      {self.data.map((booking, bookingId) => {
        return (
          <Select.Option value={booking.key} key={bookingId}>
            {booking.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(Booking);
