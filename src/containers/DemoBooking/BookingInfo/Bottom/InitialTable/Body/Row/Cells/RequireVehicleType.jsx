import React, { memo } from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { InputNumber, Checkbox } from "antd";
import _ from "lodash";
import VehicleTypeNoOrg from "@Components/SelectContainer/VehicleTypeNoOrg";
import { Ui } from "@Helpers/Ui";
import ServiceBase from "@Services/ServiceBase";
import { API_URI } from "@Constants";
import { List, Map } from "immutable";

const defaultMap = Map();
const RequireVehicleTypeRow = memo(
  ({
    item,
    itemIndex,
    rowIndex,
    organizationId,
    fixedRoutesId,
    tripDate,
    errors,
    handleChangeRequireVehilceType,
    handleChangeVehicleNumber,
    handleChangeDistance,

    handleChangeOverNightCost,
    handleChangeHighway,
    handleDeleteRequireVehicleType,
    handleCopyRequireVehicleTypeItem,
    handleAddNextRequireVehicleTypeItem,
    handleAddAllRequireVehicleTypeItem,

    ...restProps
  }) => {
    return (
      <div {...restProps}>
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-clean btn-sm btn-icon btn-icon-md"
            onClick={(e) =>
              handleDeleteRequireVehicleType({
                itemIndex,
                rowIndex,
              })
            }
            title="Xóa trip"
          >
            <i className="flaticon2-trash d-flex align-items-center text-danger" />
          </button>
        </div>
        <RequireVehicleTypeItem
          organizationId={organizationId}
          errors={errors.get("requireVehicleTypeId")}
          fixedRoutesId={fixedRoutesId}
          tripDate={tripDate}
          itemIndex={itemIndex}
          rowIndex={rowIndex}
          requireVehicleTypeIds={
            item.get("requireVehicleTypeId")
              ? {
                  key: item.get("requireVehicleTypeId"),
                  label: item.get("requireVehicleTypeName"),
                }
              : undefined
          }
          handleChangeRequireVehilceType={handleChangeRequireVehilceType}
        />
        <VehicleNumberItem
          vehicleNumber={item.get("vehicleNumber")}
          errors={errors.get("vehicleNumber")}
          itemIndex={itemIndex}
          rowIndex={rowIndex}
          handleChangeVehicleNumber={handleChangeVehicleNumber}
        />
        <DistanceItem
          distance={item.get("distance")}
          itemIndex={itemIndex}
          rowIndex={rowIndex}
          handleChangeDistance={handleChangeDistance}
        />
        <OverNightCostItem
          hasOverNightCost={item.get("hasOverNightCost")}
          itemIndex={itemIndex}
          rowIndex={rowIndex}
          handleChangeOverNightCost={handleChangeOverNightCost}
        />
        <HighwayItem
          hasHighway={item.get("hasHighway")}
          itemIndex={itemIndex}
          rowIndex={rowIndex}
          handleChangeHighway={handleChangeHighway}
        />
        <div className="d-flex">
          <button
            type="button"
            title="Copy"
            onClick={(e) =>
              handleCopyRequireVehicleTypeItem({
                rowIndex,
                itemIndex,
              })
            }
            className="btn btn-clean btn-sm btn-icon btn-icon-md"
          >
            <i className="la la-copy kt-font-bolder kt-font-xl" />
          </button>
        </div>
        <div className="d-flex">
          <button
            type="button"
            title="Thêm dòng dưới"
            className="btn btn-clean btn-sm btn-icon btn-icon-md"
            onClick={(e) =>
              handleAddNextRequireVehicleTypeItem({
                rowIndex,
                itemIndex,
              })
            }
          >
            <i className="la la-angle-down kt-font-bolder kt-font-xl" />
          </button>
        </div>
        <div className="d-flex">
          <button
            type="button"
            title="Thêm tất cả dòng"
            className="btn btn-clean btn-sm btn-icon btn-icon-md"
            onClick={(e) =>
              handleAddAllRequireVehicleTypeItem({
                rowIndex,
                itemIndex,
              })
            }
          >
            <i className="la la-angle-double-down kt-font-bolder kt-font-xl" />
          </button>
        </div>
      </div>
    );
  }
);
const RequireVehicleTypeItem = memo(
  ({
    organizationId,
    requireVehicleTypeIds,
    fixedRoutesId,
    tripDate,
    rowIndex,
    itemIndex,
    errors,
    handleChangeRequireVehilceType,
  }) => {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <VehicleTypeNoOrg
          className={classNames({
            "border-invalid": errors,
          })}
          style={{ width: "100%", minWidth: 220 }}
          value={requireVehicleTypeIds}
          onSelect={async (vehicleType, data) => {
            if (!fixedRoutesId) {
              Ui.showWarning({
                message: "Chưa chọn tuyến đường.",
              });
              return;
            }
            if (!tripDate) {
              Ui.showWarning({
                message: "Chưa chọn ngày.",
              });
              return;
            }
            let result = { value: {} };
            if (vehicleType) {
              result = await ServiceBase.requestJson({
                url: API_URI.READ_ROUTE_BOOKING,
                method: "POST",
                data: {
                  fixedRoutesId: fixedRoutesId,
                  customerId: organizationId,
                  filterDatetime: tripDate,
                  vehicleTypeId: vehicleType.key,
                },
              });
              if (result.hasErrors) {
                Ui.showErrors(result.errors);
                return;
              }
              let finded = _.find(data, (x) => x.key === vehicleType.key);
              vehicleType = {
                ...vehicleType,
                ...result.value.data,
                seats: finded.seats,
              };
            } else {
              vehicleType = { ...result.value };
            }
            handleChangeRequireVehilceType({
              vehicleType,
              rowIndex,
              itemIndex,
            });
          }}
        />
      </div>
    );
  }
);
const VehicleNumberItem = withStyles({
  control: {
    "& .ant-input-number-input": {
      textAlign: "center",
    },
  },
})(
  memo(
    ({
      vehicleNumber,
      rowIndex,
      itemIndex,
      errors,
      classes,
      handleChangeVehicleNumber,
    }) => {
      return (
        <div className="d-flex justify-content-center align-items-center">
          <InputNumber
            min={0}
            className={classNames({
              "border-invalid": errors,
              [classes.control]: true,
            })}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            value={vehicleNumber}
            onChange={(vehicleNumber) =>
              handleChangeVehicleNumber({ vehicleNumber, rowIndex, itemIndex })
            }
          />
        </div>
      );
    }
  )
);
const DistanceItem = withStyles({
  control: {
    "& .ant-input-number-input": {
      textAlign: "right",
    },
  },
})(
  memo(({ distance, rowIndex, itemIndex, classes, handleChangeDistance }) => {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <InputNumber
          className={classes.control}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          value={distance}
          onChange={(distance) =>
            handleChangeDistance({ distance, rowIndex, itemIndex })
          }
        />
      </div>
    );
  })
);
const OverNightCostItem = memo(
  ({ hasOverNightCost, rowIndex, itemIndex, handleChangeOverNightCost }) => {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Checkbox
          checked={hasOverNightCost}
          onChange={(e) =>
            handleChangeOverNightCost({
              hasOverNightCost: e.target.checked,
              rowIndex: rowIndex,
              itemIndex: itemIndex,
            })
          }
        >
          Lưu đêm
        </Checkbox>
      </div>
    );
  }
);
const HighwayItem = memo(
  ({ hasHighway, rowIndex, itemIndex, handleChangeHighway }) => {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Checkbox
          checked={hasHighway}
          onChange={(e) =>
            handleChangeHighway({
              hasHighway: e.target.checked,
              rowIndex: rowIndex,
              itemIndex: itemIndex,
            })
          }
        >
          Cao tốc
        </Checkbox>
      </div>
    );
  }
);

