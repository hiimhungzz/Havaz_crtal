import React, { memo } from "react";
import PointTableBodyRow from "./Row";
let defaultError = {};
const PointTableBody = memo(({ grid, routeErrors, setRoute }) => {
  return (
    <tbody>
      {grid.entrySeq().map(([recordId, record], stt) => {
        return (
          <PointTableBodyRow
            key={stt}
            record={record}
            errors={routeErrors[stt] || defaultError}
            recordId={stt}
            setRoute={setRoute}
          />
        );
      })}
    </tbody>
  );
});
export default PointTableBody;
