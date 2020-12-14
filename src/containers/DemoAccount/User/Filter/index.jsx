import React, { memo, useCallback } from "react";
import { Input, Select } from "antd";
import { withStyles } from "@material-ui/core/styles";
import A from "@Components/A";
import PortletBody from "@Components/Portlet/PortletBody";
import { Grid } from "@material-ui/core";
import PortletHead from "@Components/Portlet/PortletHead";
import { STATUS } from "@Constants/common";
import Role from "components/SelectContainer/Role";
import NoTypeBranchCustomer from "components/SelectContainer/NoTypeBranchCustomer";
const Filter = memo(({ query, setParam, onShowUserModal }) => {
  const _clearFilter = useCallback(
    (e) => {
      e.preventDefault();
      setParam((prevState) => {
        let nextState = prevState;
        nextState = nextState.setIn(["currentPage"], 0);
        nextState = nextState.setIn(["query", "userCode"], "");
        nextState = nextState.setIn(["query", "fullnamePhoneEmail"], "");
        nextState = nextState.setIn(["query", "organizationIds"], undefined);
        nextState = nextState.setIn(["query", "status"], undefined);
        nextState = nextState.setIn(["query", "rolesIds"], undefined);
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
  const _onAddUser = useCallback(() => {
    onShowUserModal({
      actionName: "add",
      isShow: true,
      userId: null,
    });
  }, [onShowUserModal]);
  return (
    <>
      <PortletHead className="border-bottom-0">
        <div className="kt-portlet__head-label"></div>
        <div className="kt-portlet__head-toolbar">
          <div className="kt-portlet__head-wrapper">
            <A onClick={_clearFilter} className="btn btn-clean btn-icon-sm">
              Xóa bộ lọc
            </A>
            <button
              onClick={_onAddUser}
              type="button"
              className="ml-1 btn btn-brand btn-icon-sm"
            >
              <i className="flaticon2-plus" />
              Thêm tài khoản
            </button>
          </div>
        </div>
      </PortletHead>
      <PortletBody>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <Input
              value={query.get("userCode")}
              onChange={(e) =>
                _changeQuery({ name: "userCode", value: e.target.value })
              }
              placeholder="Mã người dùng"
            />
          </Grid>
          <Grid item xs={2}>
            <Input
              value={query.get("fullnamePhoneEmail")}
              onChange={(e) =>
                _changeQuery({
                  name: "fullnamePhoneEmail",
                  value: e.target.value,
                })
              }
              placeholder="Họ và tên/SĐT/Email"
            />
          </Grid>
          <Grid item xs={4}>
            <NoTypeBranchCustomer
              value={query.get("organizationIds") || undefined}
              // labelNoType={true}
              url="/partners/select/bP-bC-iP-iC-br-brC/list"
              multiple={true}
              placeholder="Chọn Doanh nghiệp"
              parentSelectable={true}
              onSelect={(customer) =>
                _changeQuery({
                  name: "organizationIds",
                  value: customer,
                })
              }
            />
          </Grid>
          <Grid item xs={2}>
            <Role
              mode="multiple"
              value={query.get("rolesIds") || []}
              onSelect={(e) =>
                _changeQuery({
                  name: "rolesIds",
                  value: e,
                })
              }
            />
          </Grid>
          <Grid item xs={2}>
            <Select
              mode="multiple"
              allowClear
              placeholder="Chọn trạng thái"
              name="status"
              style={{ width: "100%" }}
              value={query.get("status") || []}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              onChange={(e) =>
                _changeQuery({
                  name: "status",
                  value: e,
                })
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
