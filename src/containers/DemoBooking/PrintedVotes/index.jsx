import React, { Component } from "react";
import { Row, Col, Spin, Button, Select } from "antd";
import moment from "moment";
import {
  Grid,
  Table,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";

import { Ui } from "@Helpers/Ui";
import { API_URI } from "@Constants";
import ServiceBase from "@Services/ServiceBase";
import "./style.scss";
import _ from "lodash";
import logo from "./img/logo.HV.png";

class PrintedVotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valuePlate: undefined,
      valuePartner: undefined,
      valueDriver: undefined,
      searchPlate: false,
      searchDriver: true,
      searchPartner: false,
      showDriver: false,
      dataBookingTrips: []
    };
  }
  async componentDidMount() {
    if (this.props.bookingId) {
      let result = await ServiceBase.requestJson({
        url: API_URI.GET_BOOKING_BY_UUID,
        method: "POST",
        data: { uuid: this.props.bookingId }
      });
      if (!result.hasErrors) {
        this.setState({
          statisticalForTrip: { data: result.value.data },
          dataBookingTrips: result.value.data.detailRoute.map((item, index) => {
            return {
              id: index + 1,
              dropOffAt: item.dropOffAt
                ? moment(item.dropOffAt).format("DD-MM-YYYY")
                : "",
              fixedRoutesName: item.fixedRoutesName,
              vehicleCode: item.vehicleCode,
              vehicleTime: item.vehicleTime
                ? moment(item.vehicleTime, "HH:mm:ss").format("hh:mm")
                : "",
              timePickup: item.timePickup
                ? moment(item.timePickup, "HH:mm:ss").format("hh:mm")
                : "",
              locationPickup: item.locationPickup,
              distance: item.distance,
              label: item.plate,
              driverId: item.driverId,
              driverName: item.driverName,
              requireVehiclesType: item.requireVehiclesType,
              key: item.vehicleId,
              plate: item.plate,
              partnerCode: item.partnerCode,
              costPerKm: item.costPerKm ? item.costPerKm.toLocaleString() : "",
              partnersDistance: "",
              partnersCostPerKm: "",
              perDay: ""
            };
          }),
          dataDetail: result.value.data.detailRoute.map((item, index) => {
            return {
              id: index + 1,
              dropOffAt: item.dropOffAt
                ? moment(item.dropOffAt).format("DD-MM-YYYY")
                : "",
              fixedRoutesName: item.fixedRoutesName,
              vehicleCode: item.vehicleCode,
              vehicleTime: item.vehicleTime
                ? moment(item.vehicleTime, "HH:mm:ss").format("hh:mm")
                : "",
              timePickup: item.timePickup
                ? moment(item.timePickup, "HH:mm:ss").format("hh:mm")
                : "",
              locationPickup: item.locationPickup,
              distance: item.distance,
              label: item.plate,
              driverId: item.driverId,
              driverName: item.driverName,
              requireVehiclesType: item.requireVehiclesType,
              key: item.vehicleId,
              plate: item.plate,
              partnerCode: item.partnerCode,
              costPerKm: item.costPerKm ? item.costPerKm.toLocaleString() : "",
              partnersDistance: "",
              partnersCostPerKm: "",
              perDay: ""
            };
          })
        });
      } else {
        Ui.showErrors(result.errors);
      }
    }
  }

  renderCellComponent = props => {
    const nameColumn = props.column.name;
    return (
      <Table.Cell
        {...props}
        style={{ fontSize: 14, color: "#000", border: "1px solid #999999" }}
        className="customer_table"
      />
    );
  };
  // select BKS
  onChange = async key => {
    let dataTrips = this.state.statisticalForTrip.data.detailRoute;
    const { valueDriver, valuePartner } = this.state;
    let objSearch = new Object();
    if (key) {
      objSearch = { vehicleId: key };
    }
    let dataSearchBooking = new Object();
    if (valueDriver) {
      let dataDriver = { driverId: valueDriver };
      dataSearchBooking = Object.assign(objSearch, dataDriver);
    }
    if (valuePartner) {
      let dataPartner = { partnerCode: valuePartner };
      dataSearchBooking = Object.assign(objSearch, dataPartner);
    } else {
      dataSearchBooking = objSearch;
    }

    let dataSearch = _.filter(dataTrips, dataSearchBooking);
    let data = await dataSearch.map((item, index) => {
      return {
        id: index + 1,
        dropOffAt: item.dropOffAt
          ? moment.utc(item.dropOffAt).format("DD-MM-YYYY")
          : "",
        fixedRoutesName: item.fixedRoutesName,
        vehicleCode: item.vehicleCode,
        vehicleTime: item.vehicleTime,
        timePickup: item.timePickup,
        locationPickup: item.locationPickup,
        distance: item.distance,
        driverName: item.driverName,
        requireVehiclesType: item.requireVehiclesType,
        label: item.plate,
        driverId: item.driverId,
        key: item.vehicleId,
        plate: item.plate,
        partnerCode: item.partnerCode,
        costPerKm: item.costPerKm ? item.costPerKm.toLocaleString() : "",
        partnersDistance: item.partnersDistance
          ? item.partnersDistance.toLocaleString()
          : "",
        partnersCostPerKm: item.partnersCostPerKm
          ? item.partnersCostPerKm.toLocaleString()
          : "",
        perDay: ""
      };
    });

    this.setState({
      dataBookingTrips: data,
      valuePlate: key
    });
  };
  // select lái xe
  onChangeDriver = async key => {
    let dataTrips = this.state.statisticalForTrip.data.detailRoute;
    const { valuePlate, valuePartner } = this.state;
    let objSearch = new Object();
    if (key) {
      objSearch = { driverId: key };
    }
    let dataSearchBooking = new Object();
    if (valuePlate) {
      let dataVehicle = { vehicleId: valuePlate };
      dataSearchBooking = Object.assign(objSearch, dataVehicle);
    }
    if (valuePartner) {
      let dataPartner = { partnerCode: valuePartner };
      dataSearchBooking = Object.assign(objSearch, dataPartner);
    } else {
      dataSearchBooking = objSearch;
    }
    let dataSearch = _.filter(dataTrips, dataSearchBooking);

    let data = await dataSearch.map((item, index) => {
      return {
        id: index + 1,
        dropOffAt: item.dropOffAt
          ? moment.utc(item.dropOffAt).format("DD-MM-YYYY")
          : "",
        fixedRoutesName: item.fixedRoutesName,
        vehicleCode: item.vehicleCode,
        vehicleTime: item.vehicleTime,
        timePickup: item.timePickup,
        locationPickup: item.locationPickup,
        distance: item.distance,
        driverName: item.driverName,
        requireVehiclesType: item.requireVehiclesType,
        label: item.plate,
        driverId: item.driverId,
        key: item.vehicleId,
        plate: item.plate,
        partnerCode: item.partnerCode,
        costPerKm: item.costPerKm ? item.costPerKm.toLocaleString() : "",
        partnersDistance: item.partnersDistance
          ? item.partnersDistance.toLocaleString()
          : "",
        partnersCostPerKm: item.partnersCostPerKm
          ? item.partnersCostPerKm.toLocaleString()
          : "",
        perDay: ""
      };
    });

    this.setState({
      dataBookingTrips: data,
      valueDriver: key,
      showDriver: true
    });
  };
  // select CTV
  onChangePartner = async key => {
    let dataTrips = this.state.statisticalForTrip.data.detailRoute;

    const { valuePlate, valueDriver } = this.state;
    let objSearch = new Object();
    if (key) {
      objSearch = { partnerCode: key };
    }
    let dataSearchBooking = new Object();
    if (valuePlate) {
      let dataVehicle = { vehicleId: valuePlate };
      dataSearchBooking = Object.assign(objSearch, dataVehicle);
    }
    if (valueDriver) {
      let dataDriver = { driverId: valueDriver };
      dataSearchBooking = Object.assign(objSearch, dataDriver);
    } else {
      dataSearchBooking = objSearch;
    }
    let dataSearch = _.filter(dataTrips, dataSearchBooking);
    let data = await dataSearch.map((item, index) => {
      return {
        id: index + 1,
        dropOffAt: item.dropOffAt
          ? moment(item.dropOffAt).format("DD-MM-YYYY")
          : "",
        fixedRoutesName: item.fixedRoutesName,
        vehicleCode: item.vehicleCode,
        vehicleTime: item.vehicleTime,
        timePickup: item.timePickup,
        locationPickup: item.locationPickup,
        distance: item.distance,
        driverName: item.driverName,
        requireVehiclesType: item.requireVehiclesType,
        label: item.plate,
        driverId: item.driverId,
        key: item.vehicleId,
        plate: item.plate,
        partnerCode: item.partnerCode,
        costPerKm: item.costPerKm ? item.costPerKm.toLocaleString() : "",
        partnersDistance: item.partnersDistance
          ? item.partnersDistance.toLocaleString()
          : "",
        partnersCostPerKm: item.partnersCostPerKm
          ? item.partnersCostPerKm.toLocaleString()
          : "",
        perDay: ""
      };
    });
    this.setState({
      dataBookingTrips: data,
      valuePartner: key
    });
  };
  //xóa bộ lọc
  onClick = () => {
    this.setState({
      valueDriver: undefined,
      valuePlate: undefined,
      valuePartner: undefined,
      dataBookingTrips: this.state.dataDetail,
      showDriver: false
    });
  };
  render() {
    const {
      statisticalForTrip,
      valuePlate,
      valuePartner,
      valueDriver,
      showDriver,
      dataBookingTrips
    } = this.state;
    if (!statisticalForTrip) {
      return (
        <div className="text-center">
          <Spin spinning={true} tip="Đang lấy dữ liệu..." />
        </div>
      );
    }
    const labelParden = { fontWeight: "bold", fontSize: 17, color: "#000" };
    const labelStyle = { color: "#000", fontSize: 14 };
    let objBooking = statisticalForTrip.data.detailRoute.map(item => {
      return {
        label: item.plate,
        driverId: item.driverId,
        driverName: item.driverName,
        requireVehiclesType: item.requireVehiclesType,
        key: item.vehicleId,
        plate: item.plate,
        partnerCode: item.partnerCode
      };
    });
    let _dataBooking = objBooking.filter(item => item.key);
    let _dataCTV = objBooking.filter(item => item.partnerCode);
    let objDriver = new Array();
    for (let item of _dataBooking) {
      objDriver[item.driverId] = item;
    }
    // group BKS
    let dataSelect = _.chain(_dataBooking)
      .groupBy("key")
      .map(item => {
        return {
          label: _.get(_.find(item, "label"), "label"),
          key: _.get(_.find(item, "key"), "key")
        };
      })
      .value();
    //group lái xe
    let dataDriver = _.chain(_dataBooking)
      .groupBy("driverId")
      .map(item => {
        return {
          label: _.get(_.find(item, "driverName"), "driverName"),
          key: _.get(_.find(item, "driverId"), "driverId")
        };
      })
      .value();

    //group CTV
    let dataCtv = _.chain(_dataCTV)
      .groupBy("partnerCode")
      .map(item => {
        return {
          label: _.get(_.find(item, "partnerCode"), "partnerCode"),
          key: _.get(_.find(item, "partnerCode"), "partnerCode")
        };
      })
      .value();
    return (
      <div>
        <Row gutter={20}>
          <Col span={3}>
            <Select
              value={valuePlate}
              style={{ width: "100%" }}
              placeholder="Biến số"
              onChange={this.onChange}
              allowClear
            >
              {dataSelect.map(item => {
                return (
                  <Select.Option value={item.key}>{item.label}</Select.Option>
                );
              })}
            </Select>
          </Col>
          <Col span={3}>
            <Select
              value={valueDriver}
              style={{ width: "100%" }}
              placeholder="Lái xe"
              onChange={this.onChangeDriver}
              allowClear
            >
              {dataDriver.map(item => {
                return (
                  <Select.Option value={item.key}>{item.label}</Select.Option>
                );
              })}
            </Select>
          </Col>
          <Col span={3}>
            <Select
              value={valuePartner}
              style={{ width: "100%" }}
              placeholder="Mã CTV"
              onChange={this.onChangePartner}
              allowClear
            >
              {dataCtv.map(item => {
                return (
                  <Select.Option value={item.key}>{item.label}</Select.Option>
                );
              })}
            </Select>
          </Col>
          <Col span={3}>
            <Button type="link" onClick={this.onClick}>
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
        &nbsp; &nbsp; &nbsp;
        <div className="section-to-print">
          <Row gutter={15}>
            <Col span={7}>
              <Row gutter={15}>
                <Col
                  span={24}
                  className="d_flex justify_conten align_items customer_logo"
                >
                  <img
                    src={logo}
                    alt="Flowers in Chania"
                    height="50"
                    // width="120"
                  />
                </Col>
              </Row>
            </Col>
            <Col span={17}>
              <Row gutter={15}>
                <Col span={24}>
                  <h3 className="mb_0">
                    Công ty LD Vận Chuyển Quốc Tế Hải Vân - TT Tour
                  </h3>
                </Col>
                <Col span={24}>
                  <p className="font_14 mb_0">
                    ĐC: 10.15 Lương Thế VInh - Khu đô thị mới phía đông - TP.Hải
                    Dương
                  </p>
                </Col>
                <Col span={24}>
                  <p className="font_14">
                    Hà Nội :03203550156 * Sài Gòn :0437223577
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={15} className="mb_10">
            <Col span={24}>
              <h2 className="text-center mb-5 customer-size">
                PHIẾU XÁC NHẬN DỊCH VỤ
              </h2>
            </Col>
          </Row>

          <Row gutter={15}>
            <Col span={24} className="mb_10">
              <Row gutter={15}>
                <Col span={24}>
                  <div style={labelParden}>1.THÔNG TIN KHÁCH HÀNG</div>
                </Col>
                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Tên KH:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.enterprise}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Mã KH:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.enterpriseCode}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Địa chỉ:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.contactAddress}
                    </span>
                  </div>
                </Col>

                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Loại KH:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.typeContact}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Liên hệ:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.contactName}
                    </span>
                  </div>
                </Col>

                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">SĐT:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.contactPhone}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Email:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.contactEmail}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={15}>
                <Col span={24}>
                  <div style={labelParden}>2.THÔNG TIN ĐOÀN</div>
                </Col>
                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Code Đoàn:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.code}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Số khách:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.guestNumber}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Tên KH/Quốc gia:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.nameCountry}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Xếp hạng:</b>
                    <div className="width_60">
                      {" "}
                      <span>{statisticalForTrip.data.rating}</span>
                      <i className="customer_icon fa fa-star"></i>
                    </div>
                  </div>
                </Col>

                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Ngày IN:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.dateIn
                        ? moment(statisticalForTrip.data.dateIn).format(
                            "DD-MM-YYYY"
                          )
                        : ""}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Tên HDV:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.guideName}
                    </span>
                  </div>
                </Col>

                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Ngày OUT:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.dateOut
                        ? moment(statisticalForTrip.data.dateOut).format(
                            "DD-MM-YYYY"
                          )
                        : ""}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">SĐT:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.guidePhone}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Yêu cầu đặc biệt:</b>
                    <span className="width_60">
                      {statisticalForTrip.data.note}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={24} className="mt_10">
              <Row gutter={15}>
                <Col span={24}>
                  <div style={labelParden}>3.THÔNG TIN ĐIỀU XE</div>
                </Col>
                <Col span={8}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Tên lái xe:</b>
                    <span className="width_60">
                      {showDriver && dataBookingTrips.length > 0
                        ? dataBookingTrips[0].driverName
                        : ""}
                    </span>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Biển số xe:</b>
                    <span className="width_60">
                      {showDriver && dataBookingTrips.length > 0
                        ? dataBookingTrips[0].plate
                        : ""}
                    </span>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={labelStyle} className="d_flex">
                    <b className="flex_basis">Loại xe:</b>
                    <span className="width_60">
                      {showDriver && dataBookingTrips.length > 0
                        ? dataBookingTrips[0].requireVehiclesType
                        : ""}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={24} className="mt_10">
              <b className="font_17 text_black ">CHI TIẾT LỘ TRÌNH</b>
            </Col>
          </Row>

          <Grid
            className="customer_grid"
            rows={dataBookingTrips}
            columns={[
              // {
              //   name: "id",
              //   title: ["#"]
              // },
              {
                name: "dropOffAt",
                title: ["NGÀY"]
              },
              {
                name: "fixedRoutesName",
                title: ["TUYẾN ĐƯỜNG"]
              },
              {
                name: "vehicleCode",
                title: ["MÃ CHUYẾN BAY"]
              },
              {
                name: "vehicleTime",
                title: ["GIỜ BAY"]
              },
              {
                name: "partnersDistance",
                title: ["KM"]
              },
              {
                name: "partnersCostPerKm",
                title: ["ĐƠN GIÁ(KM)"]
              },
              {
                name: "perDay",
                title: ["TỔNG TIỀN"]
              }
            ]}
          >
            <Table
              cellComponent={this.renderCellComponent}
              columnExtensions={[
                // {
                //   columnName: "id",
                //   align: "left",
                //   wordWrapEnabled: true,
                //   width: 50
                // },
                {
                  columnName: "dropOffAt",
                  wordWrapEnabled: true,
                  width: 150
                },
                {
                  columnName: "vehicleCode",
                  wordWrapEnabled: true,
                  width: 150
                },
                {
                  columnName: "fixedRoutesName",
                  wordWrapEnabled: true
                },
                // {
                //   columnName: "distance",
                //   wordWrapEnabled: true,
                //   width: 80
                // },
                {
                  columnName: "locationPickup",
                  wordWrapEnabled: true
                },
                {
                  columnName: "costPerKm",
                  wordWrapEnabled: true,
                  width: 150
                },
                {
                  columnName: "partnersDistance",
                  wordWrapEnabled: true,
                  textAlign: "right",
                  width: 100
                },
                {
                  columnName: "partnersCostPerKm",
                  wordWrapEnabled: true,
                  textAlign: "right",
                  width: 140
                },
                {
                  columnName: "perDay",
                  wordWrapEnabled: true,
                  textAlign: "right",
                  width: 130
                }
              ]}
            />
            <TableHeaderRow
              className="customer_header"
              cellComponent={props => {
                return (
                  <TableHeaderRow.Cell
                    {...props}
                    style={{
                      ...props.style,
                      fontSize: 16,
                      color: "#000",
                      background: "#f2f3f8",
                      border: "1px solid #999999"
                    }}
                  />
                );
              }}
            />
          </Grid>
        </div>
        <div>
          <Button
            className="mt_10"
            type="primary"
            icon="cloud-download"
            onClick={() => window.print()}
            id="print"
          >
            In Phiếu
          </Button>
        </div>
      </div>
    );
  }
}

export default PrintedVotes;
