import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";

const Action = memo(
  withStyles({
    col: {
      width: 50
    }
  })(({ rowId, isDisabled, setRoute, classes }) => {
    const _handleDeletePoint = useCallback(() => {
      setRoute(prevState => {
        let nextState = prevState;
        nextState = nextState.update("point", x => x.delete(rowId));
        nextState = nextState.update("point", p => {
          p = p.map((x, xId) => x.set("order", xId + 1));
          return p;
        });

        return nextState;
      });
    }, [rowId, setRoute]);
    return (
      <td
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        <button
          disabled={isDisabled}
          onClick={_handleDeletePoint}
          title="Xóa địa điểm"
          className={`btn btn-clean btn-sm btn-icon btn-icon-md ${
            isDisabled ? "disabled" : ""
          }`}
        >
          {isDisabled ? null : (
            <i className={`flaticon2-trash kt-font-danger`} />
          )}
        </button>
      </td>
    );
  })
);
export default Action;
