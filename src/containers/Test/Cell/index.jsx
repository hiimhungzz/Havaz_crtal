import React, { memo, useState, useEffect, useCallback } from "react";
import { Input, Button, Row, Col, message, notification, Space } from "antd";
import _ from "lodash";
import { Table } from "@devexpress/dx-react-grid-material-ui";

const Cell = ({
  props,
  setData,
  data,
  styles,
  setStyle,
  keyRow,
  setKeyRow,
}) => {
  const { column, value, row, tableRow } = props;
  const cellData = props.value;
  const [valueRow, setValueRow] = useState(cellData);
  const rowId = tableRow.rowId;

  const styleBorder = rowId === keyRow ? styles : "1px solid #d9d9d9";
  const _handleAddRow = useCallback((e) => {
    let key = tableRow.rowId + 1;
    let _key = tableRow.rowId;
    let checkDate = _.isArray(data) ? data[_key].date : 0;
    let checkName = _.isArray(data) ? data[_key].fixedRouteName : 0;
    let validate = false;
    for (let item of data) {
      if (!checkDate) {
        validate = false;
        setStyle("1px solid red");
        setKeyRow(_key);
        notification.warning({
          message: "Cảnh báo",
          description: "Vui lòng nhập ngày",
          style: {
            background: "#ffcc00",
          },
        });
        break;
      } else if (!checkName) {
        validate = false;
        setStyle("1px solid red");
        setKeyRow(_key);
        notification.warning({
          message: "Cảnh báo",
          description: "Vui lòng nhập tuyến đường",
          style: {
            background: "#ffcc00",
          },
        });
        break;
      } else {
        setStyle("1px solid #d9d9d9");
        validate = true;
      }
    }
    if (validate) {
      let dataPush = {
        id: key,
        date: "",
        plate: [
          {
            name: "HĐ-52654",
          },
          {
            name: "HĐ-52654",
          },
        ],
        fixedRouteName: "",
        delete: 1,
      };
      setData((prevState) => {
        let nextState = [...prevState];
        nextState.splice(key, 0, dataPush);
        return nextState;
      });
    }
  }, []);
  const _handleAddRowUp = () => {
    let key = tableRow.rowId;
    let checkDate = _.isArray(data) ? data[key].date : 0;
    let checkName = _.isArray(data) ? data[key].fixedRouteName : 0;
    console.log("checkDate", checkDate);
    let validate = false;
    for (let item of data) {
      if (!checkDate) {
        validate = false;
        setStyle("1px solid red");
        setKeyRow(key);
        notification.warning({
          message: "Cảnh báo",
          description: "Vui lòng nhập ngày",
          style: {
            background: "#ffcc00",
          },
        });
        break;
      } else if (!checkName) {
        validate = false;
        setStyle("1px solid red");
        setKeyRow(key);
        notification.warning({
          message: "Cảnh báo",
          description: "Vui lòng nhập tuyến đường",
          style: {
            background: "#ffcc00",
          },
        });
        break;
      } else {
        setStyle("1px solid #d9d9d9");
        validate = true;
      }
    }
    if (validate) {
      let dataPush = {
        id: "4",
        date: "len",
        plate: [
          {
            name: "HĐ-52654",
          },
          {
            name: "HĐ-52654",
          },
        ],
        fixedRouteName: "",
        delete: 1,
      };
      setData((prevState) => {
        let nextState = [...prevState];
        nextState.splice(key, 0, dataPush);
        return nextState;
      }, []);
    }
  };

  const addDate = useCallback((value) => {
    let keyData = value.target.value;
    let key = tableRow.rowId;
    data[key]["date"] = keyData;
    setValueRow(keyData);
  }, []);
  const addRoute = useCallback((value) => {
    let keyData = value.target.value;
    let key = tableRow.rowId;
    let a = (data[key]["fixedRouteName"] = keyData);
    setValueRow(keyData);
  }, []);
  const _deleteRow = () => {
    let key = tableRow.rowId;
    data.splice(key, 1);
    setData((prevState) => {
      let nextState = [...prevState];
      nextState.data = data;
      return nextState;
    });
  };

  const valuePlate = useCallback((value, index) => {
    let dataPlate = value.target.value;
    let key = tableRow.rowId;
    let _index = _.clone(index)
    let _key = _.clone(key)
    let objData = _.set(data, `${_key}.plate[${_index}].name`, dataPlate);
    let plate = _.get(objData, `${_key}.plate`, []);
    console.log('objData',objData)
    console.log('plate',plate)
    setValueRow([...plate]);
  }, []);
  const _handleDelete = (index) => {
    let key = tableRow.rowId;
    let deletePlate = _.get(data, `${key}.plate`, []);
    deletePlate.splice(index, 1);
    setData((prevState) => {
      let nextState = [...prevState];
      nextState.data = deletePlate;
      return nextState;
    });
  };
  const _handleDownAll = (index) => {
    let key = tableRow.rowId ;
    let arrKey = _.clone(index)
    let arrPlate = _.get(data, `${key}.plate`, []);
    let addPlate = _.get(arrPlate, `${arrKey}`, []);
    let _arrPlate = _.isArray(data) ? data : [];
    let dataIndex = tableRow.rowId - 1;
    data.map((item, _index) => {
      dataIndex ++
      let cloneArr = {...addPlate}
      let arrData = _arrPlate[dataIndex] ? _arrPlate[dataIndex].plate : []
      arrData.push(cloneArr)
    });
    let cloneData = [..._arrPlate]
   setData(prevState=>{
     let nextState = [...prevState]
     nextState.data = cloneData
     return nextState
   })
  };
  const _handleDownItem = (index) => {
    let key = tableRow.rowId;
    let arrPlate = _.get(data, `${key}.plate`, []);
    let addPlate = _.get(arrPlate, `${index}`, []);
    let cloneArr = {...addPlate}
    arrPlate.splice(index, 0, cloneArr);
    setData((prevState) => {
      let nextState = [...prevState];
      nextState.data = arrPlate;
      return nextState;
    });
  };
  if (column.name == "id") {
    return (
      <Table.Cell
        className="Table_body"
        {...props}
        value={
          <div style={{ display: "grid" }}>
            <Button
              onClick={_handleAddRow}
              type="link"
              shape="circle"
              icon="down-circle"
            />
            {row.delete == 1 ? (
              <Button
                onClick={_handleAddRowUp}
                type="link"
                shape="circle"
                icon="up-circle"
              />
            ) : (
              ""
            )}
          </div>
        }
      />
    );
  }
  if (column.name == "date") {
    return (
      <Table.Cell
        className="Table_body"
        {...props}
        value={
          <Input
            style={{ border: styleBorder }}
            value={valueRow}
            onChange={addDate}
          />
        }
      />
    );
  }
  if (column.name == "fixedRouteName") {
    return (
      <Table.Cell
        className="Table_body"
        {...props}
        value={
          <Input
            style={{ border: styleBorder }}
            value={valueRow}
            onChange={addRoute}
          />
        }
      />
    );
  }
  if (column.name == "plate") {
    let arrPlate = _.isArray(valueRow) ? valueRow : [];
    return (
      <Table.Cell
        className="Table_body"
        {...props}
        value={arrPlate.map((item, index) => {
          return (
            <div className="d-flex" key={index}>
              <Button
                type="link"
                shape="circle"
                icon="double-right"
                style={{ color: "blue", transform: "rotate(90deg)" }}
                onClick={() => _handleDownAll(index)}
              />
              <Button
                type="link"
                shape="circle"
                icon="right"
                style={{ color: "blue", transform: "rotate(90deg)" }}
                onClick={() => _handleDownItem(index)}
              />
              <Input
                className="mb_5"
                value={item.name}
                onChange={(value) => valuePlate(value, index)}
              />
              <Button
                onClick={() => _handleDelete(index)}
                type="link"
                shape="circle"
                icon="delete"
                style={{ color: "red" }}
              />
            </div>
          );
        })}
      />
    );
  }
  if (column.name == "driverName") {
    return (
      <Table.Cell
        className="Table_body"
        {...props}
        value={
          <Button
            onClick={_deleteRow}
            type="link"
            shape="circle"
            icon="close-circle"
          />
        }
      />
    );
  } else {
    return (
      <Table.Cell
        className="Table_body"
        {...props}
        value={<div>{cellData}</div>}
      />
    );
  }
};
export default Cell;
