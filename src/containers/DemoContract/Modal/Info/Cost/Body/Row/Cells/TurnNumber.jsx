import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import { InputNumber } from "antd";

const TurnNumber = memo(
  withStyles({
    col: {
      width: 115,

      "& .ant-input-number": {
        "& .ant-input-number-input": {
          textAlign: "center !important",
        },
      },
    },
    container: {
      display: "grid",
      gridTemplateColumns: "55px 60px",
    },
  })(({ turnNumber, recordId, setContract, classes }) => {
    const _handleChange = useCallback(
      (value) => {
        setContract((prevState) =>
          prevState.setIn(["cost", recordId, "turnNumber"], value)
        );
      },
      [recordId, setContract]
    );
    return (
      <td
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        <div className={classes.container}>
          <InputNumber
            value={turnNumber}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            onChange={_handleChange}
          />
          <span className="ml-1 d-flex align-items-center kt-font-bold">
            / tháng
          </span>
        </div>
      </td>
    );
  })
);
export default TurnNumber;
