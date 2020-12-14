import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import { InputNumber } from "antd";
import _ from "lodash";

const Stt = memo(
  withStyles({
    col: {
      width: 100,
      "& .ant-input-number": {
        "& .ant-input-number-input": {
          textAlign: "right !important"
        }
      }
    }
  })(({ price, recordId, setHighway, classes }) => {
    const _handleChange = useCallback(
      priceValue => {
        setHighway(prevState => {
          let nextState = prevState;
          nextState = nextState.setIn(
            ["highwayVehicle", recordId, "price"],
            priceValue
          );
          return nextState;
        });
      },
      [recordId, setHighway]
    );
    return (
      <td
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        <InputNumber
          value={price}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={value => value.replace(/\$\s?|(,*)/g, "")}
          onChange={_handleChange}
        />
      </td>
    );
  })
);
export default Stt;
