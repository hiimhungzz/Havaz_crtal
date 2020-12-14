import React, { memo } from "react";
import Stt from "./Cells/Stt";
import Name from "./Cells/Name";
import DateOffset from "./Cells/DateOffset";
import TypeCity from "./Cells/TypeCity";
import TimeLatency from "./Cells/TimeLatency";
import Time from "./Cells/Time";
import Action from "./Cells/Action";

const PointTableBodyRow = memo(({ record, recordId, errors, setRoute }) => {
  return (
    <tr>
      <Stt order={record.get("order")} />
      <Name
        errors={errors.name}
        name={record.get("name")}
        rowId={recordId}
        setRoute={setRoute}
      />
      <DateOffset dateOffSet={record.get("dateOffSet")} />
      <TypeCity  setRoute={setRoute} rowId={recordId} value ={record.get("typePlace")}/>
      <Time  setRoute={setRoute} rowId={recordId} value={record.get("timePickup")} />
      <TimeLatency  setRoute={setRoute} rowId={recordId} value={record.get("timeLatency")} />
      <Action
        rowId={recordId}
        setRoute={setRoute}
        isDisabled={record.get("uuid")}
      />
    </tr>
  );
});
export default PointTableBodyRow;
