import { Button, Form, Input } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as profileActions } from "../../redux/profile/actions";
import "./style.css";
const { editProfile } = profileActions;
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      password: "",
      confirmPassword: "",
    };
  }
  onClick = (values) => {
    const params = {
      passwordOld: values.passwordOld,
      password: values.password,
      confirm: values.confirm,
      uuid: this.props.profile.uuid,
    };
    this.props.editProfile(params);
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value !== form.getFieldValue("password")) {
      callback("Mật khẩu xác nhận không khớp !");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 10 },
      },
    };

    const styleItem = {
      fontWeight: 700,
      fontSize: 16,
      width: 200,
    };
    const styleItemOrg = {
      fontWeight: 700,
      fontSize: 16,
      width: 240,
    };

    const { profile } = this.props;
    const roleName = profile.roleName.map((roleName, index) => {
      if (profile.roleName.length - 1 === index) {
        return `${roleName.name}`;
      } else {
        return `${roleName.name}, `;
      }
    });
    return (
      <div>
        <div className="container" style={{ paddingTop: 50 }}>
          <div className="row carousel-holder">
            <div className="col-md-3"></div>

            <div className="col-md-6" style={{ backgroundColor: "#ffffff" }}>
              <div className="panel panel-default" style={{ margin: 20 }}>
                <h2>Thông tin tài khoản</h2>
                <br />
                <div className="panel-body">
                  <form>
                    <div>
                      <label style={styleItem}>Họ tên: </label>
                      {profile.fullName}
                    </div>
                    <br />
                    <div>
                      <label style={styleItem}>Chức danh:</label>
                      {roleName}
                    </div>
                    <br />
                    <div style={{ display: "flex" }}>
                      <label style={styleItem}>Email:</label>
                      <p>{profile.email}</p>
                    </div>
                    <br />
                    <div>
                      <label style={styleItem}>Số điện thoại:</label>
                      {profile.phone}
                    </div>
                    <br />
                    <div style={{ display: "flex" }}>
                      <label style={styleItemOrg}>Tên đơn vị:</label>
                      <p>{profile.organizationName}</p>
                    </div>
                    <br />
                  </form>
                </div>
              </div>
              <Form
                style={{ margin: 20 }}
                {...formItemLayout}
                onSubmit={(e) => {
                  e.preventDefault();
                  this.props.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                      this.onClick(values);
                    }
                  });
                }}
              >
                <h2>Cập nhật mật khẩu</h2>
                <Form.Item label="Mật khẩu cũ:">
                  {getFieldDecorator("passwordOld", {
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu",
                      },
                    ],
                  })(
                    <Input
                      name="password"
                      type="password"
                      placeholder="Nhập mật khẩu(cũ)"
                    />
                  )}
                </Form.Item>
                <Form.Item label="Mật khẩu mới:">
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu",
                      },
                      {
                        validator: this.validateToNextPassword,
                      },
                    ],
                  })(<Input.Password placeholder="Nhập mật khẩu(mới)" />)}
                </Form.Item>
                <Form.Item label="Xác nhận mật khẩu:" hasFeedback>
                  {getFieldDecorator("confirm", {
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu!",
                      },
                      {
                        validator: this.compareToFirstPassword,
                      },
                    ],
                  })(
                    <Input.Password
                      onBlur={this.handleConfirmBlur}
                      placeholder="Nhập mật khẩu(mới)"
                    />
                  )}
                </Form.Item>
                <br />
                <br />
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className="col-md-1"></div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (store) => {
  return {
    profile: store.App.profile,
  };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      editProfile,
    },
    dispatch
  );
const App = Form.create({
  mapPropsToFields() {
    return {};
  },
})(Profile);
export default connect(mapStateToProps, mapDispatchToProps)(App);
