import React from "react";
import {
  Divider,
  Icon,
  Input,
  Tag,
  Tooltip,
  Checkbox,
  Radio,
  Modal,
  Button,
  Popover,
  Select,
  Tabs,
  DatePicker,
  TimePicker,
} from "antd";
import moment from "moment";
import { API_URI } from "@Constants";
import ServiceBase from "@Services/ServiceBase";
import { Table } from "@devexpress/dx-react-grid-material-ui";
import { SelectBaseSon } from "@Components/Utility/common";
import "./style.scss";
const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal;

class TaskScheduleItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabledTime: true,
      disabledTimeGoto: true,
      disabledOption: true,
      disabledOptionGoto: true,
      typeWorking: props.props.value.typePublic,
      typeSabbtical: props.props.value.sabbatical ? props.props.value.sabbatical.typePublic : undefined,
    };
    const { column, value, style } = props.props;

    this.checkComfirm = value.sabbatical ? value.sabbatical.confirm : false;
    this.checkComfirmQuit = false;
    this.onNoteQuit = "";
    this.choice = "";
    this.toTime = value.sabbatical ? value.sabbatical.timeStart : "";
    this.fromTime = value.sabbatical ? value.sabbatical.timeEnd : "";
    this.toTimeGoTo = value.sabbatical ? value.timeStart : "";
    this.fromTimeGoTo = value.sabbatical ? value.timeEnd : "";
    this.loop = "";
    this.choiceGoto = value.segment ? value.segment : "";
    this.note = value.sabbatical ? value.sabbatical.confirmText : "";
    this.reasion = value.sabbatical ? value.sabbatical.reasion : "";
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
    if (value.segment == "CUSTOM") {
      this.setState({
        disabledOptionGoto: false
      });
    } else {
      this.setState({
        disabledOptionGoto: true
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
  onChangeRadioGoto = staus => {
    this.choiceGoto = staus.target.value;
    if (staus.target.value == "CUSTOM") {
      this.setState({
        disabledOptionGoto: false
      });
    } else {
      this.setState({
        disabledOptionGoto: true
      });
    }
  };
  onInput = e => {
    this.reason = e.target.value;
  };
  onSelect = e => {
    this.option = e;
    if (e == "CUSTOM") {
      this.setState({
        disabledTimeGoto: false
      });
    } else {
      this.setState({
        disabledTimeGoto: true
      });
    }
  };
  onToTime = (date, dateString) => {
    this.toTime = dateString;
  };
  onFromTime = (date, dateString) => {
    this.fromTime = dateString;
  };
  onToTimeGoTo = (date, dateString) => {
    this.toTimeGoTo = dateString;
  };
  onFromTimeGoTo = (date, dateString) => {
    this.fromTimeGoTo = dateString;
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
    let loop = {
      type: "NONE",
      inputs: []
    };

    let params = {
      segment: segment,
      driverId: uuid,
      date: date,
      loop: loop,
      status: false,
      confirmText: this.onNoteQuit ? this.onNoteQuit : "",
      confirm: this.checkComfirmQuit,
      reasion: this.reason,
      description: ""
    };
    this.props.onSaveSabbticalchudule(params);
  };
  onDeleteGoTo = (e, cellData) => {
    let id = cellData ? cellData.id : "";
    let _this = this;
    confirm({
      title: "Bạn có chắc chắn muốn xóa không ?",
      content: "",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        _this.props.onDeleteSabbticalchudule(id);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };
  onSubmitGoTo = (e, cellData) => {
    let uuid = cellData ? cellData.uuid : "";
    let date = cellData ? cellData.date : "";
    let segment = {
      type: this.choiceGoto ? this.choiceGoto : "",
      timeStart: this.toTimeGoTo ? this.toTimeGoTo : "",
      timeEnd: this.fromTimeGoTo ? this.fromTimeGoTo : ""
    };
    let loop = {
      type: this.option ? this.option : "NONE",
      inputs: this.loop ? this.loop : []
    };
    let params = {
      segment: segment,
      // option: this.option,
      driverId: uuid,
      date: date,
      status: true,
      description: "",
      loop: loop
    };
    console.log("this.toTimeGoTo", this.toTimeGoTo);
    console.log("this.fromTimeGoTo", this.fromTimeGoTo);
    this.props.onSaveGoto(params);
  };
  oncheckComfirm = check => {
    this.checkComfirm = check.target.checked;
  };
  oncheckComfirmQuit = check => {
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
      timeStart: this.toTime ? this.toTime : "",
      timeEnd: this.fromTime ? this.fromTime : ""
    };

    let param = {
      driverId: uuid,
      date: date,
      confirm: this.checkComfirm ? this.checkComfirm : false,
      confirmText: this.note ? this.note : "",
      reasion: this.reason ? this.reason : "",
      segment: segment
    };
    this.props.onComfirmchudule(param);
  };

  onSelectTypeWorking(item, cellData) {
    this.setState({typeWorking: item})
    ServiceBase.requestJson({
      method: "POST",
      url: API_URI.ON_UPDATE_WORKING,
      data: {
        driverId: cellData.uuid,
        type: item.key,
        date: cellData.date,
      }
    });
  };

  renderWorking = (cellData, _this, format, plainOptions) => {
    const gotoWork = (
      <div>
        <div style={{ marginBottom: "10px" }}>
          Họ và tên : <b>{cellData.fullName}</b>
        </div>
        <div className="customer_table">
          <div style={{ marginBottom: "10px" }}>
            <DatePicker
              disabled
              defaultValue={moment(cellData.date)}
              format={"DD-MM-YYYY"}
            />
          </div>
          {/* <div style={{ marginBottom: "10px" }}>
              <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  defaultValue={"Không lặp lại"}
                  onChange={_this.onSelect}
                  // onFocus={onFocus}
                  // onBlur={onBlur}
                  // onSearch={onSearch}
                  filterOption={(input, option) =>
                      option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                  }
              >
                  <Option value="NONE">Không lặp lại</Option>
                  <Option value="MONTH">Cả tháng</Option>
                  <Option value="CUSTOM">Thêm riêng</Option>
              </Select>
          </div>
          <div>
              <Checkbox.Group
                  disabled={_this.state.disabledTimeGoto || (cellData.segment === "CUSTOM")}
                  options={plainOptions}
                  // defaultValue={["Apple"]}
                  onChange={_this.onChangeLoop}
              />
          </div> */}
          <div style={{ marginBottom: "10px" }}>
            <Radio.Group
              onChange={status => _this.onChangeRadioGoto(status, cellData)}
              defaultValue={cellData.segment}
            >
              <Radio value={"ALL"}>Cả ngày</Radio>
              <Radio value={"MORNING"}>Buổi sáng</Radio>
              <Radio value={"EVENING"}>Buổi chiều</Radio>
              <Radio value={"CUSTOM"}>Theo giờ</Radio>
            </Radio.Group>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <TimePicker
              onChange={_this.onToTimeGoTo}
              disabled={_this.state.disabledOptionGoto}
              placeholder="Từ giờ"
              format={format}
              defaultValue={
                cellData.timeStart ? moment(cellData.timeStart, format) : null
              }
            />{" "}
            -{" "}
            <TimePicker
              disabled={_this.state.disabledOptionGoto}
              onChange={_this.onFromTimeGoTo}
              placeholder="Đến giờ"
              format={format}
              defaultValue={
                cellData.timeEnd ? moment(cellData.timeEnd, format) : null
              }
            />
          </div>
        </div>
        <Button
          onClick={row => _this.onSubmitGoTo(row, cellData)}
          type="primary"
        >
          Lưu
        </Button>
        &nbsp; &nbsp;
        <Button
          onClick={row => _this.onDeleteGoTo(row, cellData)}
          type="danger "
        >
          Xóa
        </Button>
      </div>
    );
    return (
      <>
      <Popover
          placement="bottom"
          content={gotoWork}
          title="Lịch trực"
          trigger="click"
        >
        <Tag
          color="green"
          className="white_space d_block"
          size={"small"}
        >
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>Đi làm</div>
            <div>{`Số trip: ${cellData.numberTrip}`}</div>
          </div>
        </Tag>
        </Popover>
        <SelectBaseSon
          value={this.state.typeWorking || undefined}
          onSelect={(item) => this.onSelectTypeWorking(item, cellData)}
          apiUrl={'typePublic'}
          pageLimit={20}
          placeholder="Loại công"
        />
      </>
    )
  };

  onSelectTypeSabbtical(item, cellData) {
    this.setState({typeSabbtical: item})
    ServiceBase.requestJson({
      method: "POST",
      url: API_URI.ON_UPDATE_SABBATICAL,
      data: {
        driverId: cellData.uuid,
        type: item.key,
        date: cellData.date,
      }
    });
  }

  renderSabbatical = (cellData, _this, format, plainOptions) => {
    const quitWork = (
      <div className="customer_table">
        <div style={{ marginBottom: "10px" }}>
          <span>
            Lý do : {cellData.sabbatical ? cellData.sabbatical.reasion : ""}
          </span>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Input
            placeholder="Ghi chú"
            onChange={_this.onNote}
            defaultValue={
              cellData.sabbatical ? cellData.sabbatical.confirmText : ""
            }
          />
        </div>
        <Checkbox
          onChange={_this.oncheckComfirm}
          defaultChecked={
            cellData.sabbatical ? cellData.sabbatical.confirm : ""
          }
        >
          Xác nhận
        </Checkbox>
        <div style={{ marginBottom: "10px" }}>
          Họ và tên : <b>{cellData.fullName}</b>
        </div>
        <div>
          <Divider style={{ margin: "10px" }} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <DatePicker
            disabled
            defaultValue={cellData.date ? moment(cellData.date) : ""}
            format={"DD-MM-YYYY"}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Radio.Group
            onChange={status => _this.onChangeRadio(status, cellData)}
            defaultValue={
              cellData.sabbatical ? cellData.sabbatical.segment : ""
            }
          >
            <Radio value={"ALL"}>Cả ngày</Radio>
            <Radio value={"MORNING"}>Buổi sáng</Radio>
            <Radio value={"EVENING"}>Buổi chiều</Radio>
            <Radio value={"CUSTOM"}>Theo giờ</Radio>
          </Radio.Group>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <TimePicker
            defaultValue={
              cellData.sabbatical
                ? cellData.sabbatical.timeStart
                  ? moment(cellData.sabbatical.timeStart, format)
                  : null
                : null
            }
            disabled={_this.state.disabledOption}
            placeholder="Từ giờ"
            onChange={_this.onToTime}
            format={format}
          />{" "}
          -{" "}
          <TimePicker
            defaultValue={
              cellData.sabbatical
                ? cellData.sabbatical.timeEnd
                  ? moment(cellData.sabbatical.timeEnd, format)
                  : null
                : null
            }
            disabled={_this.state.disabledOption}
            placeholder="Đến giờ"
            format={format}
            onChange={_this.onFromTime}
          />
        </div>
        <Button
          onClick={row => _this.onSubmitComfirm(row, cellData)}
          type="primary"
        >
          Lưu
        </Button>
      </div>
    );
    return (
      <>
      <Popover
            placement="bottom"
            content={quitWork}
            title="Lịch trực"
            trigger="click"
            className="d_flex"
          >
       <Tag
          color="red"
          className="white_space d_block"
          size={"small"}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
            <div>
              {cellData.sabbatical.confirm &&
              cellData.sabbatical.reasion ? (
                <i style={{color: '#52c41a', fontSize: 9}} className="fa fa-check" />  
                ) : (
                  <i style={{fontSize: 9}} className="fa fa-times" />  
                )}
              <span>   Nghỉ phép
              </span>
            </div>
            <div>{`Số trip: ${cellData.numberTrip}`}</div>
          </div>
          {/* <div>
            <span className="customer_tag">
              {cellData.sabbatical.reasion}
            </span>
          </div> */}
        </Tag>
        </Popover>
        <SelectBaseSon
          value={cellData.sabbatical.status ? this.state.typeSabbtical : undefined}
          onSelect={(item) => this.onSelectTypeSabbtical(item, cellData)}
          apiUrl={'typePublic'}
          pageLimit={20}
          placeholder="Nghỉ phép"
        />

      </>
    )
  };

  renderCellItem = (cellData, _this, format, plainOptions) => {
    if(cellData.sabbatical.status === true &&
      cellData.sabbatical.reasion) {

        return (
          // <Popover
          //   placement="bottom"
          //   content={"ádasd"}
          //   title="Lịch trực"
          //   trigger="click"
          //   className="d_flex"
          // >
            <Tooltip placement="top" title={cellData.sabbatical.reasion}>
              {cellData.sabbatical.status == true &&
              cellData.sabbatical.reasion && (
                this.renderSabbatical(cellData, _this, format, plainOptions)
              )}
            </Tooltip>
        /* </Popover> */
        )
    } else if(cellData.status) {
      const gotoWork = (
        <div>
          <div style={{ marginBottom: "10px" }}>
            Họ và tên : <b>{cellData.fullName}</b>
          </div>
          <div className="customer_table">
            <div style={{ marginBottom: "10px" }}>
              <DatePicker
                disabled
                defaultValue={moment(cellData.date)}
                format={"DD-MM-YYYY"}
              />
            </div>
            {/* <div style={{ marginBottom: "10px" }}>
                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select a person"
                    optionFilterProp="children"
                    defaultValue={"Không lặp lại"}
                    onChange={_this.onSelect}
                    // onFocus={onFocus}
                    // onBlur={onBlur}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                        option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    }
                >
                    <Option value="NONE">Không lặp lại</Option>
                    <Option value="MONTH">Cả tháng</Option>
                    <Option value="CUSTOM">Thêm riêng</Option>
                </Select>
            </div>
            <div>
                <Checkbox.Group
                    disabled={_this.state.disabledTimeGoto || (cellData.segment === "CUSTOM")}
                    options={plainOptions}
                    // defaultValue={["Apple"]}
                    onChange={_this.onChangeLoop}
                />
            </div> */}
            <div style={{ marginBottom: "10px" }}>
              <Radio.Group
                onChange={status => _this.onChangeRadioGoto(status, cellData)}
                defaultValue={cellData.segment}
              >
                <Radio value={"ALL"}>Cả ngày</Radio>
                <Radio value={"MORNING"}>Buổi sáng</Radio>
                <Radio value={"EVENING"}>Buổi chiều</Radio>
                <Radio value={"CUSTOM"}>Theo giờ</Radio>
              </Radio.Group>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <TimePicker
                onChange={_this.onToTimeGoTo}
                disabled={_this.state.disabledOptionGoto}
                placeholder="Từ giờ"
                format={format}
                defaultValue={
                  cellData.timeStart ? moment(cellData.timeStart, format) : null
                }
              />{" "}
              -{" "}
              <TimePicker
                disabled={_this.state.disabledOptionGoto}
                onChange={_this.onFromTimeGoTo}
                placeholder="Đến giờ"
                format={format}
                defaultValue={
                  cellData.timeEnd ? moment(cellData.timeEnd, format) : null
                }
              />
            </div>
          </div>
          <Button
            onClick={row => _this.onSubmitGoTo(row, cellData)}
            type="primary"
          >
            Lưu
          </Button>
          &nbsp; &nbsp;
          <Button
            onClick={row => _this.onDeleteGoTo(row, cellData)}
            type="danger "
          >
            Xóa
          </Button>
        </div>
      );
      return (
        // <Popover
        //   placement="bottom"
        //   content={gotoWork}
        //   title="Lịch trực"
        //   trigger="click"
        // >
        <Tooltip placement="top" title="Ngày đi làm">
          {cellData.status ? (
            this.renderWorking(cellData, _this, format, plainOptions)
          ) : (
            ""
          )}
        </Tooltip>
      // </Popover>
      )
    }
  }

  render() {
    const { column, value, style, props } = this.props.props;

    const border = { border: "1px solid rgb(242, 243, 248)" };
    let styles = {};
    if (column.isToday === true) {
      styles = {
        background: "#c7d4dd"
      };
    } else if (column.dateOfWeek == "CN" || column.dateOfWeek == "Thứ 7") {
      styles = {
        background: "#fc9999"
      };
    }
    const format = "HH:mm";
    const _this = this;
    let cellData = value;
    const plainOptions = [
      { value: 2, label: "T2" },
      { value: 3, label: "T3" },
      { value: 4, label: "T4" },
      { value: 5, label: "T5" },
      { value: 6, label: "T6" },
      { value: 7, label: "T7" },
      { value: 1, label: "CN" }
    ];
    if (!(column.name === "col_1")) {
      const content = (
        <Tabs defaultActiveKey="2" style={{ width: "300px" }}>
          <TabPane
            tab={
              <span>
                <Icon type="close-circle" />
                Ngày nghỉ
              </span>
            }
            key="1"
          >
            <div className="customer_table">
              <div style={{ marginBottom: "10px" }}>
                <Input placeholder="Lý do" onChange={_this.onInput} />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <Input placeholder="Ghi chú" onChange={_this.onNoteQuit} />
              </div>
            </div>
            <Checkbox onChange={_this.oncheckComfirmQuit}>Xác nhận</Checkbox>
            <div>
              <div>
                <Divider style={{ margin: "10px" }} />
              </div>
              <div style={{ marginBottom: "10px" }}>
                Họ và tên : <b>{cellData.fullName}</b>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <DatePicker
                  disabled
                  defaultValue={moment(cellData.date)}
                  format={"DD-MM-YYYY"}
                />
              </div>
  
              <div style={{ marginBottom: "10px" }}>
                <Radio.Group
                  onChange={status => _this.onChangeRadio(status, cellData)}
                  defaultValue={_this.state.checkDay}
                >
                  <Radio value={"ALL"}>Cả ngày</Radio>
                  <Radio value={"MORNING"}>Buổi sáng</Radio>
                  <Radio value={"EVENING"}>Buổi chiều</Radio>
                  <Radio value={"CUSTOM"}>Theo giờ</Radio>
                </Radio.Group>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <TimePicker
                  disabled={_this.state.disabledOption}
                  onChange={_this.onToTime}
                  placeholder="Từ giờ"
                  format={format}
                />{" "}
                -{" "}
                <TimePicker
                  disabled={_this.state.disabledOption}
                  onChange={_this.onFromTime}
                  placeholder="Đến giờ"
                  format={format}
                />
              </div>
            </div>
            <Button onClick={row => _this.onSubmit(row, cellData)} type="primary">
              Lưu
            </Button>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="team" />
                Ngày đi làm
              </span>
            }
            key="2"
          >
            <div style={{ marginBottom: "10px" }}>
              Họ và tên : <b>{cellData.fullName}</b>
            </div>
            <div className="customer_table">
              <div style={{ marginBottom: "10px" }}>
                <DatePicker
                  disabled
                  defaultValue={moment(cellData.date)}
                  format={"DD-MM-YYYY"}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  defaultValue="Không lặp lại"
                  onChange={_this.onSelect}
                  // onFocus={onFocus}
                  // onBlur={onBlur}
                  // onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="NONE">Không lặp lại</Option>
                  <Option value="MONTH">Cả tháng</Option>
                  <Option value="CUSTOM">Thêm riêng</Option>
                </Select>
              </div>
              <div>
                <Checkbox.Group
                  disabled={_this.state.disabledTimeGoto}
                  options={plainOptions}
                  defaultValue={["Apple"]}
                  onChange={_this.onChangeLoop}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <Radio.Group
                  onChange={status => _this.onChangeRadioGoto(status, cellData)}
                  defaultValue={_this.state.checkDay}
                >
                  <Radio value={"ALL"}>Cả ngày</Radio>
                  <Radio value={"MORNING"}>Buổi sáng</Radio>
                  <Radio value={"EVENING"}>Buổi chiều</Radio>
                  <Radio value={"CUSTOM"}>Theo giờ</Radio>
                </Radio.Group>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <TimePicker
                  onChange={_this.onToTimeGoTo}
                  disabled={_this.state.disabledOptionGoto}
                  placeholder="Từ giờ"
                  format={format}
                />{" "}
                -{" "}
                <TimePicker
                  disabled={_this.state.disabledOptionGoto}
                  onChange={_this.onFromTimeGoTo}
                  placeholder="Đến giờ"
                  format={format}
                />
              </div>
            </div>
            <Button
              onClick={row => _this.onSubmitGoTo(row, cellData)}
              type="primary"
            >
              Lưu
            </Button>
          </TabPane>
        </Tabs>
      );
      return (
        <Table.Cell
          {...props}
          value={
            <div className="cellItemTask">
              {
                this.renderCellItem(cellData, _this, format, plainOptions)
              }
              <Popover
                placement="bottom"
                content={content}
                title="Lịch trực"
                trigger="click"
              >
                <div style={{ height: "40px" }}>&nbsp;</div>
              </Popover>
            </div>
          }
          style={{ ...style, ...border, textAlign: "left", ...styles }}
        />
      );
    }
    if (column.name === "col_1") {
      return (
        <Table.Cell
          {...props}
          value={cellData.fullName}
          style={{
            ...style,
            ...border,
            textAlign: "left",
            position: "sticky",
            zIndex: "299",
            backgroundColor: "#fff",
            backgroundClip: "padding-box",
            fontSize: "13px",
            width: "50px",
            ...styles
          }}
        />
      );
    }

    return (
      <Table.Cell
        {...props}
        style={{ ...style, ...border, fontSize: "14px", background: "inherit" }}
        value={Object.keys(cellData).map((key, index) => (
          <div key={index}>{cellData[key]}</div>
        ))}
      />
    );
  }
}

export default TaskScheduleItem;
