import React, { memo, useCallback } from "react";
import { Input, Select } from "antd";
import { withStyles } from "@material-ui/core/styles";
import A from "@Components/A";
import PortletBody from "@Components/Portlet/PortletBody";
import { Grid } from "@material-ui/core";
import PortletHead from "@Components/Portlet/PortletHead";

const Filter = memo(({ query, setParam, onShowCorporateModal }) => {
  const _clearFilter = useCallback(
    e => {
      e.preventDefault();
      setParam(prevState => {
        let nextState = prevState;
        nextState = nextState.setIn(["currentPage"], 0);
        nextState = nextState.setIn(["query", "codeAndName"], "");
        nextState = nextState.setIn(["query", "phoneAndAddress"], "");
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
  const _onAddCorporate = useCallback(() => {
    onShowCorporateModal({
      actionName: "add",
      isShow: true,
      corporateId: null
    });
  }, [onShowCorporateModal]);
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
              onClick={_onAddCorporate}
              type="button"
              className="ml-1 btn btn-brand btn-icon-sm"
            >
              <i className="flaticon2-plus" />
              Thêm doanh nghiệp
            </button>
          </div>
        </div>
      </PortletHead>
      <PortletBody>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Input
              value={query.get("codeAndName")}
              onChange={e =>
                _changeQuery({ name: "codeAndName", value: e.target.value })
              }
              placeholder="Mã/Tên doanh nghiệp"
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              value={query.get("phoneAndAddress")}
              onChange={e =>
                _changeQuery({
                  name: "phoneAndAddress",
                  value: e.target.value
                })
              }
              placeholder="Địa chỉ/SĐT"
            />
          </Grid>
        </Grid>
      </PortletBody>
    </>
  );
});
export default withStyles({})(Filter);
