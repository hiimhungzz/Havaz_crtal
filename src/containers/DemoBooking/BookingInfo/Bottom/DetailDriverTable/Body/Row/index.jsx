import React, { memo } from "react";
import RequireVehicleType from "./Cells/RequireVehicleType";
import IsOneWay from "./Cells/IsOneWay";
import ActualVehicleType from "./Cells/ActualVehicleType";
import VehicleNumber from "./Cells/VehicleNumber";
import TripDate from "./Cells/TripDate";
import FixedRoutesId from "./Cells/FixedRoutesId";
import Distance from "./Cells/Distance";
import CostPerKm from "./Cells/CostPerKm";
import PerDay from "./Cells/PerDay";
import OverNightCost from "./Cells/OverNightCost";
import Highway from "./Cells/Highway";
import Discount from "./Cells/Discount";
import DiscountByPercentage from "./Cells/DiscountByPercentage";
import VehicleId from "./Cells/VehicleId";
import DriverId from "./Cells/DriverId";
import StewardessUuid from "./Cells/StewardessUuid";
import GuideInfo from "./Cells/GuideInfo";
import VehicleCode from "./Cells/VehicleCode";
import VehicleTime from "./Cells/VehicleTime";
import LocationPickup from "./Cells/LocationPickup";
import TimePickup from "./Cells/TimePickup";
import RouteNote from "./Cells/RouteNote";
import Amount from "./Cells/Amount";
import { List } from "immutable";
import classNames from "classnames";
import Stt from "./Cells/Stt";
const defaultList = List();
const isDisable = (dataIndex, record) => {
  if (
    dataIndex === "discount" &&
    record["discountByPercentage"] &&
    !(
      record["discountByPercentage"] === "0" ||
      record["discountByPercentage"] === 0
    )
  ) {
    return true;
  } else if (
    dataIndex === "discountByPercentage" &&
    record["discount"] &&
    !(record["discount"] === "0" || record["discount"] === 0)
  ) {
    return true;
  }
  if (record["perDay"] && record["costPerKm"]) {
    return false;
  } else if (
    dataIndex === "perDay" &&
    !record["perDay"] &&
    record["costPerKm"] &&
    !(record["costPerKm"] === "0" || record["costPerKm"] === 0)
  ) {
    return true;
  } else if (
    dataIndex === "costPerKm" &&
    !record["costPerKm"] &&
    record["perDay"] &&
    !(record["perDay"] === "0" || record["perDay"] === 0)
  ) {
    return true;
  } else {
    return false;
  }
};

const DetailDriverTableRow = memo(
  ({
    tripId,
    record,
    errors,
    setBottomDetailDataSource,
    handleChangeIsOneWay,
    handleChangeTime,
    handleChangeAffectAmount,
    handleAddNewGuide,
    handleDeleteGuide,
    handleChangeGuideInfo,
    handleCopyNextGuideInfo,
    handleCopyAllGuideInfo,
    handleChangeRestInput,
    handleChangeLocationPickup,
    handleChangeTimeArray,
    stt,
  }) => {
    return (
      <tr
        key={record.get("key")}
        className={classNames({
          selectedTrip: tripId && tripId === record.get("uuid"),
        })}
      >
        <Stt stt={stt} />
        <RequireVehicleType
          vehicleTypeId={record.get("vehicleTypeId")}
          requireVehiclesTypeName={record.get("requireVehiclesTypeName")}
          rowId={record.get("key")}
        />
        <VehicleNumber vehicleNumber={record.get("vehicleNumber")} />
        <VehicleCode
          vehicleCode={record.get("vehicleCode")}
          rowId={record.get("key")}
          handleChangeRestInput={handleChangeRestInput}
        />
        <VehicleTime
          errors={errors.get("vehicleTime")}
          vehicleTime={record.get("vehicleTime")}
          rowId={record.get("key")}
          handleChangeRestInput={handleChangeRestInput}
        />
        <TripDate
          rowId={record.get("key")}
          pickUpAt={record.get("pickUpAt")}
          dropOffAt={record.get("dropOffAt")}
          pickUpAtErrors={errors.get("pickUpAt")}
          dropOffAtErrors={errors.get("dropOffAt")}
          handleChangeTime={handleChangeTime}
          handleChangeTimeArray={handleChangeTimeArray}
        />
        <FixedRoutesId
          pickUpAt={record.get("pickUpAt")}
          rowId={record.get("key")}
          points={
            record.get("fixedRoutesId")
              ? record.getIn(["points", record.get("fixedRoutesId")]) || undefined
              : List()
          }
          tripId={record.get("uuid")}
          setBottomDetailDataSource={setBottomDetailDataSource}
          fixedRoutesId={record.get("fixedRoutesId")}
          fixedRoutesName={record.get("fixedRoutesName")}
          fixedRoutesCode={record.get("fixedRoutesCode")}
        />
        <Distance
          distance={record.get("distance")}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <CostPerKm
          errors={errors.get("costPerKm")}
          disabled={isDisable("costPerKm", record.toJS())}
          costPerKm={record.get("costPerKm")}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <PerDay
          errors={errors.get("perDay")}
          disabled={isDisable("perDay", record.toJS())}
          perDay={record.get("perDay")}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <OverNightCost
          overNightCost={record.get("overNightCost")}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <Highway
          Highway={record.get("Highway")}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <Discount
          disabled={isDisable("discount", record.toJS())}
          discount={record.get("discount")}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <DiscountByPercentage
          disabled={isDisable("discountByPercentage", record.toJS())}
          discountByPercentage={record.get("discountByPercentage")}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <VehicleId
          vehicleId={record.get("vehicleId")}
          plate={record.get("plate")}
          rowId={record.get("key")}
        />
        <DriverId
          driverId={record.get("driverId")}
          driverName={record.get("driverName")}
          rowId={record.get("key")}
        />
        <StewardessUuid
          stewardessUuid={record.get("stewardessUuid")}
          stewardessName={record.get("stewardessName")}
        />
        <GuideInfo
          errors={errors.get("guideInfo") || defaultList}
          guideInfo={record.get("guideInfo")}
          rowId={record.get("key")}
          handleAddNewGuide={handleAddNewGuide}
          handleDeleteGuide={handleDeleteGuide}
          handleChangeGuideInfo={handleChangeGuideInfo}
          handleCopyNextGuideInfo={handleCopyNextGuideInfo}
          handleCopyAllGuideInfo={handleCopyAllGuideInfo}
        />

        <LocationPickup
          locationPickupId={record.get("locationPickupId")}
          locationPickup={record.get("locationPickup")}
          rowId={record.get("key")}
          handleChangeLocationPickup={handleChangeLocationPickup}
        />
        <TimePickup
          timePickup={record.get("timePickup")}
          errors={errors.get("timePickup")}
          rowId={record.get("key")}
          handleChangeRestInput={handleChangeRestInput}
        />
        <IsOneWay
          rowId={record.get("key")}
          checked={record.get("isOneWay")}
          handleChangeIsOneWay={handleChangeIsOneWay}
        />
        <ActualVehicleType
          actualVehiclesTypeId={record.get("actualVehiclesTypeId")}
          actualVehiclesTypeName={record.get("actualVehiclesTypeName")}
          rowId={record.get("key")}
        />
        <RouteNote
          routeNote={record.get("routeNote")}
          rowId={record.get("key")}
          handleChangeRestInput={handleChangeRestInput}
        />
        <Amount amount={record.get("amount")} rowId={record.get("key")} />
      </tr>
    );
  }
);
export default DetailDriverTableRow;
