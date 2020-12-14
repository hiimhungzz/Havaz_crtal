import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import RouteTour from "@Components/SelectContainer/RouteTour";

const Route = memo(
  withStyles({
    col: {
      minWidth: 100
    }
  })(({ name, errors, recordId, setTour, classes }) => {
    const _handleChange = useCallback(
      (route, routeData) => {
        setTour(prevState => {
          let nextState = prevState;
          nextState = nextState.setIn(
            ["listRoute", recordId, "uuid"],
            routeData ? routeData.key : ""
          );
          nextState = nextState.setIn(
            ["listRoute", recordId, "name"],
            routeData ? routeData.label : ""
          );
          nextState = nextState.setIn(
            ["listRoute", recordId, "distance"],
            routeData ? routeData.distance : 0
          );
          nextState = nextState.setIn(
            ["listRoute", recordId, "preDistance"],
            routeData
              ? routeData.preDistance ||
                  nextState.getIn(["listRoute", recordId, "distance"])
              : 0
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
        <RouteTour
          className={classNames({
            "border-invalid": errors
          })}
          value={name ? { key: "", label: name } : undefined}
          onSelect={_handleChange}
        />
      </td>
    );
  })
);
export default Route;
