import React, { Component } from "react";
import { Row, Col, Spin, Button } from "antd";

import {
  Grid,
  Table,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
import { URI } from "@Containers/DemoBooking/constants";

const getRowId = row => {
  return row.uuid;
};

class StatisticalCostForTrip extends Component {
  state = {};
  async componentDidMount() {
    if (this.props.bookingId) {
      let result = await ServiceBase.requestJson({
        url: URI.READ_STATISTICAL_FOR_TRIP,
        method: "POST",
        data: { uuid: this.props.bookingId }
      });

      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        this.setState({ statisticalForTrip: { data: result.value.data } });
      }
    }
  }

  onAccept = async () => {
    const { bookingId } = this.props;
    const params = {
      uuid: bookingId,
      status: 600
    };
    let result = await ServiceBase.requestJson({
      url: URI.CHANGE_BOOKING_STATUS,
      method: "POST",
      data: params
    });

    if (!result.hasErrors) {
      this.props.onSetBookingStatus(600);
    } else {
      Ui.showErrors(result.errors);
    }
  };

  renderRowComponent = props => {
    const cStyle = { ...props.style, height: 15, fontWeight: "bold" };
    return <Table.Row {...props} style={cStyle}></Table.Row>;
  };

  formatNumber(num) {
    if (num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    }
    return num;
  }

  renderCellComponent = (props, index) => {
    const nameColumn = props.column.name;
    if (
      nameColumn === "tongTien" ||
      nameColumn === "tongChiPhi" ||
      nameColumn === "cauPha" ||
      nameColumn === "benBai" ||
      nameColumn === "suaChua" ||
      nameColumn === "nhaNghi" ||
      nameColumn === "nhienLieu" ||
      nameColumn === "congTacPhi" ||
      nameColumn === "chiPhiKhac" ||
      nameColumn === "congTacVien"
    ) {
      return (
        <Table.Cell
          {...props}
          style={{ fontSize: 12, textAlign: "right" }}
          value={this.formatNumber(props.value)}
        />
      );
    }
    return (
      <Table.Cell {...props} style={{ fontSize: 12, textAlign: "center" }} />
    );
  };

  render() {
    const { bookingStatus } = this.props;
    const { statisticalForTrip } = this.state;
    if (!statisticalForTrip) {
      return (
        <div className="text-center">
          <Spin spinning={true} tip="Đang lấy dữ liệu..." />
        </div>
      );
    }
    const labelStyle = { fontWeight: "bold", fontSize: 17, color: "#000" };
    const spanStyle = { minWidth: "26%", display: "inline-block" };
    return (
      <div>
        <h2 className="text-center mb-5">BẢNG KÊ DOANH THU CHI PHÍ</h2>
        <Row style={{ marginLeft: 24 }}>
          <Col span={12}>
            <div style={labelStyle}>
              <span style={spanStyle}>Mã Booking:</span>{" "}
              <span style={{ color: "#1890ff" }}>
                {statisticalForTrip.data.bookingCode}
              </span>
            </div>
            <div style={labelStyle}>
              <span style={spanStyle}>Ngày xuất phát:</span>{" "}
              {statisticalForTrip.data.dateIn}
            </div>
            <div style={labelStyle}>
              <span style={spanStyle}>Ngày kết thúc:</span>{" "}
              {statisticalForTrip.data.dateOut}
            </div>
          </Col>
          <Col span={12}>
            <div style={labelStyle}>
              <span style={spanStyle}>Nhân viên phụ trách:</span>{" "}
              {statisticalForTrip.data.ownerName}
            </div>
            <div style={labelStyle}>
              <span style={spanStyle}>Khách hàng:</span>{" "}
              {statisticalForTrip.data.customerName}
            </div>
          </Col>
        </Row>

        <Grid
          rows={statisticalForTrip.data.data}
          columns={statisticalForTrip.data.tieuDeBang}
          getRowId={getRowId}
        >
          <Table
            cellComponent={this.renderCellComponent}
            columnExtensions={[
              { columnName: "tuyenDuong", wordWrapEnabled: true, width: 150 }
            ]}
          />
          <TableHeaderRow
            titleComponent={props => {
              const cStyle = {
                ...props.style,
                fontSize: 16,
                color: "#000",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center"
              };
              return <TableHeaderRow.Content {...props} style={cStyle} />;
            }}
          />
        </Grid>
        <div className="d-flex justify-content-end align-items-end mt-3">
          <Button
            disabled={bookingStatus === 600 ? true : false}
            type={bookingStatus === 600 ? "default" : "primary"}
            onClick={this.onAccept}
          >
            {bookingStatus === 600 ? "Đã xác nhận" : "Xác nhận"}
          </Button>
        </div>
      </div>
    );
  }
}
export default StatisticalCostForTrip;
