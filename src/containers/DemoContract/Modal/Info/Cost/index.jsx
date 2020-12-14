import React from "react";
import Table from "react-bootstrap/Table";
import CostTableHead from "./Head";
import CostTableBody from "./Body";
import { Paper } from "@material-ui/core";
import { memo } from "react";

const columnsDefault = [
  { name: "action", title: "" },
  { name: "vehicleType", title: "LOẠI XE" },
  { name: "fixedRoute", title: "TUYẾN ĐƯỜNG" },
  { name: "numberVehicle", title: "SL XE" },
  { name: "km", title: "KM QL" },
  { name: "quantity", title: "SỐ LƯỢT" },
  { name: "monthCost", title: "GIÁ THUÊ THÁNG" },
  { name: "extraQuantityPrice", title: "GIÁ PS LƯỢT" },
  { name: "extraOtPrice", title: "GIÁ PS NGOÀI GIỜ" },
  { name: "extraHolidayPrice", title: "GIÁ PS CN, LỄ TẾT" },
];

const columnsPackage = [
  { name: "action", title: "" },
  { name: "vehicleType", title: "LOẠI XE" },
  { name: "fixedRoute", title: "TUYẾN ĐƯỜNG" },
  { name: "numberVehicle", title: "SL XE" },
  { name: "km", title: "KM QL" },
  { name: "packageKM", title: "KM trọn gói" },
  { name: "quantity", title: "SỐ LƯỢT" },
  { name: "monthCost", title: "GIÁ THUÊ THÁNG" },
  { name: "costPerKm", title: "GIÁ PS KM" },
  { name: "costPerKmByOT", title: "GIÁ OT" },
  { name: "costPerKmByHoliday", title: "GIÁ OT CN, lễ tết" },

];

const Cost = ({contractType, grid, check, setContract, contractErrors }) => {
  const columns = contractType === '1.4' ? columnsPackage : columnsDefault;
  return (
    <Paper elevation={2}>
      <Table hover className="mb-0">
        <CostTableHead  contractType={contractType} columns={columns} />
        <CostTableBody
          grid={grid}
          check={check}
          contractType={contractType}
          columns={columns}
          contractErrors={contractErrors}
          setContract={setContract}
        />
      </Table>
    </Paper>
  );
};
export default memo(Cost);
