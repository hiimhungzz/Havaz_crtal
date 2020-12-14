import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import { InputNumber } from "antd";
import _ from "lodash";

const PreDistance = memo(
  withStyles({
    col: {
      width: 100,
      "& .ant-input-number": {
        "& .ant-input-number-input": {
          textAlign: "right !important"
        }
      }
    }
  })(({ preDistance, recordId, setTour, classes }) => {
    const _handleChange = useCallback(
      priceValue => {
        setTour(prevState => {
          let nextState = prevState;
          nextState = nextState.setIn(
            ["listRoute", recordId, "preDistance"],
            priceValue
          );
          return nextState;
        });
      },
      [recordId, setTour]
    );
    return (
      <td
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        <InputNumber
          value={preDistance ? _.parseInt(preDistance) : null}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={value => value.replace(/\$\s?|(,*)/g, "")}
          onChange={_handleChange}
        />
      </td>
    );
  })
);
export default PreDistance;
