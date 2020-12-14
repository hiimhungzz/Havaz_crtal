import React, { memo } from "react";
import Price from "./Cells/Price";
import VehicleType from "./Cells/VehicleType";

const HighwayTableBodyRow = memo(({ record, recordId, setHighway }) => {
  return (
    <tr>
      <VehicleType type={record.get("type")} />
      <Price
        price={record.get("price")}
        recordId={recordId}
        setHighway={setHighway}
      />
    </tr>
  );
});
export default HighwayTableBodyRow;
