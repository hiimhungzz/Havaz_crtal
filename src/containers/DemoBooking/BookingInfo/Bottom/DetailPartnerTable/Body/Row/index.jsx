import React, { memo } from "react";
import classNames from "classnames";
import RequireVehicleType from "./Cells/RequireVehicleType";
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
import Amount from "./Cells/Amount";
import VehicleId from "./Cells/VehicleId";
import DriverId from "./Cells/DriverId";
import Profit from "./Cells/Profit";
import Stt from "../../../DetailDriverTable/Body/Row/Cells/Stt";
import PartnerCode from "./Cells/PartnerCode";

const isDisable = (dataIndex, record) => {
  if (
    dataIndex === "partnersDiscount" &&
    record["partnersDiscountByPercentage"] &&
    !(
      record["partnersDiscountByPercentage"] === "0" ||
      record["partnersDiscountByPercentage"] === 0
    )
  ) {
    return true;
  } else if (
    dataIndex === "partnersDiscountByPercentage" &&
    record["partnersDiscount"] &&
    !(record["partnersDiscount"] === "0" || record["partnersDiscount"] === 0)
  ) {
    return true;
  }
  if (record["partnersPerDay"] && record["partnersCostPerKm"]) {
    return false;
  } else if (
    dataIndex === "partnersPerDay" &&
    record["partnersCostPerKm"] &&
    !(record["partnersCostPerKm"] === "0" || record["partnersCostPerKm"] === 0)
  ) {
    return true;
  } else if (
    dataIndex === "partnersCostPerKm" &&
    record["partnersPerDay"] &&
    !(record["partnersPerDay"] === "0" || record["partnersPerDay"] === 0)
  ) {
    return true;
  } else {
    return false;
  }
};

const DetailPartnerTableRow = memo(
  ({ record, tripId, stt, handleChangeAffectAmount }) => {
    return (
      <tr
        key={record.get("key")}
        className={classNames({
          selectedTrip: tripId && tripId === record.get("uuid")
        })}
      >
        <Stt stt={stt} />
        <RequireVehicleType
          vehicleTypeId={record.get("vehicleTypeId")}
          requireVehiclesTypeName={record.get("requireVehiclesTypeName")}
          rowId={record.get("key")}
        />
        <ActualVehicleType
          actualVehiclesTypeId={record.get("actualVehiclesTypeId")}
          actualVehiclesTypeName={record.get("actualVehiclesTypeName")}
          rowId={record.get("key")}
        />
        <VehicleNumber vehicleNumber={record.get("vehicleNumber")} />
        <TripDate
          rowId={record.get("key")}
          pickUpAt={record.get("pickUpAt")}
          dropOffAt={record.get("dropOffAt")}
        />
        <PartnerCode partnerCode={record.get("partnerCode")} />
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
        <FixedRoutesId
          fixedRoutesName={record.get("fixedRoutesName")}
          fixedRoutesCode={record.get("fixedRoutesCode")}
        />
        <Distance
          disabled={!record.get("partnerCode")}
          partnersDistance={record.get("partnersDistance")}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <CostPerKm
          disabled={
            isDisable("partnersCostPerKm", record.toJS()) ||
            !record.get("partnerCode")
          }
          partnersCostPerKm={record.get("partnersCostPerKm")}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <PerDay
          disabled={
            isDisable("partnersPerDay", record.toJS()) ||
            !record.get("partnerCode")
          }
          partnersPerDay={record.get("partnersPerDay")}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <OverNightCost
          disabled={!record.get("partnerCode")}
          partnersOverNightCost={record.get("partnersOverNightCost")}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <Highway
          disabled={!record.get("partnerCode")}
          partnersHighway={record.get("partnersHighway")}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <Discount
          disabled={
            isDisable("partnersDiscount", record.toJS()) ||
            !record.get("partnerCode")
          }
          partnersDiscount={record.get("partnersDiscount")}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <DiscountByPercentage
          disabled={
            isDisable("partnersDiscountByPercentage", record.toJS()) ||
            !record.get("partnerCode")
          }
          partnersDiscountByPercentage={record.get(
            "partnersDiscountByPercentage"
          )}
          rowId={record.get("key")}
          handleChangeAffectAmount={handleChangeAffectAmount}
        />
        <Profit
          isShow={record.get("partnerCode")}
          profit={record.get("amount") - record.get("partnersAmount")}
        />
        <Amount partnersAmount={record.get("partnersAmount")} />
      </tr>
    );
  }
);
export default DetailPartnerTableRow;
