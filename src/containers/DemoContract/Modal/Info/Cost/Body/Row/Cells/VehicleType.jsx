import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import classNames from "classnames";
import VehicleTypeNoOrg from "@Components/SelectContainer/VehicleTypeNoOrg";

const VehicleType = memo(
  withStyles({
    col: {
      minWidth: 250,
      width: 250,
    },
  })(
    ({
      uuid,
      vehicleTypes,
      vehicleTypeId,
      vehicleTypeName,
      recordId,
      errors,
      setContract,
      classes,
    }) => {
      const _handleSelect = useCallback(
        (vehicleType) => {
          setContract((prevState) => {
            let nextState = prevState;
            nextState = nextState.setIn(
              ["cost", recordId, "vehicleTypeId"],
              _.get(vehicleType, "key")
            );
            nextState = nextState.setIn(
              ["cost", recordId, "vehicleTypeName"],
              _.get(vehicleType, "label")
            );
            nextState = nextState.setIn(
              ["check", recordId, "vehicleType"],
              _.get(vehicleType, "key")
            );
            return nextState;
          });
        },
        [recordId, setContract]
      );
      return (
        <td
          className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
        >
          <VehicleTypeNoOrg
            vehicleTypes={vehicleTypes}
            disabled={uuid}
            className={classNames({
              "border-invalid": errors,
            })}
            value={
              vehicleTypeId
                ? { key: vehicleTypeId, label: vehicleTypeName }
                : undefined
            }
            style={{ width: "100%" }}
            onSelect={_handleSelect}
          />
        </td>
      );
    }
  )
);
export default VehicleType;
