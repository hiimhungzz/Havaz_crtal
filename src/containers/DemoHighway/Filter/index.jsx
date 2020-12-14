import React, { memo, useCallback } from "react";
import { Input } from "antd";
import { withStyles } from "@material-ui/core/styles";
import A from "@Components/A";
import PortletBody from "@Components/Portlet/PortletBody";
import { Grid } from "@material-ui/core";
import PortletHead from "@Components/Portlet/PortletHead";

const Filter = memo(({ query, setParam, onShowHighwayModal }) => {
  const _clearFilter = useCallback(
    e => {
      e.preventDefault();
      setParam(prevState => {
        let nextState = prevState;
        nextState = nextState.setIn(["currentPage"], 0);
        nextState = nextState.setIn(["query", "code"], "");
        nextState = nextState.set("searchInput", "");
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
        nextState = nextState.set("searchInput", payload.value);
        return nextState;
      });
    },
    [setParam]
  );
  const _onAddHighway = useCallback(() => {
    onShowHighwayModal({
      actionName: "add",
      isShow: true,
      routeId: null
    });
  }, [onShowHighwayModal]);
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
              onClick={_onAddHighway}
              type="button"
              className="ml-1 btn btn-brand btn-icon-sm"
            >
              <i className="flaticon2-plus" />
              Thêm cao tốc
            </button>
          </div>
        </div>
      </PortletHead>
      <PortletBody>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Input
              value={query.get("code")}
              onChange={e =>
                _changeQuery({ name: "code", value: e.target.value })
              }
              placeholder="Mã/Tên cao tốc"
            />
          </Grid>
        </Grid>
      </PortletBody>
    </>
  );
});
export default withStyles({})(Filter);
