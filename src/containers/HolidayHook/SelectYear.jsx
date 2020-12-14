import { Drawer, Select, Button } from "antd";
import React, { Component } from "react";
import { DatePicker, Row, Col } from "antd";
import moment from "moment";

const { Option } = Select;
export default class SelectYear extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isopen: false,
    };
  }
  onChangeYear = (date) => {
    this.setState({
      isopen: false,
    });
    this.props.onChangeYear({
      year: moment(date).format("YYYY"), //year được truyền sang theo dạng ob
    });
  };
  render() {
    const { year } = this.props;
    const { isopen } = this.state;
    return (
      <div style={{ width: 300 }}>
        <DatePicker
          value={moment(year, "YYYY")}
          format="YYYY"
          open={isopen}
          mode="year"
          onPanelChange={this.onChangeYear}
          placeholder="Chọn năm"
          onOpenChange={(status) => {
            this.setState({ isopen: !!status });
          }}
        />
      </div>
    );
  }
}
