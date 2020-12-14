import React, { memo } from "react";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { FormattedNumber } from "react-intl";
const DetailDriverTableFoot = memo(
  withStyles({
    rootFoot: {
      height: 45,
      paddingRight: 0,
      right: 0,
      width: "100%",
      bottom: 0,
      zIndex: 301,
      borderTop: "1px solid white",
      "& tr > td": {
        zIndex: 301,
      },
    },
    stickyColContainer: {
      background: "whitesmoke",
      position: "sticky",
      bottom: 0,
    },
    gridContainer: {
      display: "grid",
      height: "inherit",
      gridColumnGap: 10,
      gridTemplateColumns: "auto 70px 100px 120px",
    },
  })(({ columns, totalDistance, totalCost, totalDays, classes }) => {
    return (
      <tfoot className={classes.rootFoot}>
        <tr>
          <td
            colSpan={_.keys(columns).length - 6}
            className={classes.stickyColContainer}
          />
          <td
            style={{
              position: "sticky",
              right: 0,
              zIndex: 302,
              backgroundColor: "whitesmoke",
            }}
            colSpan={6}
            className={`${classes.stickyColContainer}`}
          >
            <div className={classes.gridContainer}>
              <div className="d-flex justify-content-end align-items-center kt-font-boldest kt-font-xl">
                Tổng quan lịch trình:
              </div>
              <div className="d-flex justify-content-center align-items-center kt-font-boldest kt-font-xl kt-font-warning">
                {totalDays ? (
                  <>
                    {totalDays}
                    &nbsp;Ngày
                  </>
                ) : (
                  "0 Ngày"
                )}
              </div>
              <div className="d-flex justify-content-center align-items-center kt-font-boldest kt-font-xl kt-font-info">
                {totalDistance ? (
                  <>
                    <FormattedNumber value={totalDistance} />
                    &nbsp;KM
                  </>
                ) : (
                  "0 KM"
                )}
              </div>
              <div className="pr-0 d-flex justify-content-end align-items-center kt-font-boldest kt-font-xl kt-font-danger">
                {totalCost ? <FormattedNumber value={totalCost} /> : 0}
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    );
  })
);
export default DetailDriverTableFoot;
