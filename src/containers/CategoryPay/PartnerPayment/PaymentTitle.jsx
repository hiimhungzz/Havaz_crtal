import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const PaymentTitle = withStyles({
  root: {
    display: "inline-grid"
  },
  maxHeight: {
    height: "100%"
  }
})(
  memo(({ info, classes }) => {
    return (
      <div className={classes.root}>
        <h4>
          BẢNG QUYẾT TOÁN THÁNG{" "}
          {info.get("_month") && info.get("_month")
            ? `${info.get("_month")} - ${info.get("_year")}`
            : null}
        </h4>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Grid container classes={{ root: classes.maxHeight }}>
              <Grid item xs={12}>
                <label className="kt-font-bolder">Biển số xe:</label>
              </Grid>
              <Grid item xs={12}>
                <label className="kt-font-bolder">Tên lái xe:</label>
              </Grid>
              <Grid item xs={12}>
                <label className="kt-font-bolder">Mã:</label>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container classes={{ root: classes.maxHeight }}>
              <Grid item xs={12}>
                {info.get("plate")}
              </Grid>
              <Grid item xs={12}>
                {info.get("name")}
              </Grid>
              <Grid item xs={12}>
                {info.get("code")}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  })
);
export default PaymentTitle;
