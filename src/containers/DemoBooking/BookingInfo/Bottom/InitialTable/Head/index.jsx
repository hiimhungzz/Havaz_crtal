import React, { memo } from "react";
import _ from "lodash";
const InitialTableHead = memo(({ columns }) => {
  return (
    <thead>
      <tr className="cr-table__head">
        {_.map(columns, (col) => {
          if (col.name === "action") {
            return (
              <th
                style={{
                  position: "sticky",
                  right: 0,
                  zIndex: 302,
                }}
                key={col.name}
                className="align-middle text-center"
              >
                {col.title}
              </th>
            );
          }
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
export default InitialTableHead;
