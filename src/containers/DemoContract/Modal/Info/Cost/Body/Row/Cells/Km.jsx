import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import { InputNumber } from "antd";

const Km = memo(
  withStyles({
    col: {
      width: 80,
      "& .ant-input-number": {
        "& .ant-input-number-input": {
          textAlign: "right !important",
        },
      },
    },
  })(({ distance, recordId, setContract, classes }) => {
    const _handleChange = useCallback(
      (value) => {
        setContract((prevState) =>
          prevState.setIn(["cost", recordId, "distance"], value)
        );
      },
      [recordId, setContract]
    );
    return (
      <td
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        <InputNumber
          title={distance}
          value={distance}
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
export default Km;
