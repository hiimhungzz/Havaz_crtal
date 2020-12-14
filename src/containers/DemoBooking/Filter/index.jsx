import React, { memo, useCallback } from "react";
import { Input, Select, DatePicker } from "antd";
import A from "@Components/A";
import PortletBody from "@Components/Portlet/PortletBody";
import { Grid } from "@material-ui/core";
import PortletHead from "@Components/Portlet/PortletHead";
import { checkMoment, momentRange } from "@Helpers/utility";
import _ from "lodash";
import Owner from "components/SelectContainer/Owner";
import ContractType from "components/SelectContainer/ContractType";
import { DATE_TIME_FORMAT } from "constants/common";

const Filter = memo(({ query, bookingStatus, setParam, onShowModal }) => {
  const _clearFilter = useCallback(
    (e) => {
      e.preventDefault();
      setParam((prevState) => {
        let nextState = prevState;
        nextState = nextState.setIn(["currentPage"], 0);
        nextState = nextState.setIn(["query", "code"], []);
        nextState = nextState.setIn(["query", "nameOrAddress"], null);
        nextState = nextState.setIn(["query", "isOwner"], []);
        nextState = nextState.setIn(["query", "status"], []);
        nextState = nextState.setIn(["query", "namePhoneEmail"], null);
        nextState = nextState.setIn(["query", "typeCustomer"], null);
        nextState = nextState.setIn(["query", "typeBooking"], undefined);
        nextState = nextState.setIn(["query", "contractType"], undefined);
        nextState = nextState.setIn(["query", "guideNamePhone"], null);
        nextState = nextState.setIn(["query", "TypeDate"], undefined);
        nextState = nextState.setIn(["query", "startDate"], null);
        nextState = nextState.setIn(["query", "EndDate"], null);
        nextState = nextState.setIn(["query", "ownerSearch"], null);
        return nextState;
      });
    },
    [setParam]
  );
  const _changeQuery = useCallback(
    (payload) => {
      setParam((prevState) => {
        let nextState = prevState;
        nextState = nextState.setIn(["query", payload.name], payload.value);
        return nextState;
      });
    },
    [setParam]
  );
  const _onAddBooking = useCallback(() => {
    onShowModal({
      actionName: "add",
      isShow: true,
      bookingId: null,
    });
  }, [onShowModal]);
  return (
    <>
      <PortletHead style={{ minHeight: 50 }}>
        <div className="kt-portlet__head-label">
          <ContractType
            value={query.get("contractType") || undefined}
            onSelect={(contractType) =>
              _changeQuery({
                name: "contractType",
                value: contractType,
              })
            }
          />
        </div>
        <div className="kt-portlet__head-toolbar">
          <div className="kt-portlet__head-wrapper">
            <A onClick={_clearFilter} className="btn btn-clean btn-icon-sm">
              Xóa bộ lọc
            </A>
            <button
              onClick={_onAddBooking}
              type="button"
              className="ml-1 btn btn-brand btn-icon-sm"
            >
              <i className="flaticon2-plus" />
              Thêm booking
            </button>
          </div>
        </div>
      </PortletHead>
      <PortletBody>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Input
              placeholder="Mã booking/Mã đoàn"
              value={_.get(query.get("code"), 0, "")}
              onChange={(e) =>
                _changeQuery({
                  name: "code",
                  value: [e.target.value],
                })
              }
            />
          </Grid>
          <Grid item xs={2}>
            <Select
              showSearch
              allowClear
              value={query.get("typeBooking") || undefined}
              onChange={(typeBooking) =>
                _changeQuery({ name: "typeBooking", value: typeBooking })
              }
              style={{ width: "100%" }}
              placeholder="Loại booking"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option value="inbound">Inbound</Select.Option>
              <Select.Option value="trực tiếp">Trực tiếp</Select.Option>
              <Select.Option value="nội địa">Nội địa</Select.Option>
              <Select.Option value="KH in HĐ">KH in HĐ</Select.Option>
            </Select>
          </Grid>
          <Grid item xs={2}>
            <Input
              value={query.get("guideNamePhone") || ""}
              onChange={(e) =>
                _changeQuery({
                  name: "guideNamePhone",
                  value: e.target.value,
                })
              }
              placeholder="Tên/SĐT HDV"
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              value={query.get("nameOrAddress") || ""}
              onChange={(e) =>
                _changeQuery({
                  name: "nameOrAddress",
                  value: e.target.value,
                })
              }
              placeholder="Mã/Tên/Địa chỉ DN"
            />
          </Grid>
          <Grid item xs={2}>
            <Select
              showArrow
              allowClear
              value={query.get("TypeDate") || undefined}
              style={{ width: "100%" }}
              onChange={(TypeDate) =>
                _changeQuery({ name: "TypeDate", value: TypeDate })
              }
              placeholder="Loại ngày"
            >
              {/*<Option value="">Chọn loại ngày</Option>*/}
              <Select.Option value="DATE_IN">Ngày IN</Select.Option>
              <Select.Option value="DATE_OUT">Ngày OUT</Select.Option>
              <Select.Option value="DATE_IN_OUT">Ngày diễn ra</Select.Option>
            </Select>
          </Grid>
          <Grid item xs={3}>
            <Owner
              multiple={true}
              value={query.get("isOwner")}
              onSelect={(owner) =>
                _changeQuery({ name: "isOwner", value: owner })
              }
            />
          </Grid>
          <Grid item xs={2}>
            <Select
              showArrow
              allowClear
              mode="multiple"
              value={query.get("status") ? query.get("status") : []}
              style={{ width: "100%" }}
              onChange={(status) =>
                _changeQuery({ name: "status", value: status })
              }
              placeholder="Trạng thái"
            >
              {bookingStatus.map((status, statusId) => {
                return (
                  <Select.Option key={statusId} value={status.get("id")}>
                    {status.get("name")}
                  </Select.Option>
                );
              })}
            </Select>
          </Grid>
          <Grid item xs={2}>
            <Input
              placeholder="Tên/SĐT người LH"
              value={query.get("namePhoneEmail") || ""}
              onChange={(e) =>
                _changeQuery({
                  name: "namePhoneEmail",
                  value: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={3}>
            <DatePicker.RangePicker
              format={DATE_TIME_FORMAT.DD_MM_YYYY}
              value={[
                checkMoment(query.get("startDate")),
                checkMoment(query.get("EndDate")),
              ]}
              onChange={(dates) => {
                if (dates.length > 0) {
                  _changeQuery({
                    name: "startDate",
                    value: dates[0].startOf("day"),
                  });
                  _changeQuery({
                    name: "EndDate",
                    value: dates[1].endOf("day"),
                  });
                } else {
                  _changeQuery({ name: "startDate", value: undefined });
                  _changeQuery({ name: "EndDate", value: undefined });
                }
              }}
              ranges={momentRange}
            />
          </Grid>
        </Grid>
      </PortletBody>
    </>
  );
});
export default Filter;
