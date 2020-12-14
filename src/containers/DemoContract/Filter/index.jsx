import React, { memo, useCallback } from "react";
import { Input, Select } from "antd";
import { withStyles } from "@material-ui/core/styles";
import A from "@Components/A";
import PortletBody from "@Components/Portlet/PortletBody";
import { Grid } from "@material-ui/core";
import PortletHead from "@Components/Portlet/PortletHead";
import ContractType from "components/SelectContainer/ContractType";

const Filter = memo(({ query, setParam, onShowContractModal }) => {
  const _clearFilter = useCallback(
    (e) => {
      e.preventDefault();
      setParam((prevState) => {
        let nextState = prevState;
        nextState = nextState.setIn(["currentPage"], 0);
        nextState = nextState.setIn(["query", "contractNumber"], "");
        nextState = nextState.setIn(["query", "codeAndName"], "");
        nextState = nextState.setIn(["query", "contractType"], undefined);
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
  const _onAddContract = useCallback(() => {
    onShowContractModal({
      actionName: "add",
      isShow: true,
      corporateId: null,
    });
  }, [onShowContractModal]);
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
              onClick={_onAddContract}
              type="button"
              className="ml-1 btn btn-brand btn-icon-sm"
            >
              <i className="flaticon2-plus" />
              Thêm hợp đồng
            </button>
          </div>
        </div>
      </PortletHead>
      <PortletBody>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Input
              value={query.get("contractNumber")}
              onChange={(e) =>
                _changeQuery({ name: "contractNumber", value: e.target.value })
              }
              placeholder="Số hợp đồng"
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              value={query.get("codeAndName")}
              onChange={(e) =>
                _changeQuery({ name: "codeAndName", value: e.target.value })
              }
              placeholder="Mã/Tên doanh nghiệp"
            />
          </Grid>
          <Grid item xs={3}>
            <ContractType
              value={query.get("contractType") || undefined}
              onSelect={(contractType) =>
                _changeQuery({
                  name: "contractType",
                  value: contractType,
                })
              }
            />
          </Grid>
        </Grid>
      </PortletBody>
    </>
  );
});
export default withStyles({})(Filter);
