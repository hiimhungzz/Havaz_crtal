import React, { memo } from "react";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { FormattedNumber } from "react-intl";
const DetailPartnerTableFoot = memo(
  withStyles({
    rootFoot: {
      height: 45,
      paddingRight: 0,
      right: 0,
      width: "100%",
      bottom: 0,
      borderTop: "1px solid white"
    },
    stickyColContainer: {
      background: "whitesmoke",
      position: "sticky",
      bottom: 0
    },
    gridContainer: {
      display: "grid",
      height: "inherit",
      gridColumnGap: 10,
      gridTemplateColumns: "auto 70px 80px 130px 120px"
    }
  })(
    ({
      columns,
      partnersTotalDistance,
      partnersTotalCost,
      partnersTotalProfit,
      totalDays,
      classes
    }) => {
      return (
        <tfoot className={classes.rootFoot}>
          <tr>
            <td
              colSpan={_.keys(columns).length - 7}
              className={classes.stickyColContainer}
            />
            <td
              colSpan={7}
              className={`sticky-col ${classes.stickyColContainer}`}
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
                  {partnersTotalDistance ? (
                    <>
                      <FormattedNumber value={partnersTotalDistance} />
                      &nbsp;KM
                    </>
                  ) : (
                    "0 KM"
                  )}
                </div>
                <div className="pr-0 d-flex justify-content-end align-items-center kt-font-boldest kt-font-xl kt-font-dark">
                  {partnersTotalProfit ? (
                    <FormattedNumber value={partnersTotalProfit} />
                  ) : (
                    0
                  )}
                </div>
                <div className="pr-0 d-flex justify-content-end align-items-center kt-font-boldest kt-font-xl kt-font-danger">
                  {partnersTotalCost ? (
                    <FormattedNumber value={partnersTotalCost} />
                  ) : (
                    0
                  )}
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      );
    }
  )
);
export default DetailPartnerTableFoot;
