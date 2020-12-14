import React, { memo, useCallback, useEffect } from "react";
import PortletBody from "@Components/Portlet/PortletBody";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { Button, Tag, Popover } from "antd";
import _ from "lodash";
import { _$ } from "@Components/Utility/common";
import Dustbin from "./Dustbin";
import OperatingOnDrag from "./OperatingOnDrag";
import { useState } from "react";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import MultiGrid from "react-virtualized/dist/commonjs/MultiGrid";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Ui } from "@Helpers/Ui";
const STYLE = {
  border: "1px solid #ddd"
};
const STYLE_BOTTOM_LEFT_GRID = {
  borderRight: "2px solid #aaa",
  backgroundColor: "#f7f7f7"
};
const STYLE_TOP_LEFT_GRID = {
  borderBottom: "2px solid #aaa",
  borderRight: "2px solid #aaa",
  fontWeight: "bold"
};
const STYLE_TOP_RIGHT_GRID = {
  borderBottom: "2px solid #aaa",
  fontWeight: "bold"
};
const HeaderItem = React.memo(
  ({
    style,
    columnIndex,
    dayOfWeek,
    date,
    dateLunar,
    currentActive,
    setCurrentActive
  }) => {
    return (
      <Button
        onClick={() => {
          setCurrentActive(prevState => {
            let nextState = { ...prevState };
            nextState.columnIndex = columnIndex;
            nextState.rowIndex = false;
            return nextState;
          });
        }}
        type={dayOfWeek === "CN" ? "danger" : "default"}
        style={
          currentActive.columnIndex === columnIndex &&
          currentActive.rowIndex === false
            ? { ...style, borderColor: "#40a9ff" }
            : style
        }
      >
        <span className="kt-font-boldest kt-font-lg mr-1">{`${dayOfWeek}, ${date} `}</span>
        (<span className="kt-font-xs">{`${dateLunar} `}</span>)
      </Button>
    );
  }
);
const SubDriver = React.memo(
  withStyles({
    container: {
      display: "grid",
      gridTemplateColumns: "50px auto"
    },
    subInfo: {
      display: "grid",
      gridAutoFlow: "row"
    }
  })(({ subDrivers, classes }) => {
    return (
      <div className={classes.container}>
        <div>Phụ xe:</div>
        {subDrivers && subDrivers.length > 0 ? (
          <div className={classes.subInfo}>
            {_.map(subDrivers, (sub, subId) => {
              return (
                <span key={subId} className="kt-font-bold">
                  {sub.name
                    ? `${sub.name} ${sub.code ? `(${sub.code})` : ""}`
                    : `(Chưa có)`}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="kt-font-danger">(Chưa có)</div>
        )}
      </div>
    );
  })
);

let multiGrid = null;
let timer = null;
const MainGrid = memo(
  withStyles({
    hasPermission: {
      color: "#646c9a"
    },
    noPermission: {
      color: "#fd397a"
    }
  })(
    ({
      rootData,
      vehicle,
      headerScheduler,
      activeTripNumber,
      inActiveTripNumber,
      search,
      hasPermission,
      onRefresh
    }) => {
      const findedOtherAddress = search.get("findedOtherAddress");
      const findedTripAddress = search.get("findedTripAddress");
      const findedTrip = search.get("findedTrip");
      const findedTripIndex = search.get("findedTripIndex");
      const findedOther = search.get("findedOther");
      const findedOtherIndex = search.get("findedOtherIndex");
      const lastColIndex = headerScheduler.length + 1;
      const vehicleLine = rootData.vehicleLine;
      const tasks = rootData.tasks;
      let vehicleTypeData = rootData.rightSide.vehicleTypeData;

      useEffect(() => {
        if (multiGrid && rootData.totalRow > 0) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (findedTrip.size > 0) {
              setGridConfig(prevState => ({
                ...prevState,
                scrollToColumn: findedTrip
                  .get(findedTripIndex - 1)
                  .get("columnIndex"),
                scrollToRow: findedTrip.get(findedTripIndex - 1).get("rowIndex")
              }));
            }
            if (findedOther.size > 0) {
              setGridConfig(prevState => ({
                ...prevState,
                scrollToColumn: findedOther
                  .get(findedOtherIndex - 1)
                  .get("columnIndex"),
                scrollToRow: findedOther
                  .get(findedOtherIndex - 1)
                  .get("rowIndex")
              }));
            }
            // multiGrid.measureAllCells();
            multiGrid.recomputeGridSize();
            // multiGrid.forceUpdateGrids();
          }, 300);
        }
        return () => {
          clearTimeout(timer);
        };
      });

      const [gridConfig, setGridConfig] = useState({
        fixedColumnCount: 2,
        fixedRowCount: 1,
        rowHeight: 30,
        overscanRowCount: 10,
        scrollingResetTimeInterval: 150,
        columnWidth: 144,
        isScrollingOptOut: true,
        scrollToAlignment: "center",
        // enableFixedRowScroll: true,
        hideTopRightGridScrollbar: true,
        // hideBottomLeftGridScrollbar: true,
        style: STYLE,
        classNameBottomRightGrid: "bottomRightGrid",
        // classNameBottomLeftGrid: "operating-bottomLeft",
        styleBottomLeftGrid: STYLE_BOTTOM_LEFT_GRID,
        styleTopLeftGrid: STYLE_TOP_LEFT_GRID,
        styleTopRightGrid: STYLE_TOP_RIGHT_GRID,
        overscanIndicesGetter: ({
          cellCount, // Number of rows or columns in the current axis
          overscanCellsCount, // Maximum number of cells to over-render in either direction
          startIndex, // Begin of range of visible cells
          stopIndex
        }) => {
          return {
            overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
            overscanStopIndex: Math.min(
              cellCount - 1,
              stopIndex + overscanCellsCount
            )
          };
        }
      });
      const [selectedTrip, setSelectedTrip] = useState({});
      const [selectedDust, setSelectedDust] = useState({});
      const [currentActive, setCurrentActive] = useState({
        rowIndex: false,
        columnIndex: false
      });
      const [dragState, setDragState] = useState({
        isOpenOnDrag: false,
        tripDrag: {},
        dustInfo: {},
        active: false,
        isSameVehicleType: false
      });
      const _handleDragOpen = useCallback((tripDrag, dustInfo, active) => {
        setDragState(prevState => {
          return {
            ...prevState,
            isOpenOnDrag: true,
            tripDrag,
            dustInfo,
            active
          };
        });
      }, []);
      const _handleTripLockOpen = useCallback(
        (tripDrag, dustInfo, isSameVehicleType, active) => {
          setDragState(prevState => {
            return {
              ...prevState,
              isOpenOnDrag: true,
              tripDrag,
              dustInfo,
              isSameVehicleType,
              active
            };
          });
        },
        []
      );
      const _handleSelectTrip = useCallback(
        (trip, dustInfo) => {
          let temp = trip;
          if (trip.tripId === selectedTrip.tripId) {
            temp = {};
          }
          setSelectedTrip(temp);
          setSelectedDust(dustInfo);
        },
        [selectedTrip.tripId]
      );

      const _leftSideRenderer = useCallback(
        ({ columnIndex, key, rowIndex, style }) => {
          let excactStyle = {
            height: style.height,
            width: style.width,
            top: style.top,
            left: style.left
          };
          let leftItemId = `${columnIndex}-${rowIndex}`;
          if (Object.keys(rootData.leftSide.merge).length > 0) {
            let renderItem = null;
            let mergeItem = null;
            let isFinded = false;
            for (let mergeId in rootData.leftSide.merge) {
              mergeItem = rootData.leftSide.merge[mergeId];
              isFinded = findedOtherAddress.get(leftItemId) ? true : false;
              if (mergeId !== leftItemId) {
                if (rootData.leftSide.ignore.find(x => x === leftItemId)) {
                  break;
                } else {
                  let className = "";
                  let type = "";
                  let content = leftItemId;
                  let cell = rootData.leftSide.cells[leftItemId];
                  if (cell) {
                    className = cell.getStyles().className;
                    content = cell.getContent();
                    type = cell.getType();
                  }
                  if (type === "driver") {
                    renderItem = (
                      <Popover
                        key={leftItemId}
                        mouseEnterDelay={0.6}
                        arrowPointAtCenter={true}
                        destroyTooltipOnHide={true}
                        placement="right"
                        title={
                          <div>
                            {cell.getInfo().driverName
                              ? `${cell.getInfo().driverName} ${
                                  cell.getInfo().driverCode
                                    ? `(${cell.getInfo().driverCode})`
                                    : ""
                                }`
                              : `(Chưa có lái xe)`}
                          </div>
                        }
                        content={
                          <SubDriver subDrivers={cell.getInfo().subDrivers} />
                        }
                      >
                        <div
                          className={classNames({
                            [`lit ${className}`]: true,
                            tF: isFinded
                          })}
                          id={leftItemId}
                          key={key}
                          style={excactStyle}
                          dangerouslySetInnerHTML={{
                            __html: content
                          }}
                        />
                      </Popover>
                    );
                  } else {
                    renderItem = (
                      <div
                        className={classNames({
                          [`lit ${className}`]: true,
                          tF: isFinded
                        })}
                        id={leftItemId}
                        key={key}
                        style={excactStyle}
                        dangerouslySetInnerHTML={{
                          __html: content
                        }}
                      />
                    );
                  }
                }
              } else {
                if (mergeItem.getType() === "driver") {
                  renderItem = (
                    <Popover
                      key={leftItemId}
                      mouseEnterDelay={0.6}
                      arrowPointAtCenter={true}
                      destroyTooltipOnHide={true}
                      placement="right"
                      title={
                        <div>
                          {mergeItem.getInfo().driverName
                            ? `${mergeItem.getInfo().driverName} ${
                                mergeItem.getInfo().driverCode
                                  ? `(${mergeItem.getInfo().driverCode})`
                                  : ""
                              }`
                            : `(Chưa có lái xe)`}
                        </div>
                      }
                      content={
                        <SubDriver
                          subDrivers={mergeItem.getInfo().subDrivers}
                        />
                      }
                    >
                      <div
                        className={classNames({
                          "lit mergedCell": true,
                          mergedCellAlignTop:
                            excactStyle.height * mergeItem.getRow() > 500 + 100,
                          tF: isFinded
                        })}
                        id={leftItemId}
                        key={key}
                        style={{
                          ...excactStyle,
                          height: excactStyle.height * mergeItem.getRow(),
                          width: excactStyle.width * mergeItem.getCol()
                        }}
                        dangerouslySetInnerHTML={{
                          __html: mergeItem.getContent()
                        }}
                      />
                    </Popover>
                  );
                } else {
                  renderItem = (
                    <div
                      className={classNames({
                        "lit mergedCell": true,
                        mergedCellAlignTop:
                          excactStyle.height * mergeItem.getRow() > 500 + 100,
                        tF: isFinded
                      })}
                      id={leftItemId}
                      key={key}
                      style={{
                        ...excactStyle,
                        height: excactStyle.height * mergeItem.getRow(),
                        width: excactStyle.width * mergeItem.getCol()
                      }}
                      dangerouslySetInnerHTML={{
                        __html: mergeItem.getContent()
                      }}
                    />
                  );
                }

                break;
              }
            }
            return renderItem;
          } else {
            return (
              <div
                className="lit"
                id={leftItemId}
                key={key}
                style={excactStyle}
              >
                {`${columnIndex}-${rowIndex}`}
              </div>
            );
          }
        },
        [
          findedOtherAddress,
          rootData.leftSide.cells,
          rootData.leftSide.ignore,
          rootData.leftSide.merge
        ]
      );
      const _tripRender = useCallback(
        ({ trip = false, dustInfo, key, style, rowIndex, columnIndex }) => {
          let exactStyle = {
            left: style.left,
            top: style.top
          };
          return (
            <div
              key={key}
              style={exactStyle}
              className={classNames({
                d: true,
                lsC: lastColIndex === columnIndex,
                cA:
                  currentActive.rowIndex === false
                    ? currentActive.columnIndex === columnIndex
                    : currentActive.rowIndex === rowIndex,
                lBU: vehicleLine[rowIndex]
              })}
            >
              <Dustbin
                tasks={tasks}
                trip={trip}
                findedTripAddress={findedTripAddress}
                isHasPermission={hasPermission}
                isSelect={
                  selectedTrip.tripId && selectedTrip.tripId === trip.tripId
                }
                dustInfo={dustInfo}
                onOpenDragDialog={_handleDragOpen}
                onOpenDragLockTrip={_handleTripLockOpen}
                onSelectTrip={_handleSelectTrip}
              />
            </div>
          );
        },
        [
          _handleDragOpen,
          _handleSelectTrip,
          _handleTripLockOpen,
          currentActive.columnIndex,
          currentActive.rowIndex,
          findedTripAddress,
          hasPermission,
          lastColIndex,
          selectedTrip.tripId,
          tasks,
          vehicleLine
        ]
      );
      const _tripArrayRender = useCallback(
        ({ key, style, rowIndex, columnIndex, tripArray }) => {
          let exactStyle = {
            left: style.left,
            top: style.top
          };
          return (
            <div
              key={key}
              style={exactStyle}
              className={classNames({
                d: true,
                lsC: lastColIndex === columnIndex,
                cA:
                  currentActive.rowIndex === false
                    ? currentActive.columnIndex === columnIndex
                    : currentActive.rowIndex === rowIndex,
                lBU: vehicleLine[rowIndex]
              })}
            >
              <Dustbin
                tasks={tasks}
                dustInfo={{ key }}
                tripId={selectedTrip.tripId}
                isTripArray={true}
                tripArray={tripArray}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                vehicleTypeData={vehicleTypeData}
                findedTripAddress={findedTripAddress}
                isHasPermission={hasPermission}
                onOpenDragDialog={_handleDragOpen}
                onOpenDragLockTrip={_handleTripLockOpen}
                onSelectTrip={_handleSelectTrip}
              />
            </div>
          );
        },
        [
          _handleDragOpen,
          _handleSelectTrip,
          _handleTripLockOpen,
          currentActive.columnIndex,
          currentActive.rowIndex,
          findedTripAddress,
          hasPermission,
          lastColIndex,
          selectedTrip.tripId,
          tasks,
          vehicleLine,
          vehicleTypeData
        ]
      );

      const _cellRenderer = useCallback(
        ({ columnIndex, key, rowIndex, style }) => {
          let tripId = `${columnIndex}-${rowIndex}`;

          if (columnIndex < 2 && rowIndex > 0) {
            // Render left side
            return _leftSideRenderer({
              columnIndex,
              key,
              rowIndex,
              style
            });
          } else if (rowIndex < 1 && columnIndex > 1) {
            let headerIndex = columnIndex - 2;
            let headerItem = headerScheduler[headerIndex];
            return (
              <HeaderItem
                key={key}
                style={style}
                columnIndex={columnIndex}
                rowIndex={rowIndex}
                dayOfWeek={headerItem.dayOfWeek}
                date={headerItem.date}
                dateLunar={headerItem.dateLunar}
                setCurrentActive={setCurrentActive}
                currentActive={currentActive}
              />
            );
          } else if (rowIndex > 0 && columnIndex > 1) {
            let trips = rootData.trips;
            if (_.isArray(trips[tripId]) && trips[tripId].length > 0) {
              return _tripArrayRender({
                key: key,
                style: style,
                rowIndex: rowIndex,
                columnIndex: columnIndex,
                tripArray: trips[tripId]
              });
            } else {
              let trip = trips[tripId] || false;
              let dustInfo = { key: tripId };
              let loaiXeTmp = vehicleTypeData[rowIndex];
              let xeTmp = {};
              let driverTmp = {};
              let loaiXe = {};
              let xe = {};
              let driver = {};
              if (_.isFunction(loaiXeTmp)) {
                loaiXe = loaiXeTmp(vehicleTypeData); // data câp 1
                xeTmp = loaiXe[rowIndex];
                if (_.isFunction(xeTmp)) {
                  xe = xeTmp(loaiXe); // data cấp 2
                  if (xe === "inActive") {
                    dustInfo = {
                      key: tripId,
                      sh: loaiXe.sh,
                      ve: {},
                      dr: {},
                      active: false
                    };
                    return _tripRender({
                      trip,
                      dustInfo,
                      key,
                      style,
                      rowIndex,
                      columnIndex
                    });
                  } else if (_.isObject(xe)) {
                    driverTmp = xe[rowIndex];
                    if (_.isFunction(driverTmp)) {
                      driver = driverTmp(xe);
                      if (_.isObject(driver)) {
                        dustInfo = {
                          key: tripId,
                          sh: loaiXe.sh,
                          ve: xe.ve,
                          dr: driver.dr,
                          active: true
                        };
                        return _tripRender({
                          trip,
                          dustInfo,
                          key,
                          style,
                          rowIndex,
                          columnIndex
                        });
                      }
                    } else if (_.isObject(driverTmp)) {
                      driver = driverTmp;
                      dustInfo = {
                        key: tripId,
                        sh: loaiXe.sh,
                        ve: xe.ve,
                        dr: driver.dr,
                        active: true
                      };
                      return _tripRender({
                        trip,
                        dustInfo,
                        key,
                        style,
                        rowIndex,
                        columnIndex
                      });
                    }
                  }
                } else if (_.isObject(xeTmp)) {
                  xe = xeTmp;
                  driverTmp = xe[rowIndex];
                  if (_.isFunction(driverTmp)) {
                    driver = driverTmp(xe);
                    if (_.isObject(driver)) {
                      dustInfo = {
                        key: tripId,
                        sh: loaiXe.sh,
                        vh: xe.vh,
                        dr: driver.dr,
                        active: true
                      };
                      return (
                        <div key={key} style={style}>
                          <Dustbin
                            tasks={tasks}
                            trip={trip}
                            dustInfo={dustInfo}
                          />
                        </div>
                      );
                    }
                  } else if (_.isObject(driverTmp)) {
                    driver = driverTmp;
                    dustInfo = {
                      key: tripId,
                      sh: loaiXe.sh,
                      ve: xe.ve,
                      dr: driver.dr,
                      active: true
                    };
                    return _tripRender({
                      trip,
                      dustInfo,
                      key,
                      style,
                      rowIndex,
                      columnIndex
                    });
                  }
                } else if (xeTmp === "inActive") {
                  dustInfo = {
                    key: tripId,
                    sh: loaiXe.sh,
                    ve: {},
                    dr: {},
                    active: false
                  };
                  return _tripRender({
                    trip,
                    dustInfo,
                    key,
                    style,
                    rowIndex,
                    columnIndex
                  });
                }
              } else if (_.isObject(loaiXeTmp)) {
                loaiXe = loaiXeTmp;
                xeTmp = loaiXe[rowIndex];
                if (_.isFunction(xeTmp)) {
                  xe = xeTmp(loaiXe); // data cấp 2
                  driverTmp = xe[rowIndex];
                  if (_.isFunction(driverTmp)) {
                    driver = driverTmp(xe);
                    if (_.isObject(driver)) {
                      dustInfo = {
                        key: tripId,
                        sh: loaiXe.sh,
                        ve: xe.ve,
                        dr: driver.dr,
                        active: true
                      };
                      return _tripRender({
                        trip,
                        dustInfo,
                        key,
                        style,
                        rowIndex,
                        columnIndex
                      });
                    }
                  } else if (_.isObject(driverTmp)) {
                    driver = driverTmp;
                    dustInfo = {
                      key: tripId,
                      sh: loaiXe.sh,
                      ve: xe.ve,
                      dr: driver.dr,
                      active: true
                    };
                    return _tripRender({
                      trip,
                      dustInfo,
                      key,
                      style,
                      rowIndex,
                      columnIndex
                    });
                  }
                } else if (_.isObject(xeTmp)) {
                  xe = xeTmp;
                  driverTmp = xe[rowIndex];
                  if (_.isFunction(driverTmp)) {
                    driver = driverTmp(xe);
                    if (_.isObject(driver)) {
                      dustInfo = {
                        key: tripId,
                        sh: loaiXe.sh,
                        ve: xe.ve,
                        dr: driver.dr,
                        active: true
                      };
                      return _tripRender({
                        trip,
                        dustInfo,
                        key,
                        style,
                        rowIndex,
                        columnIndex
                      });
                    }
                  } else if (_.isObject(driverTmp)) {
                    driver = driverTmp;
                    dustInfo = {
                      key: tripId,
                      sh: loaiXe.sh,
                      ve: xe.ve,
                      dr: driver.dr,
                      active: true
                    };
                    return _tripRender({
                      trip,
                      dustInfo,
                      key,
                      style,
                      rowIndex,
                      columnIndex
                    });
                  }
                } else if (xeTmp === "inActive") {
                  dustInfo = {
                    key: tripId,
                    sh: loaiXe.sh,
                    ve: {},
                    dr: {},
                    active: false
                  };
                  return _tripRender({
                    trip,
                    dustInfo,
                    key,
                    style,
                    rowIndex,
                    columnIndex
                  });
                }
              }
              return _tripRender({
                trip,
                dustInfo,
                key,
                style,
                rowIndex,
                columnIndex
              });
            }
          } else if (rowIndex < 1 && columnIndex < 2) {
            style.justifyContent = "flex-start";
            style.paddingLeft = 5;
            if (columnIndex === 0) {
              return (
                <div className="lit" id={tripId} key={key} style={style}>
                  Chưa điều:
                  <Tag className="ml-2" color="#f50">
                    {inActiveTripNumber}
                  </Tag>
                </div>
              );
            } else {
              return (
                <div className="lit" id={tripId} key={key} style={style}>
                  Đã điều:
                  <Tag className="ml-2" color="#108ee9">
                    {activeTripNumber}
                  </Tag>
                </div>
              );
            }
          }
        },
        [
          _leftSideRenderer,
          headerScheduler,
          currentActive,
          rootData.trips,
          _tripArrayRender,
          vehicleTypeData,
          _tripRender,
          tasks,
          inActiveTripNumber,
          activeTripNumber
        ]
      );

      const _handleKeyDown = useCallback(
        e => {
          e.stopPropagation();
          if (e.keyCode === 13 && e.ctrlKey) {
            if (hasPermission) {
              if (selectedTrip.tripId) {
                _handleDragOpen(selectedTrip, selectedDust, true);
                return;
              } else {
                Ui.showWarning({ message: "Chưa có Trip nào được chọn." });
                return;
              }
            } else {
              Ui.showWarning({ message: "Không có quyền." });
              return;
            }
          }
        },
        [_handleDragOpen, hasPermission, selectedDust, selectedTrip]
      );
      useEffect(() => {
        _$("body").off("keydown");
        _$("body").keydown(_handleKeyDown);
        return () => {
          _$("body").off("keydown");
        };
      }, [_handleKeyDown]);
      return (
        <PortletBody>
          <AutoSizer disableHeight>
            {({ width }) => (
              <MultiGrid
                ref={ref => (multiGrid = ref)}
                {...gridConfig}
                cellRenderer={_cellRenderer}
                columnCount={headerScheduler.length + 2}
                height={_$(window).height() - 196}
                rowCount={rootData.totalRow}
                width={width}
              />
            )}
          </AutoSizer>
          {dragState.isOpenOnDrag && (
            <OperatingOnDrag
              vehicle={vehicle}
              trip={dragState.tripDrag}
              active={dragState.active}
              dustInfo={dragState.dustInfo}
              open={dragState.isOpenOnDrag}
              onClose={() => {
                setDragState(prevState => ({
                  ...prevState,
                  isOpenOnDrag: false
                }));
                _.delay(onRefresh, 800);
              }}
            />
          )}
        </PortletBody>
      );
    }
  )
);
export default DragDropContext(HTML5Backend)(MainGrid);
