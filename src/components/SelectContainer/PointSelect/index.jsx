import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { Select, Spin, Divider, Icon } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
let timer = null;

const PointSelect = ({
  onSelect,
  onAddPlace,
  mode = "single",
  labelInValue = true,
  value,
  className,
  setOpen
}) => {
  const [self, setState] = useState({
    data: [],
    fetching: false
  });
  const fetch = useCallback(
    async ({ searchInput }) => {
      let data = [];
      setState({ ...self, fetching: true });
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: `/routes/places/list`,
        data: {
          searchInput: searchInput,
          pageLimit: 100,
          currentPage: 0,
          orderBy: { name: 1 },
          query: {}
        }
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        data = _.map(result.value.data, opt => ({
          key: opt.uuid,
          label: (
            <>
              <b>{opt.name}</b>
              <br />
              <em>{opt.address}</em>
            </>
          ),
          city: opt.city,
          address: opt.address || "",
          name: opt.name || "",
          location: `${opt.location.x},${opt.location.y}`
        }));
      }
      setState({
        ...self,
        fetching: false,
        data: data
      });
    },
    [self]
  );
  const _handleSetOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);
  return (
    <Select
      showArrow
      allowClear
      showSearch
      mode={mode}
      className={className}
      value={value ? { key: "", label: value } : undefined}
      labelInValue={labelInValue}
      defaultActiveFirstOption={false}
      filterOption={false}
      placeholder="Nhập tên địa điểm"
      notFoundContent={
        self.fetching ? <Spin size="small" /> : "Không có dữ liệu"
      }
      onFocus={() => {
        fetch({ searchInput: "" });
      }}
      onChange={point => {
        let finded = self.data.find(x => x.key === (point ? point.key : ""));
        if (finded) {
          onSelect({
            uuid: finded.key,
            name: finded.name,
            location: finded.location,
            address: finded.address
          });
        } else {
          onSelect({
            uuid: null,
            name: undefined,
            location: null,
            address: null
          });
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
      <Select.Option className="p-0" value="null" onClick={onAddPlace}>
        <div>
          <button
            // disabled={isDisabled}
            onClick={_handleSetOpen}
            style={{ width: "100%" }}
            title="Thêm địa điểm"
            className="btn btn-secondary"
          >
            <i className="flaticon2-plus" />
            Thêm địa điểm
          </button>
        </div>
      </Select.Option>
      {self.data.map((highway, highwayId) => {
        return (
          <Select.Option value={highway.key} key={highwayId}>
            {highway.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(PointSelect);
