import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  Divider,
  Icon,
  Input,
  Tag,
  Tooltip,
  Checkbox,
  Radio,
  Row,
  Col,
  Modal,
  Button,
  Popover,
  Select,
  Tabs,
  DatePicker,
  TimePicker,
  Form
} from "antd";
import { Formik } from "formik";
import moment from "moment";
import { Table } from "@devexpress/dx-react-grid-material-ui";
const { Option } = Select;
const { TabPane } = Tabs;

class TaskQuitWord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabledTime: true,
      disabledOption: true
    };
    this.checkComfirm = props.sabbatical ? props.sabbatical.confirm : false;
    this.checkComfirmQuit = false;
    this.onNoteQuit = "";
    this.choice = "";
    this.toTime = "";
    this.fromTime = "";

    this.loop = "";
    this.note = "";
  }
  componentDidMount() {
    const { column, value, style, props } = this.props.props;
    if (value.sabbatical ? value.sabbatical.segment == "CUSTOM" : null) {
      this.setState({
        disabledOption: false
      });
    } else {
      this.setState({
        disabledOption: true
      });
    }
  }

  onChangeRadio = staus => {
    this.choice = staus.target.value;
    if (staus.target.value == "CUSTOM") {
      this.setState({
        disabledOption: false
      });
    } else {
      this.setState({
        disabledOption: true
      });
    }
  };

  onInput = e => {
    this.reason = e.target.value;
  };

  onToTime = (date, dateString) => {
    this.toTime = dateString;
  };
  onFromTime = (date, dateString) => {
    this.fromTime = dateString;
  };

  onChangeLoop = loop => {
    this.loop = loop;
  };
  onSubmit = (e, cellData) => {
    let uuid = cellData ? cellData.uuid : "";
    let date = cellData ? cellData.date : "";
    let segment = {
      type: this.choice ? this.choice : "",
      timeStart: this.toTime ? this.toTime : "",
      timeEnd: this.fromTime ? this.fromTime : ""
    };

    let params = {
      segment: segment,
      driverId: uuid,
      date: date,
      status: false,
      confirmText: this.onNoteQuit ? this.onNoteQuit : "",
      confirm: this.checkComfirmQuit,
      reasion: this.reason
    };
    this.props.onSaveSabbticalchudule(params);
  };

  oncheckComfirm = check => {
    console.log("checkComfirm", check.target.checked);

    this.checkComfirm = check.target.checked;
  };
  oncheckComfirmQuit = check => {
    console.log("checkComfirmQuit", check.target.checked);
    this.checkComfirmQuit = check.target.checked;
  };

  onNote = note => {
    this.note = note.target.value;
  };
  onNoteQuit = note => {
    this.onNoteQuit = note.target.value;
  };
  onSubmitComfirm = (e, cellData) => {
    let uuid = cellData ? cellData.uuid : "";
    let date = cellData ? cellData.date : "";
    let textcomfirm = cellData ? cellData.sabbatical.confirmText : "";
    let confirm = cellData ? cellData.sabbatical.confirm : "";
    let reasion = cellData ? cellData.sabbatical.reasion : "";
    let timeStart = cellData ? cellData.sabbatical.timeStart : "";
    let timeEnd = cellData ? cellData.sabbatical.timeEnd : "";
    let type = cellData ? cellData.sabbatical.segment : "";
    let segment = {
      type: this.choice ? this.choice : type,
      timeStart: this.toTime ? this.toTime : timeStart,
      timeEnd: this.fromTime ? this.fromTime : timeEnd
    };
    let param = {
      driverId: uuid,
      date: date,
      confirm: this.checkComfirm ? this.checkComfirm : false,
      confirmText: this.note ? this.note : textcomfirm ? textcomfirm : "",
      reasion: this.reason ? this.reason : reasion,
      segment: segment
    };
    console.log("this.checkComfirm", this.checkComfirm);

    this.props.onComfirmchudule(param);
  };

  render() {
    const { column, value, style, props } = this.props.props;
    console.log("cellData", this.props.props);
    let cellData = value;
    const format = "HH:mm";
    const _this = this;
    // <div className="customer_table">
    //   <div style={{ marginBottom: "10px" }}>
    //     <span>
    //       Lý do : {cellData.sabbatical ? cellData.sabbatical.reasion : ""}
    //     </span>
    //   </div>
    //   <div style={{ marginBottom: "10px" }}>
    //     <Input
    //       placeholder="Ghi chú"
    //       onChange={_this.onNote}
    //       defaultValue={
    //         cellData.sabbatical ? cellData.sabbatical.confirmText : ""
    //       }
    //     />
    //   </div>
    //   <Checkbox
    //     onChange={_this.oncheckComfirm}
    //     defaultChecked={cellData.sabbatical ? cellData.sabbatical.confirm : ""}
    //   >
    //     Xác nhận
    //   </Checkbox>
    //   <div style={{ marginBottom: "10px" }}>
    //     Họ và tên : <b>{cellData.fullName}</b>
    //   </div>
    //   <div>
    //     <Divider style={{ margin: "10px" }} />
    //   </div>
    //   <div style={{ marginBottom: "10px" }}>
    //     <DatePicker
    //       disabled
    //       defaultValue={cellData.date ? moment(cellData.date) : ""}
    //       format={"DD-MM-YYYY"}
    //     />
    //   </div>

    //   <div style={{ marginBottom: "10px" }}>
    //     <Radio.Group
    //       onChange={status => _this.onChangeRadio(status, cellData)}
    //       defaultValue={cellData.sabbatical ? cellData.sabbatical.segment : ""}
    //     >
    //       <Radio value={"ALL"}>Cả ngày</Radio>
    //       <Radio value={"MORNING"}>Buổi sáng</Radio>
    //       <Radio value={"EVENING"}>Buổi chiều</Radio>
    //       <Radio value={"CUSTOM"}>Theo giờ</Radio>
    //     </Radio.Group>
    //   </div>
    //   <div style={{ marginBottom: "10px" }}>
    //     <TimePicker
    //       defaultValue={
    //         cellData.sabbatical
    //           ? cellData.sabbatical.timeStart
    //             ? moment(cellData.sabbatical.timeStart, format)
    //             : null
    //           : null
    //       }
    //       disabled={_this.state.disabledOption}
    //       placeholder="Từ giờ"
    //       onChange={_this.onToTime}
    //       format={format}
    //     />{" "}
    //     -{" "}
    //     <TimePicker
    //       defaultValue={
    //         cellData.sabbatical
    //           ? cellData.sabbatical.timeEnd
    //             ? moment(cellData.sabbatical.timeEnd, format)
    //             : null
    //           : null
    //       }
    //       disabled={_this.state.disabledOption}
    //       placeholder="Đến giờ"
    //       format={format}
    //       onChange={_this.onFromTime}
    //     />
    //   </div>
    //   <Button
    //     onClick={row => _this.onSubmitComfirm(row, cellData)}
    //     type="primary"
    //   >
    //     Lưu
    //   </Button>
    // </div>;

    // renderQuitWork = () => {
    //   return <QuitWork />;
    // };
    return (
      <Button
        onClick={row => _this.onSubmitComfirm(row, cellData)}
        type="primary"
      >
        Lưu
      </Button>
    );
  }
}

export default TaskQuitWord;
