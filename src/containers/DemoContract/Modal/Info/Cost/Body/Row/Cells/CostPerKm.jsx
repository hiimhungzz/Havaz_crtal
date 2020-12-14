import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import { InputNumber } from "antd";
import _ from "lodash";

const CostPerKm = memo(
  withStyles({
    col: {
      width: 120,
      "& .ant-input-number": {
        "& .ant-input-number-input": {
          textAlign: "right !important",
        },
      },
    },
  })(({ costPerKm, recordId, setContract, classes }) => {
    const _handleChange = useCallback(
      (value) => {
        setContract((prevState) =>
          prevState.setIn(["cost", recordId, "costPerKm"], value)
        );
      },
      [recordId, setContract]
    );
    return (
      <td 
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        <InputNumber
          title={_.replace(costPerKm, /\B(?=(\d{3})+(?!\d))/g, ",")}
          value={costPerKm}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          onChange={_handleChange}
        />
      </td>
    );
  })
);
export default CostPerKm;
