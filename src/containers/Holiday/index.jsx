import Portlet from "@Components/Portlet";
import PortletBody from "@Components/Portlet/PortletBody";
import PortletHead from "@Components/Portlet/PortletHead";
import { Ui } from "@Helpers/Ui";
import { Grid } from "@material-ui/core";
import ServiceBase from "@Services/ServiceBase";
import moment from "moment";
import React from "react";
import HolidayList from "./HolidayList";
import SelectYear from "./SelectYear";
class Holiday extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      holidayList: [],
      dateAt: moment().format("YYYY"),
    };
    this.holidayList = [];
    this.date = [];
  }

  componentDidMount() {
    const { dateAt } = this.state;
    const year = {
      year: dateAt,
    };
    this.onChangeYear(year); //số năm nhận được từ Selectyear
  }

  onChange = (holidayList, value) => {
    this.holidayList = holidayList;
    this.value = value;
  };

  onChangeYear = async (date) => {
    this.setState({
      dateAt: date.year, //xét lại state của dateAt sau khi đã chọn năm
    });
    let result = await ServiceBase.requestJson({
      url: `/list-holiday`,
      method: "GET",
      data: date,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      this.setState({ holidayList: result.value });
      this.holidayList = result.value;
    }
  };

  handleSave = async () => {
    const { dateAt } = this.state;
    const year = {
      year: dateAt,
    };
    const validate = this.holidayList.filter((x) => x.label === ""); // tra ve 1 mANG [...],
    if (validate.length > 0) {
      alert("Bạn chưa nhập giá trị");
    } else {
      let result = await ServiceBase.requestJson({
        url: "/create-update-holiday",
        method: "POST",
        data: {
          data: this.holidayList,
        },
      });

      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        Ui.showSuccess({ message: "Success" });
      }
      this.onChangeYear(year);
    }
  };

  handleDeleteItem = async (id) => {
    const { dateAt } = this.state;
    const year = {
      year: dateAt,
    };

    let result = await ServiceBase.requestJson({
      url: `/delete-holiday/${id}`,
      method: "DELETE",
      data: {},
    });

    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      this.onChangeYear(year);
      Ui.showSuccess({ message: "Xóa ngày nghỉ thành công." });
    }
  };
  render() {
    const { holidayList, dateAt } = this.state;
    return (
      <div className="row">
        <div className="col">
          <Portlet>
            <PortletHead className="border-bottom-0">
              <div className="kt-portlet__head-label"></div>
              <div className="kt-portlet__head-toolbar">
                <div className="kt-portlet__head-wrapper">
                  <button
                    onClick={this.handleSave}
                    type="button"
                    className="ml-1 btn btn-brand btn-icon-sm"
                  >
                    <i className="flaticon2-plus" />
                    Lưu
                  </button>
                </div>
              </div>
            </PortletHead>
            <PortletBody>
              <SelectYear onChangeYear={this.onChangeYear} year={dateAt} />
            </PortletBody>

            <HolidayList
              dateAt={dateAt}
              holidayList={holidayList}
              onChange={this.onChange}
              handleDeleteItem={this.handleDeleteItem}
            />
          </Portlet>
        </div>
      </div>
    );
  }
}
export default Holiday;
