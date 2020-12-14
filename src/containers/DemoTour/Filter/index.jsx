import React, { memo, useCallback } from "react";
import { Input, Select } from "antd";
import { withStyles } from "@material-ui/core/styles";
import A from "@Components/A";
import PortletBody from "@Components/Portlet/PortletBody";
import { Grid } from "@material-ui/core";
import PortletHead from "@Components/Portlet/PortletHead";

const Filter = memo(({ query, setParam, onShowTourModal }) => {
  const _clearFilter = useCallback(
    e => {
      e.preventDefault();
      setParam(prevState => {
        let nextState = prevState;
        nextState = nextState.setIn(["currentPage"], 0);
        nextState = nextState.setIn(["query", "nameCode"], "");
        nextState = nextState.setIn(["query", "pointName"], "");
        nextState = nextState.setIn(
          ["query", "numberOfDaysAndNights"],
          undefined
        );
        nextState = nextState.setIn(["query", "rating"], undefined);
        nextState = nextState.setIn(["query", "status"], undefined);
        return nextState;
      });
    },
    [setParam]
  );
  const _changeQuery = useCallback(
    payload => {
      setParam(prevState => {
        let nextState = prevState;
        nextState = nextState.setIn(["query", payload.name], payload.value);
        return nextState;
      });
    },
    [setParam]
  );
  const _onAddTour = useCallback(() => {
    onShowTourModal({
      actionName: "add",
      isShow: true,
      tourId: null
    });
  }, [onShowTourModal]);
  return (
    <>
      <PortletHead>
        <div className="kt-portlet__head-label"></div>
        <div className="kt-portlet__head-toolbar">
          <div className="kt-portlet__head-wrapper">
            <A onClick={_clearFilter} className="btn btn-clean btn-icon-sm">
              Xóa bộ lọc
            </A>
            <button
              onClick={_onAddTour}
              type="button"
              className="ml-1 btn btn-brand btn-icon-sm"
            >
              <i className="flaticon2-plus" />
              Thêm mới tour
            </button>
          </div>
        </div>
      </PortletHead>
      <PortletBody>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Input
              value={query.get("nameCode")}
              onChange={e =>
                _changeQuery({ name: "nameCode", value: e.target.value })
              }
              placeholder="Mã/Tên tour"
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              value={query.get("pointName")}
              onChange={e =>
                _changeQuery({
                  name: "pointName",
                  value: e.target.value
                })
              }
              placeholder="Tên điểm đi trong tour"
            />
          </Grid>
          <Grid item xs={2}>
            <Select
              placeholder="Số ngày đêm"
              style={{ width: "100%" }}
              value={query.get("numberOfDaysAndNights") || undefined}
              onSelect={e =>
                _changeQuery({
                  name: "numberOfDaysAndNights",
                  value: e
                })
              }
              name="numberOfDaysAndNights"
            >
              <Select.Option value="01">01</Select.Option>
              <Select.Option value="02">02</Select.Option>
              <Select.Option value="03">03</Select.Option>
              <Select.Option value="04">04</Select.Option>
              <Select.Option value="05">05</Select.Option>
              <Select.Option value="06">06</Select.Option>
              <Select.Option value="07">07</Select.Option>
              <Select.Option value="08">08</Select.Option>
              <Select.Option value="09">09</Select.Option>
              <Select.Option value="10">10</Select.Option>
              <Select.Option value="11">11</Select.Option>
              <Select.Option value="12">12</Select.Option>
            </Select>
          </Grid>
          <Grid item xs={2}>
            <Select
              placeholder="Xếp hạng"
              name="rating"
              style={{ width: "100%" }}
              value={query.get("rating") || undefined}
              onSelect={e =>
                _changeQuery({
                  name: "rating",
                  value: e
                })
              }
            >
              <Select.Option value={1}>01</Select.Option>
              <Select.Option value={2}>02</Select.Option>
              <Select.Option value={3}>03</Select.Option>
              <Select.Option value={4}>04</Select.Option>
              <Select.Option value={5}>05</Select.Option>
            </Select>
          </Grid>
          <Grid item xs={2}>
            <Select
              placeholder="Trạng thái"
              name="status"
              style={{ width: "100%" }}
              value={query.get("status") || undefined}
              onSelect={e =>
                _changeQuery({
                  name: "status",
                  value: e
                })
              }
            >
              <Select.Option value={1}>Đang hoạt động</Select.Option>
              <Select.Option value={2}>Không hoạt động</Select.Option>
            </Select>
          </Grid>
        </Grid>
      </PortletBody>
    </>
  );
});
export default withStyles({})(Filter);
