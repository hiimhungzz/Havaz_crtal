import React, { memo } from "react";
import _ from "lodash";
const DetailDriverTableHead = memo(({ columns }) => {
  return (
    <thead>
      <tr className="cr-table__head">
        {_.map(columns, (col) => {
          if (col.name === "amount") {
            return (
              <th
                style={{
                  position: "sticky",
                  right: 0,
                  zIndex: 302,
                  backgroundColor: "whitesmoke",
                }}
                key={col.name}
                className="align-middle text-center"
              >
                {col.title}
              </th>
            );
          }
          if (col.name === "stt") {
            return (
              <th
                style={{ zIndex: 302 }}
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
                    "distance",
                    "guideInfo",
                    "locationPickup",
                    "fixedRoutesId",
                    "vehicleTime",
                    "timePickup",
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
export default DetailDriverTableHead;
