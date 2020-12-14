import React, { memo } from "react";
import _ from "lodash";
const PointTableHead = memo(({ columns }) => {
  return (
    <thead>
      <tr className="cr-table__head">
        {_.map(columns, col => {
          return (
            <th key={col.name} className="align-middle text-center">
              {col.title}
            </th>
          );
        })}
      </tr>
    </thead>
  );
});
export default PointTableHead;
