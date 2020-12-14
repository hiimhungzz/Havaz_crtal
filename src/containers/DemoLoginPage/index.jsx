import React, { memo, useCallback, useState } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import { createStructuredSelector } from "reselect";
import _ from "lodash";
import LogoText from "./LogoText";
import { URI } from "./constants";
import {
  Tabs,
  Form,
  Row,
  Typography,
  Input,
  Icon,
  Button,
  Checkbox,
  Card,
  Col,
} from "antd";
import { Redirect } from "react-router";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
import Globals from "globals.js";
import { makeSelectIsAuthenticated } from "redux/app/selectors";
import { setAuthenticated } from "redux/app/actions";
const { TabPane } = Tabs;
const { Title } = Typography;

const DemoLoginPage = ({
  isAuthenticated,
  setAuthenticated,
  isValidPhoneNumber,
  form,
}) => {
  const { getFieldDecorator } = form;
  const [tabId, setTabId] = useState("1");
  const [isFetching, setIsFetching] = useState(false);
  const _handleLogIn = useCallback(
    async (param) => {
      setIsFetching(true);
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: URI.SIGN_IN_DEFAULT,
        data: param,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
        setIsFetching(false);
      } else {
        Ui.showSuccess({ message: "Đăng nhập hệ thống thành công." });
        let payload = _.get(result, "value.data", {});
        console.log("payload", payload);
        Globals.setSession({
          public: {
            currentUser: JSON.stringify({
              uuid: payload.uuid,
              phone: payload.phone,
              email: payload.email,
              fullName: payload.fullName,
              code: payload.code,
              permissions: payload.permissions,
              organizationName: payload.organizationName,
              organizationUuid: payload.organizationUuid,
              webLogo: payload.webLogo,
              webName: payload.webName,
              webColor: payload.webColor,
              webAPI: payload.webAPI,
              roleName: payload.roleName,
            }),
          },
          private: {
            token: payload.token,
          },
        });
        setAuthenticated({
          isAuthenticated: true,
          profile: {
            uuid: payload.uuid,
            phone: payload.phone,
            email: payload.email,
            fullName: payload.fullName,
            code: payload.code,
            permissions: payload.permissions,
            organizationName: payload.organizationName,
            organizationUuid: payload.organizationUuid,
            webLogo: payload.webLogo,
            webName: payload.webName,
            webColor: payload.webColor,
            webAPI: payload.webAPI,
            roleName: payload.roleName,
          },
        });
      }
      return () => {};
    },
    [setAuthenticated]
  );
  const _handleLogInMobile = useCallback(async (param) => {
    setIsFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: URI.SIGN_IN_DEFAULT,
      data: param,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
      setIsFetching(false);
    } else {
      Ui.showSuccess({ message: "Đăng nhập hệ thống thành công." });
      let payload = _.get(result, "value.data", {});
      Globals.setSession({
        public: {
          currentUser: JSON.stringify({
            uuid: payload.uuid,
            phone: payload.phone,
            email: payload.email,
            fullName: payload.fullName,
            code: payload.code,
            permissions: payload.permissions,
            organizationName: payload.organizationName,
            organizationUuid: payload.organizationUuid,
            webLogo: payload.webLogo,
            webName: payload.webName,
            webColor: payload.webColor,
            webAPI: payload.webAPI,
          }),
        },
        private: {
          token: payload.token,
        },
      });
    }
  }, []);
  const _handleChangeTabId = useCallback((tabId) => {
    setTabId(tabId);
  }, []);
  const _handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          if (tabId === "1") {
            let param = {
              username: values.username,
              password: values.password,
            };
            _handleLogIn(param);
          } else {
            _handleLogInMobile(values.phoneNumber, values.otp);
          }
        }
      });
    },
    [_handleLogIn, _handleLogInMobile, form, tabId]
  );
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <div className="kt-grid__item kt-grid__item--fluid kt-login__wrapper">
      <Helmet title="Đăng nhập">
        <meta name="description" content="Đăng nhập - Car Rental" />
      </Helmet>
      <div className="kt-login__container">
        <div className="kt-login__logo">
          <LogoText>HAVAZ.VN</LogoText>
        </div>
        <div className="kt-login__signin">
          <Card bodyStyle={{ paddingTop: 0 }}>
            <Form onSubmit={_handleSubmitForm}>
              <Tabs
                activeKey={tabId}
                defaulttabId="1"
                tabBarStyle={{
                  marginBottom: 30,
                }}
                onChange={_handleChangeTabId}
              >
                <TabPane tab="Tài khoản" key="1">
                  {tabId === "1" ? (
                    <Row gutter={[8, 8]}>
                      <Col className="text-center" xs={24}>
                        <Title level={3}>Đăng nhập</Title>
                      </Col>
                      <Col xs={24}>
                        <Form.Item>
                          {getFieldDecorator("username", {
                            rules: [
                              {
                                required: true,
                                message: "Nhập tên tài khoản",
                              },
                            ],
                          })(
                            <Input
                              prefix={
                                <Icon
                                  type="user"
                                  style={{ color: "rgba(0,0,0,.25)" }}
                                />
                              }
                              placeholder="Tài khoản"
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item>
                          {getFieldDecorator("password", {
                            rules: [
                              { required: true, message: "Nhập mật khẩu" },
                            ],
                          })(
                            <Input
                              prefix={
                                <Icon
                                  type="lock"
                                  style={{ color: "rgba(0,0,0,.25)" }}
                                />
                              }
                              autoComplete="username"
                              type="password"
                              placeholder="Mật khẩu"
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={8}>
                        <Button
                          loading={isFetching}
                          type="primary"
                          htmlType="submit"
                        >
                          Đăng nhập
                        </Button>
                      </Col>
                      <Col xs={16}>
                        <Form.Item>
                          {getFieldDecorator("remember", {
                            valuePropName: "checked",
                            initialValue: true,
                          })(<Checkbox>Ghi nhớ đăng nhập</Checkbox>)}
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : null}
                </TabPane>
                <TabPane tab="Số điện thoại" key="2">
                  {tabId === "2" ? (
                    <>
                      <Row type="flex" justify="center">
                        <Title level={3}>Đăng nhập</Title>
                      </Row>
                      <Row
                        style={{
                          marginTop: 15,
                        }}
                        type="flex"
                        justify="center"
                      >
                        <Col xs={24}>
                          <Form.Item>
                            {getFieldDecorator("phoneNumber", {
                              rules: [
                                {
                                  required: true,
                                  message: "Nhập số điện thoại",
                                },
                              ],
                            })(
                              <Input
                                prefix={
                                  <Icon
                                    type="phone"
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                  />
                                }
                                placeholder="Số điện thoại"
                              />
                            )}
                          </Form.Item>
                        </Col>
                        {isValidPhoneNumber ? (
                          <Col
                            style={{
                              marginTop: 10,
                            }}
                            xs={24}
                          >
                            <Form.Item>
                              {getFieldDecorator("otp", {
                                rules: [
                                  { required: true, message: "Nhập mã OTP" },
                                ],
                              })(
                                <Input
                                  prefix={
                                    <Icon
                                      type="lock"
                                      style={{ color: "rgba(0,0,0,.25)" }}
                                    />
                                  }
                                  type="text"
                                  placeholder="Mã OTP"
                                />
                              )}
                            </Form.Item>
                          </Col>
                        ) : null}
                      </Row>
                      <Row
                        style={{
                          marginTop: 15,
                          textAlign: "left",
                        }}
                        type="flex"
                        justify="start"
                      >
                        <Col xs={8}>
                          <Button
                            loading={isFetching}
                            type="primary"
                            htmlType="submit"
                          >
                            Đăng nhập
                          </Button>
                        </Col>
                        <Col style={{ textAlign: "right" }} xs={16}>
                          <Form.Item>
                            {getFieldDecorator("remember", {
                              valuePropName: "checked",
                              initialValue: true,
                            })(<Checkbox>Ghi nhớ đăng nhập</Checkbox>)}
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  ) : null}
                </TabPane>
              </Tabs>
            </Form>
          </Card>
        </div>
        <div className="kt-login__account">
          <span className="kt-login__account-msg">
            2019 &copy; Havaz Car Rental
          </span>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated(),
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setAuthenticated,
    },
    dispatch
  );
const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  Form.create({ name: "Login" }),
  withConnect,
  memo
)(DemoLoginPage);
