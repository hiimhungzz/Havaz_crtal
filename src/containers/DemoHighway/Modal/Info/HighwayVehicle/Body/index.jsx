import React, { memo } from "react";
import HighwayTableBodyRow from "./Row";
const HighwayTableBody = memo(({ grid, setHighway }) => {
  return (
    <tbody>
      {grid.entrySeq().map(([recordId, record], stt) => {
        return (
          <HighwayTableBodyRow
            key={stt}
            record={record}
            recordId={stt}
            setHighway={setHighway}
          />
        );
      })}
    </tbody>
  );
});
export default HighwayTableBody;
