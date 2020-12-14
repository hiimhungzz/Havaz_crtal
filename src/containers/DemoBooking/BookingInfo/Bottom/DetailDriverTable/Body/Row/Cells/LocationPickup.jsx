import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import PlacesLocation from "@Components/SelectContainer/PlacesLocation";

const LocationPickup = memo(
  withStyles({
    col: {
      minWidth: 150
    }
  })(
    ({
      locationPickupId,
      locationPickup,
      rowId,
      classes,
      handleChangeLocationPickup
    }) => {
      return (
        <td className={`align-middle ${classes.col}`}>
          <PlacesLocation
            value={
              locationPickupId || locationPickup
                ? { key: locationPickupId || locationPickup, label: locationPickup }
                : undefined
            }
            onSelect={async place =>
              handleChangeLocationPickup({ rowId: rowId, place: place })
            }
          />
        </td>
      );
    }
  )
);
export default LocationPickup;
