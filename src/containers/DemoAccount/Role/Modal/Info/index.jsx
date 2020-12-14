import { Ui } from "@Helpers/Ui";
import { Grid, withStyles } from "@material-ui/core";
import ServiceBase from "@Services/ServiceBase";
import { Input, Spin, Button, Form, Icon, Row, Col } from "antd";
import classNames from "classnames";
import ManageUnit from "components/SelectContainer/ManageUnit";
import Role from "components/SelectContainer/Role";
import { fromJS, List, Map } from "immutable";
import _ from "lodash";
import React, { memo, useCallback, useEffect, useState } from "react";
import { URI } from "../../constants";
import UserRole from "./UserRole";
const formItemLayout = {
  labelCol: {
    span: "auto",
  },
  wrapperCol: {
    span: "auto",
  },
};
const tailFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

const RoleInfo = (
  // { roleId, appConfig, onShowModal, actionName, classes },
  props
) => {
  const [isSaveRoleFetching, setIsSaveRoleFetching] = useState(false);
  const [readRoleFetching, setReadRoleFetching] = useState(false);
  const [role, setRole] = useState(
    Map({
      name: "",
      permissions: List(),
      organization: {},
      parent: {},
      organizationId: null,
      parentId: null,
    })
  );

  /**
   * Callback
   */
  const { getFieldDecorator, validateFields, setFieldsValue } = props.form;

  const _handleSaveRole = useCallback(
    (e) => {
      e.preventDefault();
      validateFields(async (err, values) => {
        console.log("values", values);
        if (!err) {
          let data = _.pick(role.toJS(), [
            "uuid",
            "name",
            "parent",
            "permissions",
            "organization",
          ]);
          data.organizationId = data.organization.key;
          data.parentId = data.parent.key;
          setIsSaveRoleFetching(true);
          let result = await ServiceBase.requestJson({
            method: "POST",
            url: URI.EDIT_ROLE,
            data: data,
          });
          if (result.hasErrors) {
            Ui.showErrors(result.errors);
          } else {
            Ui.showSuccess({ message: "Lưu chức danh thành công." });
            props.onShowModal({ isShow: false, actionName: "", roleId: "" });
          }
          setIsSaveRoleFetching(false);
        }
      });
    },
    [props.onShowModal, role]
  );
  //----------------------
  /**
   * Effect
   */
  useEffect(() => {
    if (props.roleId) {
      _.delay(async () => {
        setReadRoleFetching(true);
        let result = await ServiceBase.requestJson({
          url: URI.READ_ROLE,
          method: "POST",
          data: { uuid: props.roleId },
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          let rs = result.value;
          rs.organization = _.isArray(rs.organization)
            ? rs.organization
            : _.get(rs, "organization")
            ? [_.get(rs, "organization")]
            : [];
          setRole(fromJS(rs));
        }
        setReadRoleFetching(false);
      }, 600);
    } else {
    }
  }, [props.roleId]);
  //-------------------------

  return (
    <div>
      <Form
        {...formItemLayout}
        // layout="vertical"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Spin spinning={readRoleFetching} tip="...Đang lấy dữ liệu">
          <div className="content">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Doanh nghiệp">
                  {getFieldDecorator("organization", {
                    initialValue: role.toJS().organization,
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng chọn tên doanh nghiệp",
                      },
                    ],
                  })(
                    <ManageUnit
                      onSelect={(item) => {
                        setFieldsValue({ organization: item });
                        setRole((prevState) =>
                          prevState.set("organization", item)
                        );
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Chức danh">
                  {getFieldDecorator("name", {
                    initialValue: role.get("name"),
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập tên chức danh",
                      },
                    ],
                  })(
                    <Input
                      onChange={(e) => {
                        let values = e.target.value;
                        setFieldsValue({ name: values });
                        setRole((prevState) => prevState.set("name", values));
                      }}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Chức danh QL">
                  {getFieldDecorator("parent", {
                    initialValue: role.toJS().parent,
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng chọn tên chức danh quản lý",
                      },
                    ],
                  })(
                    <Role
                      onSelect={(item) => {
                        setFieldsValue({ parent: item });
                        setRole((prevState) => prevState.set("parent", item));
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              {...tailFormItemLayout}
              style={{ paddingTop: 20, paddingBottom: 10 }}
            >
              <UserRole
                permissions={role.get("permissions")}
                setRole={setRole}
              />
            </Form.Item>
          </div>
        </Spin>
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            borderTop: "1px solid #e9e9e9",
            paddingLeft: "20px",
            background: "#fff",
            textAlign: "left",
            // zIndex: 10000,
          }}
        >
          <button
            onClick={_handleSaveRole}
            disabled={isSaveRoleFetching}
            loading={isSaveRoleFetching}
            className={classNames({
              "btn btn-info btn-icon-sm": true,
              "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger": isSaveRoleFetching,
            })}
            type="primary"
            style={{ height: 40, width: 80 }}
          >
            <Icon type="save" />
            Lưu
          </button>
        </div>
      </Form>
    </div>
  );
};
// const mapStateToProps = createStructuredSelector({
//   appConfig: makeSelectAppConfig(),
// });

// export default compose(
//   memo,
//   connect(mapStateToProps, null),
//   withStyles({
//     info: {
//       paddingBottom: 55,
//       "& .action": {
//         position: "absolute",
//         left: 0,
//         bottom: 0,
//         width: "100%",
//         borderTop: "1px solid #e9e9e9",
//         padding: "5px 16px",
//         background: "#fff",
//         textAlign: "left",
//       },
//       "& .content": {},
//     },
//   })
// )(Form.create()(RoleInfo));

export default Form.create()(RoleInfo);
