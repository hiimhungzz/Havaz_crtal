import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Popconfirm } from "antd";

const Action = memo(
  withStyles({
    col: {
      width: 30,
    },
  })(({ recordId, uuid, setContract, classes }) => {
    const _handleDeleteCost = useCallback(() => {
      setContract((prevState) => {
        let nextState = prevState;
        nextState = nextState.update("cost", (x) => x.delete(recordId));
        nextState = nextState.update("check", (x) => x.delete(recordId));
        return nextState;
      });
    }, [recordId, setContract]);
    return (
      <td className={`align-middle text-center ${classes.col}`}>
        {uuid ? (
          recordId + 1
        ) : (
          <Popconfirm
            placement="rightTop"
            title="Xác nhận xóa giá này?"
            onConfirm={_handleDeleteCost}
            okText="Xác nhận"
            cancelText="Quay lại"
          >
            <button
              title="Xóa"
              className="btn btn-clean btn-sm btn-icon btn-icon-md"
            >
              <i className="flaticon2-trash kt-font-danger" />
            </button>
          </Popconfirm>
        )}
      </td>
    );
  })
);
export default Action;
