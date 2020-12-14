import React, { memo } from "react";
import _ from "lodash";
import TripDate from "./Cells/TripDate";
import FixedRoute from "./Cells/FixedRoute";
import RequireVehicleType from "./Cells/RequireVehicleType";
import Action from "./Cells/Action";

const InitialTableRow = memo(
  ({
    record,
    rowIndex,
    errors,
    isLastRow,
    organizationId,
    validateSeat,
    dateIn,
    dateOut,

    handleChangeTripDate,
    handleCloneTrip,

    handleChangeRoute,
    handleChangeRequireVehilceType,

    handleDeleteRequireVehicleType,
    handleCopyRequireVehicleTypeItem,
    handleAddNextRequireVehicleTypeItem,
    handleAddAllRequireVehicleTypeItem,

    handleAddVehicleType,
    handleDeleteTrip,
    handleChangeVehicleNumber,
    handleChangeDistance,
    handleChangeOverNightCost,
    handleChangeHighway,
    ...restProps
  }) => {
    return (
      <tr {...restProps}>
        <TripDate
          dateIn={dateIn}
          dateOut={dateOut}
          rowIndex={rowIndex}
          tripDate={record.get("tripDate")}
          errors={errors.get("tripDate")}
          isLastRow={isLastRow}
          handleCloneTrip={handleCloneTrip}
          handleChangeTripDate={handleChangeTripDate}
        />
        <FixedRoute
          rowIndex={rowIndex}
          notEnoughSeat={validateSeat.get("notEnoughSeat")}
          fixedRoutesId={
            record.get("fixedRoutesId")
              ? {
                  key: record.get("fixedRoutesId"),
                  label: record.get("fixedRoutesName")
                }
              : undefined
          }
          errors={errors.get("fixedRoutesId")}
          handleChangeRoute={handleChangeRoute}
        />
        <RequireVehicleType
          organizationId={organizationId}
          fixedRoutesId={record.get("fixedRoutesId")}
          tripDate={record.get("tripDate")}
          requireVehicleTypes={record.get("requireVehicleTypes")}
          rowIndex={rowIndex}
          errors={errors.get("requireVehicleTypes")}
          handleDeleteRequireVehicleType={handleDeleteRequireVehicleType}
          handleChangeRequireVehilceType={handleChangeRequireVehilceType}
          handleCopyRequireVehicleTypeItem={handleCopyRequireVehicleTypeItem}
          handleAddNextRequireVehicleTypeItem={
            handleAddNextRequireVehicleTypeItem
          }
          handleAddAllRequireVehicleTypeItem={
            handleAddAllRequireVehicleTypeItem
          }
          handleChangeVehicleNumber={handleChangeVehicleNumber}
          handleChangeDistance={handleChangeDistance}
          handleChangeOverNightCost={handleChangeOverNightCost}
          handleChangeHighway={handleChangeHighway}
        />
        <Action
          rowIndex={rowIndex}
          handleAddVehicleType={handleAddVehicleType}
          handleDeleteTrip={handleDeleteTrip}
        />
      </tr>
    );
  }
);
export default InitialTableRow;
