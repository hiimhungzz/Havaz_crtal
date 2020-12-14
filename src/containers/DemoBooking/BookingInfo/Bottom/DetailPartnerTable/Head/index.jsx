import React, { memo } from "react";
import _ from "lodash";
const DetailPartnerTableHead = memo(({ columns }) => {
  return (
    <thead>
      <tr className="cr-table__head">
        {_.map(columns, col => {
          if (col.name === "partnersAmount") {
            return (
              <th
                key={col.name}
                className="align-middle text-center sticky-col"
              >
                {col.title}
              </th>
            );
          }
          if (col.name === "stt") {
            return (
              <th
                key={col.name}
                className="align-middle text-center sticky-left-col"
              >
                {col.title}
              </th>
            );
          }
          return (
            <th
              key={col.name}
              className={`align-middle ${
                _.includes(
                  [
                    "tripDate",
                    "partnesDistance",
                    "fixedRoutesId",
                    "partnerCode"
                  ],
                  col.name
                )
                  ? "text-center"
                  : ""
              }`}
            >
              {col.title}
            </th>
          );
        })}
      </tr>
    </thead>
  );
});
export default DetailPartnerTableHead;
