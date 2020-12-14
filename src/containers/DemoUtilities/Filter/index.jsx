import React, { memo, useCallback } from "react";
import { Input } from "antd";
import { withStyles } from "@material-ui/core/styles";
import A from "@Components/A";
import PortletBody from "@Components/Portlet/PortletBody";
import { Grid } from "@material-ui/core";
import PortletHead from "@Components/Portlet/PortletHead";

const Filter = memo(({ name, setParam, onShowUtilitiesModal }) => {
  const _clearFilter = useCallback(
    e => {
      e.preventDefault();
      setParam(prevState => {
        let nextState = prevState;
        nextState = nextState.setIn(["pages"], 0);
        nextState = nextState.set("name", "");
        return nextState;
      });
    },
    [setParam]
  );
  const _changeQuery = useCallback(
    payload => {
      setParam(prevState => {
        let nextState = prevState;
        nextState = nextState.set("name", payload.value);
        return nextState;
      });
    },
    [setParam]
  );
  const _onAddUtilities = useCallback(() => {
    onShowUtilitiesModal({
      actionName: "add",
      isShow: true,
      configurationId: null
    });
  }, [onShowUtilitiesModal]);
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
              onClick={_onAddUtilities}
              type="button"
              className="ml-1 btn btn-brand btn-icon-sm"
            >
              <i className="flaticon2-plus" />
              Thêm tiện ích
            </button>
          </div>
        </div>
      </PortletHead>
      <PortletBody>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Input
              value={name}
              onChange={e =>
                _changeQuery({ name: "code", value: e.target.value })
              }
              placeholder="Tên tiện ích"
            />
          </Grid>
        </Grid>
      </PortletBody>
    </>
  );
});
export default withStyles({})(Filter);
