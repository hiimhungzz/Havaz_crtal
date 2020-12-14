import React, { memo, useState, useCallback, useEffect } from "react";
import { Modal, Checkbox, Input, DatePicker, TimePicker, Button } from "antd";
import _ from "lodash";
import classNames from "classnames";
import { Map } from "immutable";
import { Paper, Grid as CoreGrid } from "@material-ui/core";
import A from "@Components/A";
import { CustomizeTableHeaderRow, TableCell } from "components/Utility/common";
import {
  Grid,
  Table,
  TableColumnReordering,
  TableGroupRow,
} from "@devexpress/dx-react-grid-material-ui";
import {
  IntegratedPaging,
  IntegratedGrouping,
  PagingState,
  GroupingState,
} from "@devexpress/dx-react-grid";
import { checkMoment, momentRange } from "helpers/utility";
import { DATE_TIME_FORMAT, minutesInHour, hoursInDay } from "constants/common";
import { Ui } from "@Helpers/Ui";
import ServiceBase from "@Services/ServiceBase";
import I from "components/I";
import RouteNoOrg from "components/SelectContainer/RouteNoOrg";
import Vehicle from "components/SelectContainer/Vehicle";
import Driver from "components/SelectContainer/Driver";
import * as Yup from "yup";
import moment from "moment";
import RouteContract from "components/SelectContainer/RouteContract";
const bookingSchema = Yup.object().shape({
  bookingCode: Yup.string().required("*Trường bắt buộc"),
  startDate: Yup.object().required("*Trường bắt buộc"),
  endDate: Yup.object().required("*Trường bắt buộc"),
  startTime: Yup.object().required("*Trường bắt buộc"),
  endTime: Yup.string().required("*Trường bắt buộc"),
  route: Yup.object().shape({
    key: Yup.string().required("*Trường bắt buộc"),
  }),
  vehicle: Yup.object().shape({
    key: Yup.string().required("*Trường bắt buộc"),
  }),
  driver: Yup.object().shape({
    key: Yup.string().required("*Trường bắt buộc"),
  }),
  weekDay: Yup.array().required("*Chưa chọn ngày.").min(1, "*Chưa chọn ngày."),
});
const StubCell = ({ tableRow, contract }) => {
  const [booking, setBooking] = useState(
    Map({
      bookingCode: "",
      route: {
        key: _.get(tableRow, "row.fixedRouteId"),
        label: _.get(tableRow, "row.fixedRouteName"),
      },
      vehicle: undefined,
      driver: undefined,
      startDate: undefined,
      endDate: undefined,
      startTime: undefined,
      endTime: undefined,
      weekDay: [],
    })
  );
  const [isFetching, setFetching] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [bookingErrors, setBookingErrors] = useState(Map());

  /**
   * _handleDisabledHour: Validate startTime && endTime
   */
  const _handleDisabledHour = useCallback(
    (name) => {
      if (name === "startTime") {
        if (booking.get("endTime")) {
          let endTimeHour = booking.get("endTime").hour();
          let endTimeMinute = booking.get("endTime").minute();
          if (endTimeMinute > 0) {
            // Lấy <= giờ được so sánh
            return _.slice(hoursInDay, endTimeHour + 1, hoursInDay.length);
          } else {
            // Lấy < giờ được so sánh
            return _.slice(hoursInDay, endTimeHour, hoursInDay.length);
          }
        }
        return [];
      } else if (name === "endTime") {
        if (booking.get("startTime")) {
          let startTimeHour = booking.get("startTime").hour();
          let startTimeMinute = booking.get("startTime").minute();
          if (startTimeMinute < 59) {
            // Lấy >= giờ được so sánh
            return _.slice(hoursInDay, 0, startTimeHour);
          } else {
            // Lấy > giờ được so sánh
            return _.slice(hoursInDay, 0, startTimeHour + 1);
          }
        }
        return [];
      }
      return [];
    },
    [booking]
  );
  /**
   * _handleDisabledMinute: Validate startTime && endTime
   */
  const _handleDisabledMinute = useCallback(
    (selectedHour, name) => {
      if (name === "startTime") {
        if (booking.get("endTime")) {
          let endTimeHour = booking.get("endTime").hour();
          let endTimeMinute = booking.get("endTime").minute();
          if (endTimeHour === selectedHour) {
            // Lấy <= phút được so sánh
            return _.slice(minutesInHour, endTimeMinute, minutesInHour.length);
          }
        }
        return [];
      } else if (name === "endTime") {
        if (booking.get("startTime")) {
          let startTimeHour = booking.get("startTime").hour();
          let startTimeMinute = booking.get("startTime").minute();
          if (startTimeHour === selectedHour) {
            // Lấy >= giờ được so sánh
            return _.slice(minutesInHour, 0, startTimeMinute + 1);
          }
        }
        return [];
      }
      return [];
    },
    [booking]
  );

  const _handleShowModal = useCallback(() => {
    setIsShow(true);
  }, []);
  const _handleOk = useCallback(async () => {
    let jsData = booking.toJS();
    let startTime = checkMoment(_.get(jsData, "startTime"));
    let startTimeStr = null;
    if (startTime && moment.isMoment(startTime)) {
      startTimeStr = startTime.format(DATE_TIME_FORMAT.HH_MM);
    }
    let endTime = checkMoment(_.get(jsData, "endTime"));
    let endTimeStr = null;
    if (endTime && moment.isMoment(endTime)) {
      endTimeStr = endTime.format(DATE_TIME_FORMAT.HH_MM);
    }
    let bookingCode = `${contract.get("contractNumber")}/${_.get(
      tableRow,
      "row.vehicleTypeName"
    )}/${_.get(jsData, "bookingCode")}`;
    let data = {
      bookingCode: bookingCode,
      contractId: contract.get("uuid"),
      customerId: contract.get("organizationId"),
      routeId: _.get(jsData, "route.key"),
      vehicleId: _.get(jsData, "vehicle.key"),
      driverId: _.get(jsData, "driver.key"),
      startDate: _.get(jsData, "startDate").format(DATE_TIME_FORMAT.YYYY_MM_DD),
      endDate: _.get(jsData, "endDate").format(DATE_TIME_FORMAT.YYYY_MM_DD),
      startTime: startTimeStr,
      endTime: endTimeStr,
      weekDay: _.get(jsData, "weekDay"),
    };

    setFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: "/booking-enterprise",
      data: data,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: "Tạo booking thành công." });
      setIsShow(false);
    }
    setFetching(false);
  }, [booking, contract, tableRow]);
  const _handleCancel = useCallback(() => {
    setIsShow(false);
  }, []);
  useEffect(() => {
    bookingSchema
      .validate(booking.toJS(), {
        abortEarly: false,
      })
      .then(() => {
        setBookingErrors((prevState) => {
          let nextState = prevState;
          nextState = nextState.clear();
          return nextState;
        });
      })
      .catch((err) => {
        let tempErrors = {};
        _.map(err.inner, (ner) => {
          _.set(tempErrors, ner.path, ner.message);
        });
        setBookingErrors((prevState) => {
          let nextState = prevState;
          nextState = nextState.clear();
          _.forEach(tempErrors, (tempValue, tempKey) => {
            nextState = nextState.set(tempKey, tempValue);
          });
          return nextState;
        });
      });
  }, [booking]);
  return (
    <Table.StubCell>
      <div className="ml-1 d-flex justify-content-center">
        <A title="Tạo booking" onClick={_handleShowModal}>
          <I className="fa fa-ticket-alt" />
        </A>
      </div>
      <Modal
        destroyOnClose={true}
        width={1200}
        title={
          <span>
            Tạo booking theo hợp đồng : <b>{contract.get("contractNumber")}</b>
          </span>
        }
        visible={isShow}
        onOk={_handleOk}
        onCancel={_handleCancel}
        footer={[
          <Button
            disabled={bookingErrors.size}
            key="submit"
            loading={isFetching}
            onClick={_handleOk}
          >
            Tạo
          </Button>,
          <Button type="danger" key="back" onClick={_handleCancel}>
            Quay lại
          </Button>,
        ]}
      >
        <CoreGrid container spacing={1}>
          <CoreGrid item xs={4}>
            <CoreGrid container spacing={1}>
              <CoreGrid item xs={12}>
                <label htmlFor="bookingCode">
                  Mã booking
                  <i className="ml-1 kt-font-danger">
                    (Số_HĐ/Loại_xe/Chiều/Xe_số/STT)
                  </i>
                </label>
              </CoreGrid>
              <CoreGrid item xs={12}>
                <Input
                  addonBefore={
                    <span className="kt-font-sm">{`${contract.get(
                      "contractNumber"
                    )} / ${_.get(tableRow, "row.vehicleTypeName")} /`}</span>
                  }
                  className={classNames({
                    "border-invalid": bookingErrors.get("bookingCode"),
                  })}
                  placeholder="Nhập Chiều/Xe_số/STT"
                  name="bookingCode"
                  value={booking.get("bookingCode")}
                  onChange={(e) => {
                    let value = e.target.value;
                    setBooking((prevState) =>
                      prevState.set("bookingCode", value)
                    );
                  }}
                />
              </CoreGrid>
            </CoreGrid>
          </CoreGrid>
          <CoreGrid item xs={5}>
            <CoreGrid container spacing={1}>
              <CoreGrid item xs={12}>
                <label htmlFor="codeBooking">Tuyến đường</label>
              </CoreGrid>
              <CoreGrid item xs={12}>
                <RouteContract
                  contractId={contract.get("uuid")}
                  className={classNames({
                    "border-invalid": bookingErrors.get("route"),
                  })}
                  value={booking.get("route")}
                  onSelect={(route) =>
                    setBooking((prevState) => prevState.set("route", route))
                  }
                />
              </CoreGrid>
            </CoreGrid>
          </CoreGrid>
          <CoreGrid item xs={3}>
            <CoreGrid container spacing={1}>
              <CoreGrid item xs={12}>
                <label htmlFor="organizationsName">Tên doanh nghiệp</label>
              </CoreGrid>
              <CoreGrid item xs={12}>
                <Input
                  disabled
                  title={contract.get("organizationsName")}
                  name="organizationsName"
                  value={contract.get("organizationsName")}
                />
              </CoreGrid>
            </CoreGrid>
          </CoreGrid>
          <CoreGrid item xs={4}>
            <CoreGrid container spacing={1}>
              <CoreGrid item xs={12}>
                <label htmlFor="startDateEndDate">Thời gian áp dụng</label>
              </CoreGrid>
              <CoreGrid item xs={12}>
                <DatePicker.RangePicker
                  format={DATE_TIME_FORMAT.DD_MM_YYYY}
                  className={classNames({
                    "border-invalid": bookingErrors.get("startDate"),
                  })}
                  value={[
                    checkMoment(booking.get("startDate")),
                    checkMoment(booking.get("endDate")),
                  ]}
                  onChange={(dates) => {
                    if (dates.length > 0) {
                      setBooking((prevState) =>
                        prevState.set("startDate", dates[0].startOf("day"))
                      );
                      setBooking((prevState) =>
                        prevState.set("endDate", dates[1].endOf("day"))
                      );
                    } else {
                      setBooking((prevState) =>
                        prevState.set("startDate", undefined)
                      );
                      setBooking((prevState) =>
                        prevState.set("endDate", undefined)
                      );
                    }
                  }}
                  ranges={momentRange}
                />
              </CoreGrid>
            </CoreGrid>
          </CoreGrid>
          <CoreGrid item xs={5}>
            <CoreGrid container spacing={1}>
              <CoreGrid item xs={12}>
                <label htmlFor="startDateEndDate">BKS</label>
              </CoreGrid>
              <CoreGrid item xs={12}>
                <Vehicle
                  className={classNames({
                    "border-invalid": bookingErrors.get("vehicle"),
                  })}
                  vehicleTypeId={_.get(tableRow, "row.vehicleTypeId")}
                  value={booking.get("vehicle")}
                  onSelect={(vehicle) =>
                    setBooking((prevState) => prevState.set("vehicle", vehicle))
                  }
                />
              </CoreGrid>
            </CoreGrid>
          </CoreGrid>
          <CoreGrid item xs={3}>
            <CoreGrid container spacing={1}>
              <CoreGrid item xs={12}>
                <label htmlFor="startDateEndDate">Lái xe</label>
              </CoreGrid>
              <CoreGrid item xs={12}>
                <Driver
                  className={classNames({
                    "border-invalid": bookingErrors.get("driver"),
                  })}
                  value={booking.get("driver")}
                  onSelect={(driver) =>
                    setBooking((prevState) => prevState.set("driver", driver))
                  }
                />
              </CoreGrid>
            </CoreGrid>
          </CoreGrid>
          <CoreGrid className="mt-1" item xs={12}>
            <h6>Lịch thực hiện lặp theo</h6>
          </CoreGrid>
          <CoreGrid item xs={4}>
            <CoreGrid container spacing={1}>
              <CoreGrid className="d-flex align-items-center" item xs={2}>
                <label htmlFor="startTime">
                  Từ<span className="mark-required-color">*</span>
                </label>
              </CoreGrid>
              <CoreGrid item xs={3}>
                <TimePicker
                  className={classNames({
                    "border-invalid": bookingErrors.get("startTime"),
                  })}
                  disabledHours={() => _handleDisabledHour("startTime")}
                  disabledMinutes={(selectedHour) =>
                    _handleDisabledMinute(selectedHour, "startTime")
                  }
                  format={DATE_TIME_FORMAT.HH_MM}
                  style={{ width: "100%" }}
                  placeholder="07:00"
                  name="startTime"
                  value={booking.get("startTime")}
                  onChange={(startTime) =>
                    setBooking((prevState) =>
                      prevState.set("startTime", startTime)
                    )
                  }
                />
              </CoreGrid>
              <CoreGrid className="d-flex align-items-center" item xs={2}>
                <label htmlFor="endTime">
                  Đến<span className="mark-required-color">*</span>
                </label>
              </CoreGrid>
              <CoreGrid item xs={3}>
                <TimePicker
                  className={classNames({
                    "border-invalid": bookingErrors.get("endTime"),
                  })}
                  disabledHours={() => _handleDisabledHour("endTime")}
                  disabledMinutes={(selectedHour) =>
                    _handleDisabledMinute(selectedHour, "endTime")
                  }
                  format={DATE_TIME_FORMAT.HH_MM}
                  style={{ width: "100%" }}
                  placeholder="19:00"
                  name="endTime"
                  value={booking.get("endTime")}
                  onChange={(endTime) =>
                    setBooking((prevState) => prevState.set("endTime", endTime))
                  }
                />
              </CoreGrid>
            </CoreGrid>
          </CoreGrid>
          <CoreGrid className="d-flex" item xs={8}>
            <CoreGrid container spacing={1}>
              <CoreGrid className="d-flex align-items-center" item xs={1}>
                <label htmlFor="dayCheck">
                  Ngày<span className="mark-required-color">*</span>
                </label>
              </CoreGrid>
              <CoreGrid className="d-flex align-items-center" item xs={11}>
                <Checkbox.Group
                  value={booking.get("weekDay")}
                  onChange={(weekDay) =>
                    setBooking((prevState) => prevState.set("weekDay", weekDay))
                  }
                  options={[
                    {
                      value: "Mon",
                      label: "T2",
                    },
                    {
                      value: "Tue",
                      label: "T3",
                    },
                    {
                      value: "Wed",
                      label: "T4",
                    },
                    {
                      value: "Thu",
                      label: "T5",
                    },
                    {
                      value: "Fri",
                      label: "T6",
                    },
                    {
                      value: "Sat",
                      label: "T7",
                    },
                    {
                      value: "Sun",
                      label: "CN",
                    },
                  ]}
                />
                {_.isString(bookingErrors.get("weekDay")) && (
                  <span className="mark-required-color kt-font-sm">
                    {bookingErrors.get("weekDay")}
                  </span>
                )}
              </CoreGrid>
            </CoreGrid>
          </CoreGrid>
        </CoreGrid>
      </Modal>
    </Table.StubCell>
  );
};
const GroupCellContent = ({ column, row }) => {
  let splited = _.split(_.get(row, "value", "##$$%%"), "##$$%%");
  let vehicleTypeName = _.get(splited, 0);
  let numberVehicle = _.get(splited, 1, 0);
  return (
    <span>
      <i>{column.title}</i>: <strong>{vehicleTypeName}</strong>, <i>SL</i>:
      <strong>{` ${numberVehicle} xe`}</strong>
    </span>
  );
};
const Cell = ({ ...restProps }) => {
  return <TableCell {...restProps} />;
};

