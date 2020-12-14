/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useDrag } from "react-dnd";
import ItemTypes from "./ItemTypes";
import classnames from "classnames";
import { Ui } from "@Helpers/Ui";
import { Popover, Divider, Input } from "antd";
import { withStyles } from "@material-ui/core/styles";
import { DATE_TIME_FORMAT } from "constants/common";

const ContentItem = React.memo(
  withStyles({
    container: {
      display: "grid",
      gridAutoFlow: "column",
      gridGap: 14,
      padding: "2px 2px",
      gridTemplateColumns: "max-content minmax(min-content,auto)"
    },
    label: {
      fontWeight: 600
    },
    content: {
      display: "flex",
      justifySelf: "flex-end",
      textAlign: "right",
      maxWidth: 300
    }
  })(({ classes, label, ...content }) => {
    return (
      <div className={classes.container}>
        <div className={classes.label}>{label}</div>
        <div className={classes.content}>{content.children}</div>
      </div>
    );
  })
);

const HoverContent = React.memo(
  withStyles({
    containerOne: {
      display: "grid",
      gridTemplateColumns: "max-content"
    },
    containerTwo: {
      display: "grid",
      gridGap: 5,
      gridTemplateColumns: "max-content 10px max-content"
    },
    paperLeftRoot: {
      margin: "0px 0px",
      display: "grid"
    },
    paperRightRoot: {
      margin: "0px 0px",
      display: "grid"
    },
    divider: { height: "100%" },
    copyButton: {
      color: "#ffc10e"
    },
    guideInfo: {
      paddingLeft: 0
    }
  })(({ classes, isSelect, isHasPermission, trip, onOpenDragDialog }) => {
    return (
      <div className={isSelect ? classes.containerTwo : classes.containerOne}>
        <div className={classes.paperLeftRoot}>
          <ContentItem label="Booking">
            <span id="codeBooking">{trip.codeBooking}</span>
            <a
              onClick={e => {
                if (isHasPermission) {
                  window.open(
                    `/demoBooking?bookingId=${trip["uuidBooking"]}&tripId=${trip.tripId}&codeBooking=${trip.codeBooking}`,
                    "_blank"
                  );
                } else {
                  Ui.showWarning({ message: "Không có quyền." });
                }
              }}
              title="Chi tiết"
              className="ml-2 mr-1"
            >
              <i className="fa fa-edit kt-font-success" />
            </a>
            <a
              onClick={e => {
                var copyText = document.getElementById("codeBooking");
                var textArea = document.createElement("textarea");
                textArea.value = copyText.textContent;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("Copy");
                textArea.remove();
                Ui.showSuccess({ message: "Sao chép mã Booking." });
              }}
              title="Sao chép mã booking"
            >
              <i className="fa fa-copy kt-font-brand" />
            </a>
            {!trip.deactive && trip.partnerUuid && (
              <a
                title="Hủy về hàng chờ CTV"
                onClick={e => {
                  if (isHasPermission) {
                    onOpenDragDialog(
                      trip,
                      {
                        isCancel: true,
                        isPartner: true,
                        partnerUuid: trip.partnerUuid,
                        partnerName: trip.partnerName
                      },
                      false
                    );
                  } else {
                    Ui.showWarning({ message: "Không có quyền." });
                  }
                }}
                className="ml-2 mr-1"
              >
                <i className="flaticon2-delete kt-font-warning" />
              </a>
            )}
            {!trip.deactive && !trip.partnerUuid && (
              <a
                title="Hủy về hàng chờ loại xe"
                onClick={e => {
                  if (isHasPermission) {
                    onOpenDragDialog(
                      trip,
                      { isPartner: false, isTrash: true },
                      false
                    );
                  } else {
                    Ui.showWarning({ message: "Không có quyền." });
                  }
                }}
                className="ml-2 mr-1"
              >
                <i className="flaticon2-trash kt-font-danger" />
              </a>
            )}
            {trip.isPartner && (
              <a
                title="Hủy về hàng chờ loại xe"
                onClick={e => {
                  if (isHasPermission) {
                    onOpenDragDialog(
                      trip,
                      { isPartner: false, isTrash: true },
                      false
                    );
                  } else {
                    Ui.showWarning({ message: "Không có quyền." });
                  }
                }}
                className="ml-2 mr-1"
              >
                <i className="flaticon2-trash kt-font-danger" />
              </a>
            )}
          </ContentItem>
          <ContentItem label="Công ty">{trip.customerCode}</ContentItem>
          <ContentItem label="Chuyến bay">
            <span className="ml-2 kt-font-danger">{`${trip.vehicleCodesIn} - ${trip.vehicleTimeIn}`}</span>
          </ContentItem>
          {trip.guideInfo.length > 0 ? (
            <ContentItem label="HDV">
              <ul className="list-unstyled">
                {trip.guideInfo.map((guide, guideId) => {
                  return (
                    <li key={guideId}>
                      {guide.name}
                      {` ${guide.phone ? ` - ${guide.phone}` : ""}`}
                    </li>
                  );
                })}
              </ul>
            </ContentItem>
          ) : (
            <ContentItem label="HDV">{`${trip.guideName} - ${trip.guidePhone}`}</ContentItem>
          )}
          <ContentItem label="Thời gian">
            {`${trip.startDate.format(DATE_TIME_FORMAT.DD_MM_YYYY)} -`}
            <span className="ml-1 kt-font-danger">{`${trip.startDate.format(
              DATE_TIME_FORMAT.HH_MM
            )} -> ${trip.endDate.format(DATE_TIME_FORMAT.HH_MM)}`}</span>
          </ContentItem>
          <ContentItem label="Địa điểm đón">{trip.locationPickup}</ContentItem>
          <ContentItem label="Số khách">{`${trip.guestNumber} - ${trip.nameCountry}`}</ContentItem>
        </div>
        {isSelect ? (
          <>
            <Divider className={classes.divider} type="vertical" />
            <div className={classes.paperRightRoot}>
              <ContentItem label="Mã tuyến">{trip.fixedRouteCode}</ContentItem>
              <ContentItem label="Y/C đặc biệt">
                <Input.TextArea className="kt-font-bold kt-font-dark" disabled rows={5} cols={40} value={trip.bookingNote} />
              </ContentItem>
              <ContentItem label="Ghi chú">{trip.tripsNote}</ContentItem>
              <ContentItem label="Tiếp viên">
                {trip.subDriverName || ""}
              </ContentItem>
              {trip.isOneWay ? (
                <span className="kt-font-danger">*Lịch trình một chiều</span>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    );
  })
);

const TripContent = React.memo(
  ({
    isActive,
    isFinded,
    colorCode,
    codeBooking,
    fixedRouteCode,
    comfirmedByDriver
  }) => {
    return (
      <>
        <div
          className="tT"
          style={{
            background: colorCode
          }}
        >
          {isActive ? (
            <i className="fa fa-lock d-flex align-items-center fz-11" />
          ) : null}
          <span className={isFinded ? "tF" : null}>{codeBooking}</span>
        </div>
        <div className="tB tBC">
          {` ${fixedRouteCode || " "}`}
          {comfirmedByDriver && (
            <i title="Lái xe xác nhận" className="fa fa-check cBD" />
          )}
        </div>
      </>
    );
  }
);

const Box = ({
  isHasPermission,
  isSelect,
  isFinded,
  name,
  trip,
  dustInfo,
  onOpenDragLockTrip,
  onOpenDragDialog,
  onSelectTrip
}) => {
  let _this = {
    clicks: []
  };
  const [{ isDragging }, drag] = useDrag({
    item: { name, type: ItemTypes.BOX },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        handleDrop(dropResult, item);
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const handleDrop = (dropResult, item) => {
    let { active, dustTask } = dropResult;
    if (trip.key === dropResult.key) {
      return;
    }
    if (dustTask) {
      // Ui.showWarning({
      //   message: `Bố nghỉ rồi lốn cái gàn`
      // });
      return;
    }
    let containerVehicleType = dropResult.vehicleType
      ? dropResult.vehicleType.replace("C", "")
      : "0";
    let tripVehicleType = trip.vehicleType
      ? trip.vehicleType.replace("C", "")
      : "0";
    if (parseInt(containerVehicleType) < parseInt(tripVehicleType)) {
      Ui.showWarning({
        message: `Bạn không được đổi loại xe nhỏ hơn khách hàng yêu cầu: ${trip.vehiclesName} - ${trip.vehicleType}`
      });
      return;
    }
    onOpenDragDialog(trip, dropResult, active);
  };
  const [hovered, setHovered] = useState(false);
  const handleHoverChange = visible => {
    setHovered(visible);
  };
  if (isDragging && hovered) {
    setHovered(false);
  }
  return (
    <Popover
      mouseEnterDelay={0.3}
      arrowPointAtCenter={true}
      destroyTooltipOnHide={true}
      content={
        <HoverContent
          isSelect={isSelect}
          isHasPermission={isHasPermission}
          trip={trip}
          onOpenDragDialog={onOpenDragDialog}
        />
      }
      trigger="hover"
      visible={hovered}
      onVisibleChange={handleHoverChange}
    >
      <a
        onClick={e => {
          e.preventDefault();
          _this.clicks.push(new Date().getTime());
          clearTimeout(_this.timeout);
          _this.timeout = window.setTimeout(() => {
            if (
              _this.clicks.length > 1 &&
              _this.clicks[_this.clicks.length - 1] -
                _this.clicks[_this.clicks.length - 2] <
                250
            ) {
              if (isHasPermission) {
                window.open(
                  `/demoBooking?bookingId=${trip["uuidBooking"]}&tripId=${trip.tripId}&codeBooking=${trip.codeBooking}`,
                  "_blank"
                );
                // onViewBooking(trip["uuidBooking"], trip.tripId);
                return;
              } else {
                Ui.showWarning({ message: "Không có quyền." });
              }
              _this.clicks = [];
            } else {
              onSelectTrip(trip, dustInfo);
              _this.clicks = [];
            }
          }, 450);
        }}
        className={classnames({
          b: true,
          isDragging: isDragging,
          selection: isSelect
        })}
        ref={isHasPermission ? drag : null}
        style={{
          left: trip.startPixel,
          width: trip.widthTrip - 1
        }}
      >
        <TripContent
          isActive={trip.isActive}
          isFinded={isFinded}
          fixedRouteCode={trip.fixedRouteCode}
          codeBooking={trip.codeBooking}
          colorCode={trip.colorCode}
          comfirmedByDriver={trip.comfirmedByDriver}
        />
      </a>
    </Popover>
  );
};
export default React.memo(Box);
