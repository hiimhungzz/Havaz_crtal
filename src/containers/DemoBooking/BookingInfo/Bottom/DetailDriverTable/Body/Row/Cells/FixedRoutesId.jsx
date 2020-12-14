import React, { memo, useCallback, useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import I from "components/I";
import { Map, fromJS } from "immutable";
import { Button, Modal, Row, Col, Input, Divider, InputNumber } from "antd";
import ServiceBase from "services/ServiceBase";
import { Ui } from "helpers/Ui";
import TypePlace from "components/SelectContainer/TypePlace";
import PlacesLocation from "components/SelectContainer/PlacesLocation";

const Points = memo(
  withStyles({})(
    ({ points, fixedRoutesId, pickUpAt, rowId, setBottomDetailDataSource }) => {
      let data = points ? points.toJS():[];
      const _handleAddPoint = useCallback(
        (recordId) => {
          setBottomDetailDataSource((prevState) => {
            let nextState = prevState;
            nextState = nextState.updateIn(
              ["detail", rowId, "points", fixedRoutesId],
              (x) => {
                x = x.insert(
                  recordId,
                  Map({
                    status: 1,
                    tripPickUpAt: pickUpAt,
                  })
                );
                return x;
              }
            );
            return nextState;
          });
        },
        [pickUpAt, rowId, fixedRoutesId, setBottomDetailDataSource]
      );
      const _handleDeletePoint = useCallback(
        (recordId) => {
          setBottomDetailDataSource((prevState) => {
            let nextState = prevState;
            nextState = nextState.updateIn(
              ["detail", rowId, "points", fixedRoutesId],
              (x) => {
                x = x.delete(recordId);
                return x;
              }
            );
            return nextState;
          });
        },
        [fixedRoutesId, rowId, setBottomDetailDataSource]
      );
      const _handleSelectTypePlace = useCallback(
        (typePlace, recordId) => {
          setBottomDetailDataSource((prevState) => {
            let nextState = prevState;
            nextState = nextState.setIn(
              [
                "detail",
                rowId,
                "points",
                fixedRoutesId,
                recordId,
                "pointCategory",
              ],
              typePlace
            );
            return nextState;
          });
        },
        [rowId, fixedRoutesId, setBottomDetailDataSource]
      );
      const _handleSelectLocation = useCallback(
        (place, recordId) => {
          setBottomDetailDataSource((prevState) => {
            let nextState = prevState;
            nextState = nextState.setIn(
              [
                "detail",
                rowId,
                "points",
                fixedRoutesId,
                recordId,
                "pickUpAddress",
              ],
              _.get(place, "label", "")
            );
            return nextState;
          });
          if (place && place.key) {
            _.delay(async () => {
              let result = await ServiceBase.requestJson({
                baseUrl: "https://place.havaz.vn/api",
                method: "GET",
                url: `/v1/places/${place.key}`,
                data: {
                  api_token:
                    "hmtvxAd5AQLAaUpjDGEqTZIj2DnR1dGBW7uugUG1gJyvsWVFzIh6n5It6RMk",
                },
              });
              if (result.hasErrors) {
                Ui.showErrors(result.errors);
              } else {
                setBottomDetailDataSource((prevState) => {
                  let nextState = prevState;
                  nextState = nextState.setIn(
                    [
                      "detail",
                      rowId,
                      "points",
                      fixedRoutesId,
                      recordId,
                      "pickUpLocation",
                    ],
                    `${result.value.location.lat},${result.value.location.lng}`
                  );
                  return nextState;
                });
              }
            }, 100);
          }
        },
        [fixedRoutesId, rowId, setBottomDetailDataSource]
      );
      if (data.length === 0) {
        return (
          <Row gutter={[8, 8]}>
            <Col span={20} offset={4}>
              <button
                onClick={(e) => _handleAddPoint(0)}
                type="button"
                title="Thêm điểm dừng"
                class="btn btn-clean btn-sm btn-icon btn-icon-md"
              >
                <I className="fa fa-plus" />
              </button>
            </Col>
          </Row>
        );
      }
      return _.map(data, (record, recordId) => {
        let disabled = false;
        if (_.get(record, "uuid")) {
          disabled = true;
        }
        let isLastRow = false;
        if (recordId === _.size(data) - 1) {
          isLastRow = true;
        }
        return (
          <Row key={recordId} gutter={[8, 8]}>
            <Col span={20} offset={4}>
              <button
                onClick={(e) => _handleAddPoint(recordId)}
                type="button"
                title="Thêm điểm dừng"
                class="btn btn-clean btn-sm btn-icon btn-icon-md"
              >
                <I className="fa fa-plus" />
              </button>
            </Col>

            <Col span={1}>
              {!disabled && (
                <button
                  onClick={(e) => _handleDeletePoint(recordId)}
                  type="button"
                  title="Xóa điểm dừng"
                  class="btn btn-clean btn-sm btn-icon btn-icon-md"
                >
                  <I className="fa fa-trash kt-font-danger" />
                </button>
              )}
            </Col>
            <Col span={11}>
              <PlacesLocation
                disabled={disabled}
                value={
                  _.get(record, "pickUpAddress")
                    ? {
                        key: _.get(record, "pickUpAddress"),
                        label: _.get(record, "pickUpAddress"),
                      }
                    : undefined
                }
                onSelect={(place) => _handleSelectLocation(place, recordId)}
              />
            </Col>
            <Col span={3}>
              <InputNumber
                disabled={disabled}
                value={_.get(record, "minutes")}
                onChange={(value) => {
                  setBottomDetailDataSource((prevState) => {
                    let nextState = prevState;
                    nextState = nextState.setIn(
                      [
                        "detail",
                        rowId,
                        "points",
                        fixedRoutesId,
                        recordId,
                        "minutes",
                      ],
                      value
                    );
                    return nextState;
                  });
                }}
                addonAfter="phút"
              />
            </Col>
            <Col span={4}>
              <InputNumber
                disabled={disabled}
                value={_.get(record, "timeDelay")}
                addonAfter="phút"
                onChange={(value) => {
                  setBottomDetailDataSource((prevState) => {
                    let nextState = prevState;
                    nextState = nextState.setIn(
                      [
                        "detail",
                        rowId,
                        "points",
                        fixedRoutesId,
                        recordId,
                        "timeDelay",
                      ],
                      value
                    );
                    return nextState;
                  });
                }}
              />
            </Col>
            <Col span={5}>
              <TypePlace
                disabled={disabled}
                value={_.get(record, "pointCategory")}
                onSelect={(type) => _handleSelectTypePlace(type, recordId)}
              />
            </Col>
            {isLastRow && (
              <Col span={20} offset={4}>
                <button
                  onClick={(e) => _handleAddPoint(recordId + 1)}
                  type="button"
                  title="Thêm điểm dừng"
                  class="btn btn-clean btn-sm btn-icon btn-icon-md"
                >
                  <I className="fa fa-plus" />
                </button>
              </Col>
            )}
          </Row>
        );
      });
    }
  )
);
const PointModal = memo(
  ({
    fixedRoutesId,
    fixedRoutesName,
    pickUpAt,
    tripId,
    rowId,
    points,
    showModal,
    setShowModal,
    setBottomDetailDataSource,
  }) => {
    const _browsePoint = useCallback(async () => {
      let result = await ServiceBase.requestJson({
        method: "GET",
        url: `/trip-points/${tripId}`,
        data: {},
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        setBottomDetailDataSource((prevState) => {
          let nextState = prevState;
          nextState = nextState.setIn(
            ["detail", rowId, "points", fixedRoutesId],
            fromJS(
              _.map(_.get(result, "value", []), (x) => {
                x.tripPickUpAt = pickUpAt;
                return x;
              })
            )
          );
          return nextState;
        });
      }
    }, [tripId, setBottomDetailDataSource, rowId, fixedRoutesId, pickUpAt]);
    const _browsePointByRoute = useCallback(async () => {
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: `/routes/read`,
        data: {
          uuid: fixedRoutesId,
        },
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        setBottomDetailDataSource((prevState) => {
          let nextState = prevState;
          nextState = nextState.setIn(
            ["detail", rowId, "points", fixedRoutesId],
            fromJS(
              _.map(_.get(result, "value.point", []), (x) => {
                return {
                  status: 1,
                  pickUpAddress: x.address,
                  pickUpLocation: _.isObject(x.location)
                    ? `${_.get(x, "location.x", "")},${_.get(
                        x,
                        "location.y",
                        ""
                      )}`
                    : x.location,
                  timeDelay: x.timeLatency,
                  pointCategory: _.toString(x.typePlace),
                  minutes: x.timePickup,
                  tripPickUpAt: pickUpAt,
                };
              })
            )
          );
          return nextState;
        });
      }
    }, [fixedRoutesId, setBottomDetailDataSource, rowId, pickUpAt]);
    const _handleCancelModal = useCallback(() => {
      setShowModal(false);
    }, [setShowModal]);
    const _handleSubmit = useCallback(() => {
      _handleCancelModal();
    }, [_handleCancelModal]);
    useEffect(() => {
      if (
        tripId &&
        points &&
        showModal &&
        points.size === 0
      ) {
        _browsePoint();
      } else if (
        tripId &&
        !points &&
        showModal
      ) {
        _browsePointByRoute();
      } else if (!tripId && showModal && points.size === 0) {
        _browsePointByRoute();
      }
    }, [
      tripId,
      showModal,
      _browsePoint,
      points,
      _browsePointByRoute,
      fixedRoutesId,
    ]);
    return (
      <Modal
        width="1000px"
        visible={showModal}
        title="Thêm điểm dừng"
        onOk={_handleSubmit}
        bodyStyle={{
          maxHeight: "calc(100vh - 300px)",
          overflow: "scroll",
        }}
        onCancel={_handleCancelModal}
        footer={[
          <Button key="cancel" type="danger" onClick={_handleCancelModal}>
            Xác nhận
          </Button>,
        ]}
      >
        <Row gutter={[8, 8]}>
          <Col span={4}>
            <label>Tuyến đường</label>
          </Col>
          <Col span={20}>
            <Input disabled title={fixedRoutesName} value={fixedRoutesName} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <label>Điểm dừng</label>
          </Col>
        </Row>
        <Points
          fixedRoutesId={fixedRoutesId}
          points={points}
          rowId={rowId}
          pickUpAt={pickUpAt}
          setBottomDetailDataSource={setBottomDetailDataSource}
        />
      </Modal>
    );
  }
);

const FixedRoutesId = memo(
  withStyles({
    col: {
      width: 600,
      maxWidth: 600,
      minWidth: 600,
    },
    outerGridContainer: {
      display: "grid",
      gridTemplateColumns: "auto 30px",
    },
    action: {
      display: "flex",
      alignItems: "center",
    },
    gridContainer: {
      display: "grid",
    },
    gridItem: {
      whiteSpace: "break-spaces",
    },
  })(
    ({
      fixedRoutesId,
      fixedRoutesName,
      fixedRoutesCode,
      tripId,
      rowId,
      pickUpAt,
      points,
      setBottomDetailDataSource,
      classes,
    }) => {
      const [showModal, setShowModal] = useState(false);
      const _handleShowModal = useCallback(() => {
        setShowModal(true);
      }, []);
      return (
        <td className={`align-middle text-center ${classes.col}`}>
          <div className={classes.outerGridContainer}>
            <div className={classes.gridContainer}>
              <div
                className={`d-flex align-items-center justify-content-center kt-font-md kt-font-bold ${classes.gridItem}`}
              >
                {fixedRoutesName}
              </div>
              <div
                className={`d-flex align-items-center justify-content-center kt-font-lg font-italic ${classes.gridItem}`}
              >
                {fixedRoutesCode}
              </div>
            </div>
            <div className={classes.action}>
              <button
                onClick={_handleShowModal}
                type="button"
                title="Thêm điểm dừng"
                class="btn btn-clean btn-sm btn-icon btn-icon-md"
              >
                <I className="fa fa-plus" />
              </button>
            </div>
          </div>
          <PointModal
            showModal={showModal}
            setShowModal={setShowModal}
            fixedRoutesId={fixedRoutesId}
            fixedRoutesName={fixedRoutesName}
            tripId={tripId}
            rowId={rowId}
            pickUpAt={pickUpAt}
            points={points}
            setBottomDetailDataSource={setBottomDetailDataSource}
          />
        </td>
      );
    }
  )
);
export default FixedRoutesId;
