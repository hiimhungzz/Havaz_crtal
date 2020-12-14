import React, { memo, useCallback } from "react";
import { Input, Select } from "antd";
import { withStyles } from "@material-ui/core/styles";
import { STATUS } from "@Constants/common";
import { SelectSuggest } from "@Components/Utility/common";
import A from "@Components/A";
import PortletBody from "@Components/Portlet/PortletBody";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";
import PortletHead from "@Components/Portlet/PortletHead";

const Filter = memo(({ query, setParam, onShowRouteModal }) => {
  const _clearFilter = useCallback(
    e => {
      e.preventDefault();
      setParam(prevState => {
        let nextState = prevState;
        nextState = nextState.setIn(["currentPage"], 0);
        nextState = nextState.setIn(["query", "routesCode"], "");
        nextState = nextState.setIn(["query", "endPoint"], "");
        nextState = nextState.setIn(["query", "startPoint"], "");
        nextState = nextState.setIn(["query", "status"], fromJS([]));
        return nextState;
      });
    },
    [setParam]
  );
  const _changeQuery = useCallback(
    payload => {
      setParam(prevState => {
        let nextState = prevState;
        nextState = nextState.setIn(
          ["query", payload.name],
          fromJS(payload.value)
        );
        return nextState;
      });
    },
    [setParam]
  );
  const _onAddRoute = useCallback(() => {
    onShowRouteModal({
      actionName: "add",
      isShow: true,
      routeId: null
    });
  }, [onShowRouteModal]);
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
              onClick={_onAddRoute}
              type="button"
              className="ml-1 btn btn-brand btn-icon-sm"
            >
              <i className="flaticon2-plus" />
              Thêm tuyến
            </button>
          </div>
        </div>
      </PortletHead>
      <PortletBody>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <SelectSuggest
              value={query.get("routesCode")}
              type="value"
              onChange={e => _changeQuery({ name: "routesCode", value: e })}
              placeholder="Mã hoặc tên lộ trình"
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              value={query.get("startPoint")}
              onChange={e =>
                _changeQuery({ name: "startPoint", value: e.target.value })
              }
              placeholder="Điểm xuất phát"
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              value={query.get("endPoint")}
              onChange={e =>
                _changeQuery({ name: "endPoint", value: e.target.value })
              }
              placeholder="Điểm kết thúc"
            />
          </Grid>
          <Grid item xs={3}>
            <Select
              showArrow
              mode="multiple"
              value={query.get("status").toJS()}
              placeholder="Trạng thái"
              onChange={e => _changeQuery({ name: "status", value: e })}
              style={{ width: "100%" }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {STATUS.map((status, statusId) => {
                return (
                  <Select.Option key={statusId} value={status.value}>
                    {status.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Grid>
        </Grid>
      </PortletBody>
    </>
  );
});
export default withStyles({})(Filter);
