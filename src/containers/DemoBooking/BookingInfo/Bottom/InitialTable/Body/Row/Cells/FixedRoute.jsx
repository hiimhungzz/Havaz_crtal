import React, { memo } from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import RouteNoOrg from "@Components/SelectContainer/RouteNoOrg";
import { hasError } from "@Helpers/utility";

const FixedRoute = memo(
  withStyles({
    gridRootContainer: {
      display: "grid",
      gridTemplateColumns: "auto",
      gridGap: 5,
    },
    col: {
      minWidth: 380,
      paddingTop: "26.5px !important",
    },
    colHasError: {
      minWidth: 120,
    },
  })(
    ({
      fixedRoutesId,
      rowIndex,
      classes,
      errors,
      handleChangeRoute,
      notEnoughSeat,
    }) => {
      return (
        <td className="align-middle">
          <div
            className={`${notEnoughSeat ? classes.colHasError : classes.col} ${
              classes.gridRootContainer
            }`}
          >
            {notEnoughSeat ? (
              <div>
                <label className="text-danger mb-0">{notEnoughSeat}</label>
              </div>
            ) : null}
            <div>
              <RouteNoOrg
                className={classNames({
                  "border-invalid": hasError(errors),
                })}
                value={fixedRoutesId}
                onSelect={(route, data) =>
                  handleChangeRoute({
                    route: route || {},
                    data: data,
                    rowIndex: rowIndex,
                  })
                }
              />
            </div>
          </div>
        </td>
      );
    }
  )
);
export default FixedRoute;
