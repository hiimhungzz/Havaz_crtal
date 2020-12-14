import React from "react";
import _ from "lodash";
import Table from "react-bootstrap/Table";
import { withStyles } from "@material-ui/core/styles";
import DetailPartnerTableHead from "./Head";
import DetailPartnerTableBody from "./Body";
import DetailPartnerTableFoot from "./Foot";
import { Paper } from "@material-ui/core";

export const columns = {
  stt: {
    name: "stt",
    title: "#",
    style: {
      minWidth: 50,
      maxWidth: 50
    }
  },

  vehicleTypeId: {
    name: "vehicleTypeId",
    title: "LOẠI XE YÊU CẦU",
    style: { minWidth: 220 }
  },
  actualVehiclesTypeId: {
    name: "actualVehiclesTypeId",
    title: "LOẠI XE THỰC TẾ",
    style: { minWidth: 220 }
  },
  vehicleNumber: {
    name: "vehicleNumber",
    title: "XE SỐ",
    style: { minWidth: 80 }
  },
  tripDate: {
    name: "tripDate",
    title: "NGÀY",
    style: { width: 200 }
  },
  partnerCode: {
    name: "partnerCode",
    title: "MÃ CTV",
    style: {
      minWidth: 80,
      maxWidth: 80
    }
  },
  vehicleId: {
    name: "vehicleId",
    title: "BIỂN SỐ",
    style: {
      minWidth: 120
    }
  },
  driverId: {
    name: "driverId",
    title: "LÁI XE",
    style: {
      minWidth: 120
    }
  },
  fixedRoutesId: {
    name: "fixedRoutesId",
    title: "TUYẾN ĐƯỜNG"
    // style: { minWidth: 200 }
  },
  partnersDistance: {
    name: "partnersDistance",
    title: "KM",
    style: {
      minWidth: 80
    }
  },
  partnersCostPerKm: {
    name: "partnersCostPerKm",
    title: "ĐƠN GIÁ (KM)",
    style: {
      minWidth: 120
    }
  },
  partnersPerDay: {
    name: "partnersPerDay",
    title: "ĐƠN GIÁ (NGÀY)",
    style: {
      minWidth: 130
    }
  },
  partnersOverNightCost: {
    name: "partnersOverNightCost",
    title: "LƯU ĐÊM (VND)",
    style: {
      minWidth: 120
    }
  },
  partnersHighway: {
    name: "partnersHighway",
    title: "CAO TỐC (VND)",
    style: {
      minWidth: 130
    }
  },
  partnersDiscount: {
    name: "partnersDiscount",
    title: "GIẢM GIÁ (VND)",
    style: {
      minWidth: 130
    }
  },
  partnersDiscountByPercentage: {
    name: "partnersDiscountByPercentage",
    title: "GIẢM GIÁ (%)",
    style: {
      minWidth: 120
    }
  },
  profit: {
    name: "profit",
    title: "LỢI NHUẬN (VND)",
    style: {
      minWidth: 120,
      maxWidth: 120
    }
  },
  partnersAmount: {
    name: "partnersAmount",
    title: "THÀNH TIỀN (VND)",
    style: {
      minWidth: 120,
      maxWidth: 120
    }
  }
};

class DetailPartnerTable extends React.PureComponent {
  render() {
    const { props, _handleChangeAffectAmount } = this;
    const {
      grid,
      tripId,
      partnersTotalCost,
      partnersTotalDistance,
      totalDays,
      classes
    } = props;
    let partnersTotalProfit = _.map(grid.toJS(), x => x).reduce(
      (total, nextValue) => {
        return  nextValue.partnerCode
          ? total +
              (parseFloat(nextValue["amount"] || 0) -
                parseFloat(nextValue["partnersAmount"] || 0))
          : total;
      },
      0
    );
    return (
      <Paper classes={{ root: classes.paperRoot }}>
        <div className="zui-wrapper p-0">
          <div className="zui-scroller fixed-header">
            <Table hover className="mb-0">
              <DetailPartnerTableHead columns={columns} />
              <DetailPartnerTableBody
                tripId={tripId}
                grid={grid}
                columns={columns}
                handleChangeAffectAmount={_handleChangeAffectAmount}
              />
              <DetailPartnerTableFoot
                columns={columns}
                partnersTotalCost={partnersTotalCost}
                partnersTotalProfit={partnersTotalProfit}
                partnersTotalDistance={partnersTotalDistance}
                totalDays={totalDays}
              />
            </Table>
          </div>
        </div>
      </Paper>
    );
  }

  _handleChangeAffectAmount = _.debounce(payload => {
    let { setBottomDetailDataSource } = this.props;

    setBottomDetailDataSource(prevState => {
      let nextState = prevState;
      nextState = nextState.setIn(
        ["detail", payload.rowId, payload.name],
        payload.value
      );
      nextState = nextState.setIn(
        ["detail", payload.rowId, "partnersAmount"],
        this._calculateAmountPriceRow(
          nextState.getIn(["detail", payload.rowId]).toJS()
        )
      );
      let totalCost = _.map(nextState.get("detail").toJS(), x => x).reduce(
        (total, nextValue) => {
          return nextValue["partnersAmount"]
            ? total + parseFloat(nextValue["partnersAmount"])
            : total;
        },
        0
      );
      nextState = nextState.set("partnersTotalCost", totalCost);
      if (payload.name === "partnersDistance") {
        let totalDistance = _.map(
          nextState.get("detail").toJS(),
          x => x
        ).reduce((total, nextValue) => {
          return nextValue["partnersDistance"]
            ? total + nextValue["partnersDistance"]
            : total;
        }, 0);
        nextState = nextState.set("partnersTotalDistance", totalDistance);
      }
      return nextState;
    });
  }, 150);
  _calculateAmountPriceRow = record => {
    let discountType = "";
    if (
      (record["partnersDiscount"] === 0 || !record["partnersDiscount"]) &&
      record["partnersDiscountByPercentage"] &&
      record["partnersDiscountByPercentage"] !== 0
    ) {
      discountType = "percent";
    } else if (
      (record["partnersDiscountByPercentage"] === 0 ||
        !record["partnersDiscountByPercentage"]) &&
      record["partnersDiscount"] !== 0 &&
      record["partnersDiscount"]
    ) {
      discountType = "cash";
    }
    let costPer = 0;
    let costAmount = 0;

    if (
      (!record["partnersCostPerKm"] || record["partnersCostPerKm"] === 0) &&
      record["partnersPerDay"] &&
      record["partnersPerDay"] !== 0
    ) {
      costAmount = record["partnersPerDay"];
    } else if (
      (!record["partnersPerDay"] || record["partnersPerDay"] === 0) &&
      record["partnersCostPerKm"] &&
      record["partnersCostPerKm"] !== 0
    ) {
      costPer = record["partnersCostPerKm"];
      costAmount = (record["partnersDistance"] || 0) * costPer;
    }
    let amountPre =
      costAmount +
      (record["partnersOverNightCost"] || 0) +
      (record["partnersHighway"] || 0);
    let diss = 0;
    if (discountType === "cash") {
      diss = record["partnersDiscount"] || 0;
    } else {
      diss =
        (amountPre * parseFloat(record["partnersDiscountByPercentage"] || 0)) /
        100;
    }
    let partnersAmount = amountPre - diss;
    return partnersAmount;
  };
}
export default withStyles({
  paperRoot: {
    margin: "0.7rem"
  }
})(DetailPartnerTable);
