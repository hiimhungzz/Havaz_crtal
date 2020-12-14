import React, { memo } from "react";
import _ from "lodash";
import VehicleType from "./Cells/VehicleType";
import Route from "./Cells/Route";
import Km from "./Cells/Km";
import MonthlyPrice from "./Cells/MonthlyPrice";
import ExtraTurnPrice from "./Cells/ExtraTurnPrice";
import ExtraOTPrice from "./Cells/ExtraOTPrice";
import ExtraHolidayPrice from "./Cells/ExtraHolidayPrice";
import TurnNumber from "./Cells/TurnNumber";
import Action from "./Cells/Action";
import NumberVehicle from "./Cells/NumberVehicle";

import CostPerKm from './Cells/CostPerKm';
import CostPerKmByHoliday from './Cells/CostPerKmByHoliday';
import CostPerKmByOT from './Cells/CostPerKmByOT';
import KmPackage from './Cells/KmPackage';

const CostTableBodyRow = memo(
  ({contractType, record, recordId, check, errors, setContract }) => {
    let routes = [];
    let vehicleTypes = [];
    if (check.size > 0) {
      if (
        record.get("vehicleTypeId") &&
        check.size > 1
      ) {
        let finded = check.filter(
          (x) =>
            x.get("vehicleType") === record.get("vehicleTypeId") &&
            x.get("route")
        );
        if (finded && finded.size > 0) {
          routes = _.valuesIn(finded.map((x) => x.get("route")).toJS()); 
        }
      }
      if (
        record.get("fixedRouteId") &&
        check.size > 1
      ) {
        let finded = check.filter(
          (x) =>
            x.get("route") === record.get("fixedRouteId") &&
            x.get("vehicleType")
        );
        if (finded && finded.size > 0) {
          vehicleTypes = _.valuesIn(finded.map((x) => x.get("vehicleType")).toJS()); 
        }
      }
    }
    return (
      <tr>
        <Action
          uuid={record.get("uuid")}
          recordId={recordId}
          setContract={setContract}
        />
        <VehicleType
          uuid={record.get("uuid")}
          vehicleTypeId={record.get("vehicleTypeId")}
          vehicleTypeName={record.get("vehicleTypeName")}
          errors={_.get(errors, "vehicleTypeId")}
          recordId={recordId}
          vehicleTypes={vehicleTypes}
          setContract={setContract}
        />
        <Route
          uuid={record.get("uuid")}
          routes={routes}
          fixedRouteId={record.get("fixedRouteId")}
          fixedRouteName={record.get("fixedRouteName")}
          errors={_.get(errors, "fixedRouteId")}
          recordId={recordId}
          setContract={setContract}
        />
        <NumberVehicle
          numberVehicle={record.get("numberVehicle")}
          errors={_.get(errors, "numberVehicle")}
          recordId={recordId}
          setContract={setContract}
        />
        <Km
          distance={record.get("distance")}
          errors={_.get(errors, "distance")}
          recordId={recordId}
          setContract={setContract}
        />
        {
          contractType === '1.4' && (
            <KmPackage
              packageKM={record.get("packageKM")}
              errors={_.get(errors, "packageKM")}
              recordId={recordId}
              setContract={setContract}
            />
          )
        }
        <TurnNumber
          turnNumber={record.get("turnNumber")}
          errors={_.get(errors, "turnNumber")}
          recordId={recordId}
          setContract={setContract}
        />
        <MonthlyPrice
          monthlyPrice={record.get("monthlyPrice")}
          errors={_.get(errors, "monthlyPrice")}
          recordId={recordId}
          setContract={setContract}
        />
        {
          contractType === '1.4' ? (
            <>
              <CostPerKm
                costPerKm={record.get("costPerKm")}
                errors={_.get(errors, "costPerKm")}
                recordId={recordId}
                setContract={setContract}
              />
              <CostPerKmByOT
                costPerKmByOT={record.get("costPerKmByOT")}
                errors={_.get(errors, "costPerKmByOT")}
                recordId={recordId}
                setContract={setContract}
              />
              <CostPerKmByHoliday
                costPerKmByHoliday={record.get("costPerKmByHoliday")}
                errors={_.get(errors, "costPerKmByHoliday")}
                recordId={recordId}
                setContract={setContract}
              />
            </>
          ) : (
            <>
              <ExtraTurnPrice
                extraTurnPrice={record.get("extraTurnPrice")}
                errors={_.get(errors, "extraTurnPrice")}
                recordId={recordId}
                setContract={setContract}
              />
              <ExtraOTPrice
                extraOTPrice={record.get("extraOTPrice")}
                errors={_.get(errors, "extraOTPrice")}
                recordId={recordId}
                setContract={setContract}
              />
              <ExtraHolidayPrice
                extraHolidayPrice={record.get("extraHolidayPrice")}
                errors={_.get(errors, "extraHolidayPrice")}
                recordId={recordId}
                setContract={setContract}
              />
            </>
          )
        }
      </tr>
    );
  }
);
export default CostTableBodyRow;
