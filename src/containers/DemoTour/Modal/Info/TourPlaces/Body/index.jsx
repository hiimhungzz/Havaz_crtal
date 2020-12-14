import React, { memo } from "react";
import TourTableBodyRow from "./Row";
let defaultMap = {};
const TourTableBody = memo(({ grid, errors, setTour }) => {
  return (
    <tbody>
      {grid.entrySeq().map(([recordId, record], stt) => {
        return (
          <TourTableBodyRow
            key={stt}
            errors={errors[stt] || defaultMap}
            record={record}
            recordId={stt}
            setTour={setTour}
          />
        );
      })}
    </tbody>
  );
});
export default TourTableBody;
