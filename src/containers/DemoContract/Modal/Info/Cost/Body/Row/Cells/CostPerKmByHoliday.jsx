import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import { InputNumber } from "antd";
import _ from "lodash";

const CostPerKmByHoliday = memo(
  withStyles({
    col: {
      width: 120,
      "& .ant-input-number": {
        "& .ant-input-number-input": {
          textAlign: "right !important",
        },
      },
    },
  })(({ costPerKmByHoliday, recordId, setContract, classes }) => {
    const _handleChange = useCallback(
      (value) => {
        setContract((prevState) =>
          prevState.setIn(["cost", recordId, "costPerKmByHoliday"], value)
        );
      },
      [recordId, setContract]
    );
    return (
      <td 
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        <InputNumber
          title={_.replace(costPerKmByHoliday, /\B(?=(\d{3})+(?!\d))/g, ",")}
          value={costPerKmByHoliday}
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
export default CostPerKmByHoliday;
