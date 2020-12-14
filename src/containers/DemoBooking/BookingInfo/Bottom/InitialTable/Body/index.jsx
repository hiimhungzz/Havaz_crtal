import React, { memo } from "react";
import _ from "lodash";
import { Map, List } from "immutable";
import InitialTableRow from "./Row";

let defaultMap = Map();

const InitialTableBody = memo(
  ({
    organizationId,
    grid,
    columns,
    errors,
    validateSeats,

    dateIn,
    dateOut,

    handleChangeRoute,
    handleChangeRequireVehilceType,
    handleChangeTripDate,

    handleDeleteRequireVehicleType,
    handleChangeVehicleNumber,
    handleChangeDistance,
    handleCloneTrip,
    handleCopyRequireVehicleTypeItem,
    handleAddNextRequireVehicleTypeItem,
    handleAddAllRequireVehicleTypeItem,

    handleAddVehicleType,
    handleDeleteTrip,
    handleChangeOverNightCost,
    handleChangeHighway
  }) => {
    return (
      <tbody>
        {grid.map((record, recordIndex) => {
          const isLastRow = recordIndex === grid.size - 1;
          return (
            <InitialTableRow
              key={recordIndex}
              rowIndex={recordIndex}
              organizationId={organizationId}
              isLastRow={isLastRow}
              record={record}
              validateSeat={
                Map.isMap(validateSeats.get(recordIndex))
                  ? validateSeats.get(recordIndex)
                  : defaultMap
              }
              errors={
                errors.get("initial") &&
                errors.get("initial").size > 0 &&
                errors.get("initial").get(recordIndex)
                  ? errors.get("initial").get(recordIndex)
                  : defaultMap
              }
              dateIn={dateIn}
              dateOut={dateOut}
              handleChangeRoute={handleChangeRoute}
              handleCloneTrip={handleCloneTrip}
              handleChangeTripDate={handleChangeTripDate}
              handleChangeRequireVehilceType={handleChangeRequireVehilceType}
              handleDeleteRequireVehicleType={handleDeleteRequireVehicleType}
              handleCopyRequireVehicleTypeItem={
                handleCopyRequireVehicleTypeItem
              }
              handleAddNextRequireVehicleTypeItem={
                handleAddNextRequireVehicleTypeItem
              }
              handleAddAllRequireVehicleTypeItem={
                handleAddAllRequireVehicleTypeItem
              }
              handleAddVehicleType={handleAddVehicleType}
              handleDeleteTrip={handleDeleteTrip}
              handleChangeVehicleNumber={handleChangeVehicleNumber}
              handleChangeDistance={handleChangeDistance}
              handleChangeOverNightCost={handleChangeOverNightCost}
              handleChangeHighway={handleChangeHighway}
            />
          );
        })}
        {grid.size === 0 ? (
          <tr>
            <td
              colSpan={_.keys(columns).length}
              className="align-middle text-center"
            >
              <p className="kt-font-bolder mb-0">CHƯA CÓ DỮ LIỆU</p>
            </td>
          </tr>
        ) : null}
      </tbody>
    );
  }
);
export default InitialTableBody;
