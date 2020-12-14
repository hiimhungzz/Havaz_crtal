import React, { memo } from "react";
import _ from "lodash";
import CostTableBodyRow from "./Row";

const defaultMap = {};

const CostTableBody = memo(({contractType, grid, check, contractErrors, setContract }) => {
  return (
    <tbody>
      {grid.entrySeq().map(([recordId, record], stt) => {
        return (
          <CostTableBodyRow
            key={stt}
            contractType={contractType}
            record={record}
            check={check}
            recordId={stt}
            errors={_.get(contractErrors, stt) || defaultMap}
            setContract={setContract}
          />
        );
      })}
    </tbody>
  );
});
export default CostTableBody;