const ViewCost = memo(({ grid, contract }) => {
  console.log("contract", contract.get("contractType"))
  const [gridConfig] = useState({
    columnsDefault: [
      {
        name: "vehicleTypeIdName",
        title: "LOẠI XE",
      },
      {
        name: "fixedRouteName",
        title: "TUYẾN ĐƯỜNG",
      },
      {
        name: "id",
        title: "XE SỐ",
      },
      {
        name: "distance",
        title: "KM QL",
      },
      {
        name: "turnNumber",
        title: "SỐ LƯỢT",
      },
      {
        name: "monthlyPrice",
        title: "GIÁ THUÊ THÁNG",
      },
      {
        name: "extraTurnPrice",
        title: "GIÁ PS LƯỢT",
      },
      {
        name: "extraOTPrice",
        title: "GIÁ PS NGOÀI GIỜ",
      },
      {
        name: "extraHolidayPrice",
        title: "GIÁ PS CN,LỄ",
      },
    ],
    columnsPackage: [
      {
        name: "vehicleTypeIdName",
        title: "LOẠI XE",
      },
      {
        name: "fixedRouteName",
        title: "TUYẾN ĐƯỜNG",
      },
      {
        name: "id",
        title: "XE SỐ",
      },
      {
        name: "distance",
        title: "KM QL",
      },
      { name: "packageKM", title: "KM trọn gói" },
      {
        name: "turnNumber",
        title: "SỐ LƯỢT",
      },
      {
        name: "monthlyPrice",
        title: "GIÁ THUÊ THÁNG",
      },
      { name: "costPerKm", title: "GIÁ PS KM" },
      { name: "costPerKmByOT", title: "GIÁ OT" },
      { name: "costPerKmByHoliday", title: "GIÁ OT CN, lễ tết" },
    ],
    order: [
      "vehicleTypeIdName",
      "fixedRouteName",
      "id",
      "distance",
      "packageKM",
      "turnNumber",
      "monthlyPrice",
      "extraTurnPrice",
      "extraOTPrice",
      "extraHolidayPrice",
      "costPerKm",
      "costPerKmByOT",
      "costPerKmByHoliday"
    ],
    tableMessages: { noData: "Không có giá" },
    rowsPerPage: "Số bản ghi trên mỗi trang",
    columnExtensions: [
      { columnName: "id", wordWrapEnabled: true, align: "center", width: 60 },
      { columnName: "vehicleTypeIdName", wordWrapEnabled: true, width: 150 },
      { columnName: "fixedRouteName", wordWrapEnabled: true },
      {
        columnName: "distance",
        align: "right",
        wordWrapEnabled: true,
        width: 60,
      },
      {
        columnName: "packageKM",
        align: "right",
        wordWrapEnabled: true,
        width: 90,
      },
      { columnName: "turnNumber", align: "right", width: 80 },
      { columnName: "monthlyPrice", align: "right", width: 120 },
      { columnName: "extraTurnPrice", align: "right", width: 100 },
      { columnName: "extraOTPrice", align: "right", width: 120 },
      { columnName: "extraHolidayPrice", align: "right", width: 120 },
      { columnName: "costPerKm", align: "right", width: 120 },
      { columnName: "costPerKmByOT", align: "right", width: 120 },
      { columnName: "costPerKmByHoliday", align: "right", width: 120 },
    ],
  });

  const [grouping, setGrouping] = useState([
    { columnName: "vehicleTypeIdName" },
  ]);
  const columns = contract.get("contractType") !== '1.4' ? gridConfig.columnsDefault : gridConfig.columnsPackage;
  return (
    <Paper variant="outlined" square>
      <Grid rows={grid} columns={columns}>
        <GroupingState grouping={grouping} onGroupingChange={setGrouping} />
        <IntegratedGrouping />
        <PagingState defaultCurrentPage={0} defaultPageSize={10} />
        <IntegratedPaging />
        <Table
          messages={gridConfig.tableMessages}
          columnExtensions={gridConfig.columnExtensions}
          cellComponent={(props) => Cell(props)}
          stubHeaderCellComponent={(props) => (
            <Table.StubHeaderCell
              {...props}
              style={{ ...props.style, background: "#f2f3f8" }}
            />
          )}
          stubCellComponent={(props) => (
            <StubCell {...props} contract={contract} />
          )}
        />
        <TableColumnReordering order={gridConfig.order} />
        <CustomizeTableHeaderRow />
        <TableGroupRow contentComponent={GroupCellContent} />
      </Grid>
    </Paper>
  );
});
export default ViewCost;
