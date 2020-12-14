import React, { useCallback, useState } from "react";
import classNames from "classnames";
import _ from "lodash";
import Globals from "globals.js";
import { withStyles } from "@material-ui/core/styles";
import { Map } from "immutable";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
import { Modal, Input, Button } from "antd";
import { getCurrentStep } from "@Helpers/utility";

const BookingInfoAction = React.memo(
  withStyles({
    gridContainer: {
      display: "inline-grid",
      gridAutoFlow: "column",
      gridGap: 5
    }
  })(
    ({
      uuid,
      status,
      bookingStatus,
      isMou,
      detail,
      topErrors,
      bottomInitialErrors,
      bottomDetailErrors,
      classes,
      actionName,
      ownerId,
      createdBy,
      saveBookingFetching,
      saveOperatingFetching,
      changeBookingStatusFetching,
      quotationToAgencyFetching,
      setTopData,
      onSaveBookingInfo,
      onCopyBookingInfo,
      onClearBookingInfo,
      onShowChangeStatusModal,
      onSaveOperating,
      onQuotationToAgency
    }) => {
      const [cancelBookingFetching, setCancelBookingFetching] = useState(false);
      const [showCancelBooking, setShowCancelBooking] = useState(false);
      const [cancelComment, setCancelComment] = useState(false);
      const onCancelBookingModal = useCallback(
        async data => {
          setCancelBookingFetching(true);
          let result = await ServiceBase.requestJson({
            url: "/booking/status/update",
            method: "POST",
            data: data
          });
          if (result.hasErrors) {
            Ui.showErrors(result.errors);
          } else {
            Ui.showSuccess({ message: "Hủy booking thành công." });
            setTopData(prevState => {
              let nextState = prevState;
              nextState = nextState.setIn(["dataSource", "status"], 500);
              nextState = nextState.setIn(
                ["dataSource", "activeStep"],
                getCurrentStep(500)
              );
              return nextState;
            });
          }
          setShowCancelBooking(false);
          setCancelBookingFetching(false);
        },
        [setTopData]
      );

      let [...keysInDetail] = Map.isMap(detail) ? detail.keys() : [];
      const profile = Globals.currentUser;
      let disabled = false;
      if (topErrors.size > 0 || bottomInitialErrors.size > 0 || status === 0) {
        disabled = true;
      }
      _.forEach(keysInDetail, k => {
        if (bottomDetailErrors.has(k)) {
          if (bottomDetailErrors.getIn([k, "guideInfo"])) {
            let inValidArr = _.filter(
              bottomDetailErrors.getIn([k, "guideInfo"]).toJS(),
              x => !_.isNull(x.phone)
            );
            if (inValidArr.length > 0) {
              disabled = true;
            }
          }

          if (
            bottomDetailErrors.getIn([k, "pickUpAt"]) ||
            bottomDetailErrors.getIn([k, "dropOffAt"]) ||
            bottomDetailErrors.getIn([k, "vehicleTime"]) ||
            bottomDetailErrors.getIn([k, "perDay"]) ||
            bottomDetailErrors.getIn([k, "costPerKm"]) ||
            bottomDetailErrors.getIn([k, "timePickup"])
          ) {
            disabled = true;
          }
        }
      });
      let _return = null;
      if (actionName === "add" || actionName === "read") {
        _return = (
          <>
            <button
              disabled={disabled || saveBookingFetching}
              type="button"
              className={classNames({
                "btn btn-info btn-icon-sm": true,
                "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger": saveBookingFetching
              })}
              onClick={onSaveBookingInfo}
            >
              <i className="fa fa-plus" />
              Lưu
            </button>
            {actionName === "read" ? (
              <button
                type="button"
                onClick={onCopyBookingInfo}
                className="btn btn-warning btn-icon-sm"
              >
                <i className="fa fa-copy" />
                Sao chép
              </button>
            ) : null}
            {actionName === "add" && isMou === false ? (
              <button
                disabled={disabled || saveOperatingFetching}
                type="button"
                onClick={onSaveOperating}
                className={classNames({
                  "btn btn-outline-info btn-icon-sm": true,
                  "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger": saveOperatingFetching
                })}
              >
                <i className="fa fa-save" />
                Lưu và chuyển điều phối
              </button>
            ) : null}

            {(profile.uuid === createdBy || profile.uuid === ownerId) &&
            bookingStatus < 302 &&
            actionName === "read" ? (
              <button
                disabled={changeBookingStatusFetching}
                type="button"
                onClick={onShowChangeStatusModal}
                className={classNames({
                  "btn btn-success btn-icon-sm": true,
                  "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--warning": changeBookingStatusFetching
                })}
              >
                <i className="fa fa-chart-bar" />
                Chuyển điều phối
              </button>
            ) : null}

            {bookingStatus !== 200 && (
              <button
                disabled={quotationToAgencyFetching}
                type="button"
                onClick={onQuotationToAgency}
                className={classNames({
                  "btn btn-success btn-icon-sm": true,
                  "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--warning": quotationToAgencyFetching
                })}
              >
                <i className="fa fa-poll-h" />
                Báo giá
              </button>
            )}
            <button
              type="button"
              onClick={onClearBookingInfo}
              className="btn btn-danger btn-icon-sm"
            >
              <i className="fa fa-trash" />
              Xóa
            </button>
            {bookingStatus < 500 && actionName === "read" ? (
              <button
                disabled={cancelBookingFetching}
                type="button"
                onClick={() => setShowCancelBooking(true)}
                className={classNames({
                  "btn kt-bg-light-danger btn-icon-sm": true,
                  "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--warning": cancelBookingFetching
                })}
              >
                <i className="fa fa-ban" />
                Hủy
              </button>
            ) : null}
          </>
        );
      }
      return (
        <div className={classes.gridContainer}>
          {_return}
          <Modal
            visible={showCancelBooking}
            title="Xác nhận hủy booking này ?"
            footer={[
              <Button onClick={() => setShowCancelBooking(false)} key="back">
                Quay lại
              </Button>,
              <Button
                disabled={!cancelComment}
                key="submit"
                type="danger"
                loading={cancelBookingFetching}
                onClick={() => {
                  onCancelBookingModal({
                    uuid: uuid,
                    status: 500,
                    comment: cancelComment
                  });
                }}
              >
                Xác nhận
              </Button>
            ]}
          >
            <p>
              <Input.TextArea
                rows={5}
                value={cancelComment}
                onChange={e => {
                  let value = e.target.value;
                  setCancelComment(value);
                }}
                placeholder="Nhập lý do hủy"
              />
            </p>
          </Modal>
        </div>
      );
    }
  )
);
export default BookingInfoAction;