const RequireVehicleType = memo(
  withStyles({
    gridRootContainer: {
      display: "grid",
      gridTemplateColumns: "auto",
      gridGap: 5,
    },
    gridVehicleTypeContainer: {
      display: "grid",
      gridTemplateColumns: "25px auto 40px 50px 90px 90px 25px 25px 25px",
      gridGap: 3,
    },
    col: { minWidth: 500, verticalAlign: "middle !important" },
  })(
    ({
      requireVehicleTypes,
      rowIndex,
      organizationId,
      fixedRoutesId,
      tripDate,
      classes,
      errors,
      handleDeleteRequireVehicleType,
      handleCopyRequireVehicleTypeItem,
      handleAddNextRequireVehicleTypeItem,
      handleAddAllRequireVehicleTypeItem,
      handleChangeRequireVehilceType,
      handleChangeVehicleNumber,
      handleChangeDistance,
      handleChangeOverNightCost,
      handleChangeHighway,
    }) => {
      return (
        <td key={rowIndex} className={classes.col}>
          <div className={classes.gridRootContainer}>
            {requireVehicleTypes.size > 0 ? (
              <>
                <div className={classes.gridVehicleTypeContainer}>
                  <div />
                  <div />
                  <div className="text-center">
                    <label className="mb-0">Xe số</label>
                  </div>
                  <div className="text-center">
                    <label className="mb-0">Km</label>
                  </div>
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </div>

                {requireVehicleTypes.map((item, itemId) => {
                  return (
                    <RequireVehicleTypeRow
                      organizationId={organizationId}
                      fixedRoutesId={fixedRoutesId}
                      tripDate={tripDate}
                      key={itemId}
                      item={item}
                      itemIndex={itemId}
                      rowIndex={rowIndex}
                      className={classes.gridVehicleTypeContainer}
                      errors={
                        errors && errors.size > 0 && errors.get(itemId)
                          ? errors.get(itemId)
                          : defaultMap
                      }
                      handleDeleteRequireVehicleType={
                        handleDeleteRequireVehicleType
                      }
                      handleChangeRequireVehilceType={
                        handleChangeRequireVehilceType
                      }
                      handleCopyRequireVehicleTypeItem={
                        handleCopyRequireVehicleTypeItem
                      }
                      handleAddNextRequireVehicleTypeItem={
                        handleAddNextRequireVehicleTypeItem
                      }
                      handleAddAllRequireVehicleTypeItem={
                        handleAddAllRequireVehicleTypeItem
                      }
                      handleChangeVehicleNumber={handleChangeVehicleNumber}
                      handleChangeDistance={handleChangeDistance}
                      handleChangeOverNightCost={handleChangeOverNightCost}
                      handleChangeHighway={handleChangeHighway}
                    />
                  );
                })}
              </>
            ) : (
              _.isString(errors) && (
                <span className="kt-font-danger kt-font-bold mt-3">
                  {errors}
                </span>
              )
            )}
          </div>
        </td>
      );
    }
  )
);

export default RequireVehicleType;
