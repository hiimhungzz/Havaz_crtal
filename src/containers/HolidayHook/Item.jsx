import { Table } from "@devexpress/dx-react-grid-material-ui";
import { DatePicker, Form, Input, Modal } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import React from "react";
import "./styleHoliday.css";
const { RangePicker } = DatePicker;
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

const confirm = Modal.confirm;
class Item extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.item.value, // gía trị value nhận được
      isEdit: false,

      isopen: false,
    };
  }

  handleEditItem = (value) => {
    const { item } = this.props; //cellitem

    console.log("value", value);

    this.setState({ value: value, isShow: !this.state.isShow }); //state được set lại sau mỗi lần nhập
    this.props.handleEditItem(value, item, item.column.name); // dữ liệu call back ra ngoài thằng cha nhận được
  };

  handleDeleteItem = () => {
    const { item } = this.props;
    const id = item.row.id;
    const ids = item.tableRow.rowId;
    this.showDeleteConfirm(id, ids);
  };
  showDeleteConfirm(id, ids) {
    let _this = this;
    confirm({
      title: "Bạn có chắc chắn muốn xóa không ?",
      content: "",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        _this.props.handleDeleteItem(id, ids);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
  handleShowInput = () => {
    this.setState({ isEdit: true });
  };
  handleAdd = (value) => {};

  render() {
    const { isopen } = this.state;
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const config = {
      rules: [
        { type: "object", required: true, message: "Please select time!" },
      ],
    };
    if (this.props.item.column.name === "deleteAt") {
      return (
        <Table.Cell
          value={
            <td
              className={`align-middle text-center kt-font-bold kt-font-lg`}
              style={{ float: "right" }}
            >
              <button
                title="Xóa ngày nghỉ"
                className={`btn btn-clean btn-sm btn-icon btn-icon-md `}
                onClick={this.handleDeleteItem}
              >
                <i className={`flaticon2-trash kt-font-danger`} />
              </button>
            </td>
          }
        />
      );
    }
    if (this.props.item.column.name === "id") {
      return (
        <Table.Cell
          value={
            <div>
              {" "}
              <td
                className={`align-middle text-center kt-font-bold kt-font-lg `}
              >
                {this.props.item.tableRow.rowId + 1}
              </td>
            </div>
          }
        />
      );
    }
    if (this.props.item.column.name === "dateAt") {
      return (
        <Table.Cell
          value={
            <div>
              <DatePicker
                onChange={(date) => {
                  this.handleEditItem(moment(date).format("DD-MM-YYYY"));
                }}
                defaultValue={moment(this.state.value, "DD-MM-YYYY")}
                format={dateFormatList}
                open={isopen}
                mode="date/month"
                onOpenChange={(status) => {
                  this.setState({ isopen: !!status });
                }}
              />
            </div>
          }
        />
      );
    }
    return (
      <Table.Cell
        value={
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              this.props.form.validateFieldsAndScroll((err, value) => {
                if (!err) {
                  this.handleEditItem(value);
                }
              });
            }}
          >
            <Form.Item>
              {getFieldDecorator("value", {
                initialValue: this.state.value,
                rules: [
                  {
                    required: true,
                    message: "Vui lòng nhập giá trị",
                  },
                ],
              })(
                <input
                  placeholder="Vui lòng nhập giá trị"
                  value={this.state.value}
                  onChange={(e) => {
                    this.setState({ isEdit: true });
                    this.handleEditItem(e.target.value);
                  }}
                />
              )}
            </Form.Item>
            {/* <Input
                style={{ width: 400 }}
                placeholder={"Vui lòng nhập dữ liệu"}
                value={this.state.value}
                onChange={(e) => {
                  this.setState({ isEdit: true });
                  this.handleEditItem(e.target.value);
                }}
              /> */}
          </Form>
          // )
        }
      />
    );
  }
}
const App = Form.create({
  mapPropsToFields() {
    return {};
  },
})(Item);
export default App;
