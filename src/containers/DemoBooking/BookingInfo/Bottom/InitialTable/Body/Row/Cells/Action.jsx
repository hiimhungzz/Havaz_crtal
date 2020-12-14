import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import A from "@Components/A";
import I from "@Components/I";

const Action = memo(
  withStyles({
    root: {
      flexDirection: "column",
    },
    col: {
      paddingTop: "31.5px !important",
      minWidth: 100,
    },
  })(({ rowIndex, classes, handleAddVehicleType, handleDeleteTrip }) => {
    return (
      <td className={`align-middle ${classes.col} sticky-col`}>
        <div className={`d-flex justify-content-center ${classes.root}`}>
          <A
            onClick={(e) =>
              handleAddVehicleType({ evt: e, rowIndex: rowIndex })
            }
            className="d-flex kt-font-bolder"
            title="Thêm loại xe"
          >
            <I className="flaticon2-add-circular-button" />
            Thêm xe
          </A>
          <A
            onClick={(e) => handleDeleteTrip({ evt: e, rowIndex: rowIndex })}
            className="d-flex kt-font-bolder"
            title="Xóa"
          >
            <I className="flaticon2-trash d-flex align-items-center" />
            Xóa
          </A>
        </div>
      </td>
    );
  })
);
export default Action;
