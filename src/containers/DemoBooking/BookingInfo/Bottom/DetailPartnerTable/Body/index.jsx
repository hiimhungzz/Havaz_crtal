import React, { memo } from "react";
import DetailPartnerTableRow from "./Row";
const DetailPartnerTableBody = memo(
  ({ grid, tripId, handleChangeAffectAmount }) => {
    return (
      <tbody>
        {grid.entrySeq().map(([recordId, record], stt) => {
          return (
            <DetailPartnerTableRow
              key={record.get("key")}
              record={record}
              tripId={tripId}
              stt={stt}
              handleChangeAffectAmount={handleChangeAffectAmount}
            />
          );
        })}
      </tbody>
    );
  }
);
export default DetailPartnerTableBody;
