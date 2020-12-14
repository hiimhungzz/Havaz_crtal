import React, { useState, memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import { Select, Spin } from "antd";
import _ from "lodash";
import moment from "moment";
import { DriverSelect, VehicleSelect } from "@Components/Utility/common";
import Partner from "@Components/SelectContainer/Partner";
import SubDriver from "@Components/SelectContainer/SubDriver";
import { Ui } from "@Helpers/Ui";
import {
  DialogTitle,
  Dialog,
  Button,
  Slide,
  DialogContent,
  DialogActions,
  Grid,
} from "@material-ui/core";
import ServiceBase from "@Services/ServiceBase";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const PartnerOp = memo(
  ({
    drivers,
    setDrivers,
    subDrivers,
    setSubDrivers,
    vehicles,
    setVehicles,
    partners,
    setPartners,
    isFetchingLinkedTrip,
    listLinkedTripSelected,
    setListLinkedTripSelected,
    listLinkedTrip,
  }) => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <label>Chọn chủ xe</label>
        </Grid>
        <Grid item xs={9}>
          <Partner
            value={partners}
            mode="single"
            onSelect={(partner) => {
              setPartners(partner);
              setVehicles(undefined);
              setDrivers(undefined);
              setSubDrivers([]);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Chọn xe</label>
        </Grid>
        <Grid item xs={9}>
          <VehicleSelect
            partnerUuid={partners ? partners.key : ""}
            value={vehicles}
            mode={"single"}
            onSelect={(vehicle) => setVehicles(vehicle)}
          />
        </Grid>

        <Grid item xs={3}>
          <label>Chọn lái xe</label>
        </Grid>
        <Grid item xs={9}>
          <DriverSelect
            partnerUuid={partners ? partners.key : ""}
            value={drivers}
            mode={"single"}
            onSelect={(driver) => setDrivers(driver)}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Chọn tiếp viên</label>
        </Grid>
        <Grid item xs={9}>
          <SubDriver
            organizationId={partners ? partners.key : ""}
            value={subDrivers}
            mode="multiple"
            onSelect={(subDriver) => setSubDrivers(subDriver)}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Chọn ngày</label>
        </Grid>
        <Grid item xs={9}>
          <Select
            loading={isFetchingLinkedTrip}
            labelInValue
            showArrow
            value={listLinkedTripSelected}
            onChange={(listLinkedTripSelected) =>
              setListLinkedTripSelected(listLinkedTripSelected)
            }
            mode="multiple"
            notFoundContent={
              isFetchingLinkedTrip ? <Spin size="small" /> : null
            }
            filterOption={false}
            style={{ width: "100%" }}
          >
            {listLinkedTrip.map((d) => (
              <Select.Option key={d.uuid}>
                {d.code} - {moment(d.pickUpAt).format("DD/MM/YYYY")}
              </Select.Option>
            ))}
          </Select>
        </Grid>
      </Grid>
    );
  }
);

const OperatingOnDrag = memo(
  ({ classes, onClose, vehicle, trip, active, dustInfo, ...other }) => {
    const [listLinkedTripSelected, setListLinkedTripSelected] = useState({});
    const [partners, setPartners] = useState({});
    const [listLinkedTrip, setListLinkedTrip] = useState([]);
    const [vehicles, setVehicles] = useState(undefined);
    const [drivers, setDrivers] = useState(undefined);
    const [subDrivers, setSubDrivers] = useState(undefined);
    const [isFetchingLinkedTrip, setIsFetchingLinkedTrip] = useState(false);
    let step = 0;
    const handleConfirm = () => {
      Promise.all(
        _.map(listLinkedTripSelected, (tripId) => {
          return ServiceBase.requestJson({
            method: "POST",
            url: "/scheduler/trip/update",
            data: {
              partnerUuid:
                [6, 8].includes(step) || dustInfo.isTrash
                  ? ""
                  : partners
                  ? partners.key
                  : "",
              tripId: tripId.key,
              vehicleId: active && vehicles ? vehicles.key : "",
              driverId: active && drivers ? drivers.key : "",
              subDriverId:
                active && subDrivers && subDrivers.length > 0
                  ? subDrivers[0].key
                  : "",
            },
          });
        })
      )
        .then((results) => {
          let successResult = _.filter(
            results,
            (x) =>
              x.value && x.value.message === "Gán Lệnh cho lái xe thành công."
          );
          let failureResult = _.filter(results, (x) => x.errors.length > 0);
          _.map(successResult, (result) => {
            Ui.showSuccess({ message: "Gán Lệnh cho lái xe thành công." });
          });
          Ui.showErrors(failureResult.map((x) => x.errors.toString()));
          onClose();
        })
        .catch((errors) => {
          console.log(errors);
        });
    };
    if (!other.open) {
      return null;
    }
    let findedVehicle = vehicle.find((x) => x.vehicleId === trip.vehicleId);
    let findedDriver = null;
    if (findedVehicle) {
      findedDriver = findedVehicle.drivers.find(
        (x) => x.driverId === trip.driverId
      );
    }
    let title = "";
    if (active && dustInfo.isPartner === false && trip.isPartner === false) {
      // Gán trip nhà cho xe và lái xe nhà
      step = 1;
    } else if (
      active === false &&
      dustInfo.isPartner === false &&
      trip.isPartner === false
    ) {
      // Hủy trip nhà về hàng chờ nhà
      step = 2;
    } else if (
      active === false &&
      dustInfo.isPartner &&
      trip.isPartner === false
    ) {
      // Gán trip nhà vào hàng chờ CTV
      step = 3;
    } else if (
      active === true &&
      dustInfo.isPartner &&
      trip.isPartner === false
    ) {
      // Gán trip nhà cho xe và lái xe CTV
      step = 4;
    } else if (active === false && dustInfo.isPartner && trip.isPartner) {
      // Hủy trip CTV đã gán xe và lái về hàng chờ CTV
      step = 5;
    } else if (
      active === false &&
      dustInfo.isPartner === false &&
      trip.isPartner
    ) {
      // Hủy trip từ hàng chờ CTV về hàng chờ nhà
      step = 6;
    } else if (active === true && dustInfo.isPartner && trip.isPartner) {
      // Gán trip từ hàng chờ CTV cho xe và lái xe CTV
      step = 7;
    } else if (
      active === true &&
      dustInfo.isPartner === false &&
      trip.isPartner
    ) {
      // Gán trip CTV cho xe và lái xe nhà
      step = 8;
    } else if (
      active === true &&
      !dustInfo.isPartner &&
      (trip.isPartner || !trip.isPartner)
    ) {
      // Gán trip CTV cho xe và lái xe nhà
      step = 9;
    }

    if ([1, 3, 4, 7, 8, 9].includes(step)) {
      if (step === 3 || step === 9) {
        title = (
          <DialogTitle
            classes={{ root: classes.title }}
            id="simple-dialog-title"
          >
            Bạn xác nhận gán lộ trình tuyến <b>{trip.fixedRouteCode}</b> của
            booking <b>{trip.codeBooking}</b> vào hàng chờ cho:
          </DialogTitle>
        );
      } else {
        title = (
          <DialogTitle
            classes={{ root: classes.title }}
            id="simple-dialog-title"
          >
            Bạn xác nhận gán lộ trình tuyến <b>{trip.fixedRouteCode}</b> của
            booking <b>{trip.codeBooking}</b> cho:
          </DialogTitle>
        );
      }
    } else {
      if (step === 2) {
        title = (
          <DialogTitle
            classes={{ root: classes.title }}
            id="simple-dialog-title"
          >
            Bạn xác nhận hủy chọn xe
            <b>{findedVehicle ? findedVehicle.vehicleName : ""}</b> và lái xe
            <b>{findedDriver ? findedDriver.driverName : ""}</b> của booking
            <b>{trip.codeBooking}</b> về hàng chờ loại xe tại các ngày:
          </DialogTitle>
        );
      } else if (step === 5) {
        if (trip.partnerUuid !== dustInfo.partnerUuid) {
          title = (
            <DialogTitle
              classes={{ root: classes.title }}
              id="simple-dialog-title"
            >
              Bạn xác nhận gán lộ trình tuyến <b>{trip.fixedRouteCode}</b> của
              booking <b>{trip.codeBooking}</b> vào từ hàng chờ CTV{" "}
              {trip.partnerName} vào hàng CTV {dustInfo.partnerName}:
            </DialogTitle>
          );
        } else {
          title = (
            <DialogTitle
              classes={{ root: classes.title }}
              id="simple-dialog-title"
            >
              Bạn xác nhận hủy chọn xe
              <b>{findedVehicle ? findedVehicle.vehicleName : ""}</b> và lái xe
              <b>{findedDriver ? findedDriver.driverName : ""}</b> của booking
              <b>{trip.codeBooking}</b> vào hàng chờ CTV {dustInfo.partnerName}
              tại các ngày:
            </DialogTitle>
          );
        }
      } else {
        title = (
          <DialogTitle
            classes={{ root: classes.title }}
            id="simple-dialog-title"
          >
            Bạn xác nhận hủy chọn xe
            <b>{findedVehicle ? findedVehicle.vehicleName : ""}</b> và lái xe
            <b>{findedDriver ? findedDriver.driverName : ""}</b> của booking
            <b>{trip.codeBooking}</b>{" "}
            {dustInfo.isTrash === true || step === 6
              ? " về hàng chờ loại xe "
              : ""}
            tại các ngày:
          </DialogTitle>
        );
      }
    }
    return (
      <Dialog
        classes={{ paper: classes.dialog }}
        onClose={onClose}
        onEnter={() => {
          if (dustInfo.isPartner) {
            setPartners({
              key: dustInfo.partnerUuid,
              label: dustInfo.partnerName,
            });
          }
          setDrivers(
            dustInfo.driverId
              ? { key: dustInfo.driverId, label: dustInfo.driverName }
              : undefined
          );
          setVehicles(
            dustInfo.vehicleId
              ? { key: dustInfo.vehicleId, label: dustInfo.vehicleName }
              : undefined
          );
          setSubDrivers(
            dustInfo.subDrivers
              ? _.map(dustInfo.subDrivers, (x) => ({
                  key: x.uuid,
                  label: x.name,
                }))
              : []
          );
          setListLinkedTripSelected(
            trip
              ? [
                  {
                    key: trip.tripId,
                    label: (
                      <div className="kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger">
                        &nbsp;&nbsp;&nbsp;&nbsp; ...Đang lấy dữ liệu
                      </div>
                    ),
                  },
                ]
              : []
          );
          setTimeout(async () => {
            setIsFetchingLinkedTrip(true);
            let result = await ServiceBase.requestJson({
              url: "/booking/linked/trips/list",
              method: "POST",
              data: {
                uuid: trip.tripId,
              },
            });
            if (result.hasErrors) {
              Ui.showErrors(result.errors);
            } else {
              setListLinkedTrip(result.value.data);
            }
            setIsFetchingLinkedTrip(false);
          }, 150);
        }}
        fullWidth={true}
        maxWidth={"sm"}
        aria-labelledby="max-width-dialog-title"
        aria-describedby="alert-dialog-slide-description"
        TransitionComponent={Transition}
        {...other}
      >
        {title}
        <DialogContent>
          <Grid container>
            {(dustInfo.isPartner || step === 9) &&
            dustInfo.isCancel !== true ? (
              <PartnerOp
                partners={partners}
                setPartners={setPartners}
                drivers={drivers}
                setDrivers={setDrivers}
                subDrivers={subDrivers}
                setSubDrivers={setSubDrivers}
                vehicles={vehicles}
                setVehicles={setVehicles}
                listLinkedTrip={listLinkedTrip}
                listLinkedTripSelected={listLinkedTripSelected}
                setListLinkedTripSelected={setListLinkedTripSelected}
                isFetchingLinkedTrip={isFetchingLinkedTrip}
              />
            ) : active ? (
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <label>Chọn xe</label>
                  </Grid>
                  <Grid item xs={9}>
                    <VehicleSelect
                      value={vehicles}
                      mode={"single"}
                      onSelect={(vehicle) => setVehicles(vehicle)}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <label>Chọn lái xe</label>
                  </Grid>
                  <Grid item xs={9}>
                    <DriverSelect
                      value={drivers}
                      mode={"single"}
                      onSelect={(driver) => setDrivers(driver)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <label>Chọn tiếp viên</label>
                  </Grid>
                  <Grid item xs={9}>
                    <SubDriver
                      organizationId={partners ? partners.key : ""}
                      value={subDrivers}
                      mode="multiple"
                      onSelect={(subDriver) => setSubDrivers(subDriver)}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <label>Chọn ngày</label>
                  </Grid>
                  <Grid item xs={9}>
                    <Select
                      loading={isFetchingLinkedTrip}
                      labelInValue
                      showArrow
                      value={listLinkedTripSelected}
                      onChange={(listLinkedTripSelected) =>
                        setListLinkedTripSelected(listLinkedTripSelected)
                      }
                      mode="multiple"
                      notFoundContent={
                        isFetchingLinkedTrip ? <Spin size="small" /> : null
                      }
                      filterOption={false}
                      style={{ width: "100%" }}
                    >
                      {listLinkedTrip.map((d) => (
                        <Select.Option key={d.uuid}>
                          {d.code} - {moment(d.pickUpAt).format("DD/MM/YYYY")}
                        </Select.Option>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={3}>
                    <label>Chọn ngày</label>
                  </Grid>
                  <Grid item xs={9}>
                    <Select
                      loading={isFetchingLinkedTrip}
                      showArrow
                      labelInValue
                      value={listLinkedTripSelected}
                      onChange={(listLinkedTripSelected) => {
                        setListLinkedTripSelected(listLinkedTripSelected);
                      }}
                      mode="multiple"
                      notFoundContent={
                        isFetchingLinkedTrip ? <Spin size="small" /> : null
                      }
                      filterOption={false}
                      style={{ width: "100%" }}
                    >
                      {listLinkedTrip.map((d) => (
                        <Select.Option key={d.uuid}>
                          {d.code
                            ? `${d.code} - ${
                                d.pickUpAt
                                  ? moment(d.pickUpAt).format("DD/MM/YYYY")
                                  : null
                              }`
                            : `${
                                d.pickUpAt
                                  ? moment(d.pickUpAt).format("DD/MM/YYYY")
                                  : null
                              }`}
                        </Select.Option>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            classes={{ label: classes.button }}
            onClick={handleConfirm}
            color="primary"
          >
            Xác nhận
          </Button>
          <Button
            classes={{ label: classes.button }}
            onClick={onClose}
            color="secondary"
          >
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  label: {
    fontSize: 14,
  },
  primary: {
    fontSize: 18,
  },
  button_root: {
    padding: 5,
  },
  button: {
    width: "100%",
    fontSize: 15,
  },
  dialog: {
    minWidth: "250px",
    // minHeight: '400px',
  },
  title: {
    "& h2": {
      textAlign: "center",
      fontSize: 20,
    },
    "& h2 svg": {
      float: "left",
      cursor: "pointer",
    },
  },
};
export default withStyles(styles)(OperatingOnDrag);
