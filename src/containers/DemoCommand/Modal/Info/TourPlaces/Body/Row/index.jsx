import React, { memo } from "react";
import Action from "./Cells/Action";
import PreDistance from "./Cells/PreDistance";
import Distance from "./Cells/Distance";
import DateOffSet from "./Cells/DateOffSet";
import Order from "./Cells/Order";
import Route from "./Cells/Route";
import ETA from "./Cells/ETA";

const TourTableBodyRow = memo(({ record, errors, recordId, setTour }) => {
  return (
    <tr>
      <Action recordId={recordId} setTour={setTour} />
      <DateOffSet dateOffSet={record.get("dateOffSet")} />
      <Order order={record.get("order")} />
      <Route
        errors={errors.name}
        name={record.get("name")}
        recordId={recordId}
        setTour={setTour}
      />
      <Distance
        distance={record.get("distance")}
        recordId={recordId}
        setTour={setTour}
      />
      <PreDistance preDistance={record.get("preDistance")} />
      <ETA ETA={record.get("ETA")} recordId={recordId} setTour={setTour} />
    </tr>
  );
});
export default TourTableBodyRow;
