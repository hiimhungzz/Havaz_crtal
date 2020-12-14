import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import classNames from "classnames";
import RouteNoOrg from "@Components/SelectContainer/RouteNoOrg";

const Route = memo(
  withStyles({
    col: {
      minWidth: 250,
    },
  })(
    ({
      uuid,
      routes,
      fixedRouteId,
      fixedRouteName,
      recordId,
      errors,
      setContract,
      classes,
    }) => {
      const _handleSelect = useCallback(
        (route) => {
          setContract((prevState) => {
            let nextState = prevState;
            nextState = nextState.setIn(
              ["cost", recordId, "fixedRouteId"],
              _.get(route, "key")
            );
            nextState = nextState.setIn(
              ["cost", recordId, "fixedRouteName"],
              _.get(route, "label")
            );
            nextState = nextState.setIn(
              ["check", recordId, "route"],
              _.get(route, "key")
            );
            return nextState;
          });
        },
        [recordId, setContract]
      );
      return (
        <td
          className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
        >
          <RouteNoOrg
            routes={routes}
            disabled={uuid}
            className={classNames({
              "border-invalid": errors,
            })}
            value={
              fixedRouteId
                ? { key: fixedRouteId, label: fixedRouteName }
                : undefined
            }
            onSelect={_handleSelect}
          />
        </td>
      );
    }
  )
);
export default Route;
