import { TableHeaderContent } from "@Components/Utility/common";
import {
  Grid,
  Table,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import Paper from "@material-ui/core/Paper";
import { Icon, Modal } from "antd";
import { Select } from "antd";
import React, { Component } from "react";
import Item from "./Item";
import PortletHead from "@Components/Portlet/PortletHead";
import Portlet from "@Components/Portlet";
import PortletBody from "@Components/Portlet/PortletBody";
import moment from "moment";
import { CALL_HISTORY_METHOD } from "react-router-redux";

const { Option } = Select;

const columns = [
  {
    name: "id",
    title: "#",
  },
  {
    name: "label",
    title: "TÊN NGÀY LỄ",
    editable: true,
  },
  {
    name: "dateAt",
    title: "NGÀY NGHỈ",
  },
  {
    name: "deleteAt",
    title: "",
  },
];

export default class HolidayList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      holidayList: props.holidayList,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.holidayList !== this.props.holidayList) {
      this.setState({
        holidayList: nextProps.holidayList,
      });
    }
  }
  //Add
  handleAdd = (value) => {
    const { holidayList } = this.state;
    const newData = {
      label: "",
      dateAt: new Date(parseInt(this.props.dateAt), 0, 1),
    };
    this.setState({
      holidayList: [...holidayList, newData],
    });
    this.props.onChange(holidayList, value);
  };
  //Edit
  handleEditItem = (value, item, nameItem) => {
    const { holidayList } = this.state;
    const id = item.row.id;
    const objIndex = holidayList.findIndex((obj) => obj.id === id);
    holidayList[objIndex][nameItem] = value;
    this.props.onChange(holidayList, value);
  };
  handleDeleteItem = (id, ids, item) => {
    const holidayList = this.props.holidayList;

    const index = holidayList.findIndex((x) => x.ids === ids);
    if (id) {
      this.props.handleDeleteItem(id);
    } else {
      // const holidayList = [...this.state.holidayList];
      this.setState({
        holidayList: holidayList.filter((item) => item.ids !== ids),
        holidayList: this.props.holidayList,
      });
    }
  };

  render() {
    return (
      <div>
        <PortletBody>
          <Paper>
            <Grid rows={this.state.holidayList || []} columns={columns}>
              <Table
                columnExtensions={[
                  { columnName: "id", wordWrapEnabled: true, width: 100 },
                  { columnName: "label", wordWrapEnabled: true },
                  { columnName: "dateAt", wordWrapEnabled: true, width: 250 },
                  {
                    columnName: "deleteAt",
                    wordWrapEnabled: true,
                    width: 50,
                    textAlign: "center",
                  },
                ]}
                cellComponent={(props) => {
                  return (
                    <Item
                      item={props}
                      handleEditItem={this.handleEditItem}
                      handleDeleteItem={this.handleDeleteItem}
                    />
                  );
                }}
              />
              <TableHeaderRow
                cellComponent={(props) => {
                  return (
                    <TableHeaderRow.Cell
                      {...props}
                      style={{
                        ...props.style,
                        background: "#f2f3f8",
                      }}
                    />
                  );
                }}
                contentComponent={TableHeaderContent}
              />
            </Grid>
          </Paper>
        </PortletBody>
        <i
          type="plus-circle"
          class="fas fa-plus-circle"
          title="Thêm ngày nghỉ"
          style={{
            marginLeft: 50,
            fontSize: 30,
            color: "green",
          }}
          onClick={this.handleAdd}
        ></i>
        {/* <Icon
          type="plus-circle"
          onClick={this.handleAdd}
          title="Thêm ngày nghỉ"
          style={{
            marginLeft: 50,
            fontSize: 30,
            color: "green",
          }}
        /> */}
      </div>
    );
  }
}
