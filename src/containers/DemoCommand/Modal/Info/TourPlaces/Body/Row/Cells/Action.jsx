import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Popconfirm } from "antd";

const Action = memo(
  withStyles({
    col: {
      width: 30
    }
  })(({ recordId, setTour, classes }) => {
    const _handleDeletePoint = useCallback(() => {
      setTour(prevState => {
        let nextState = prevState;
        nextState = nextState.update("listRoute", x => x.delete(recordId));
        nextState = nextState.update("listRoute", p => {
          p = p.map((x, xId) => {
            x = x.set("order", xId + 1);
            x = x.set("dateOffSet", xId + 1);
            return x;
          });
          return p;
        });

        return nextState;
      });
    }, [recordId, setTour]);
    return (
      <td
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        <Popconfirm
          placement="rightTop"
          title="Xác nhận xóa tuyến/điểm này?"
          onConfirm={_handleDeletePoint}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <button
            title="Xóa"
            className="btn btn-clean btn-sm btn-icon btn-icon-md"
          >
            <i className="flaticon2-trash kt-font-danger" />
          </button>
        </Popconfirm>
      </td>
    );
  })
);
export default Action;
