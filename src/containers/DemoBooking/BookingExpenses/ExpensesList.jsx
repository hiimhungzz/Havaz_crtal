import React, { useState, memo } from "react";

import { Paper, withStyles } from "@material-ui/core";
import { Input, InputNumber, Icon, List, Popover, Checkbox } from "antd";
import classNames from "classnames";
import { Collapse } from "react-bootstrap";
import _ from "lodash";
import CatologFee from "components/SelectContainer/CatologFee";
import I from "components/I";

let PopOverContent = ({ trips, payload, onAddExpenses }) => {
  return (
    <List
      size="small"
      bordered
      dataSource={trips}
      renderItem={item => {
        return (
          <List.Item
            actions={[
              <button
                onClick={e =>
                  onAddExpenses({
                    ...payload,
                    fixedRoutesName: item.get("fixedRoutesName"),
                    tripId: item.get("uuid"),
                    driverName: item.get("driverName"),
                    userId: item.get("driverId")
                  })
                }
                type="button"
                className="btn btn-clean btn-md btn-icon btn-icon-lg"
              >
                <I className="fa fa-plus" />
              </button>
            ]}
          >
            <Icon
              style={{ fontSize: "16px", paddingRight: 5, color: "#93a2dd" }}
              type="caret-right"
            />
            <List.Item.Meta
              title={`${item.get("fixedRoutesName")} - ${item.get("date")}`}
              description={`${item.get("plate")} - ${item.get("driverName")}`}
            />
          </List.Item>
        );
      }}
    />
  );
};

const ExpensesListHead = withStyles({
  headItem: { padding: "10px 0 10px 0" }
})(
  memo(({ columns, classes }) => {
    return (
      <>
        {_.map(columns, col => {
          return (
            <div className={classes.headItem} key={col.name} style={col.style}>
              {col.title}
            </div>
          );
        })}
      </>
    );
  })
);
const ExpensesListRow = withStyles({
  collapseItem: {
    gridColumn: "1 / span 8",
    display: "grid"
  }
})(
  memo(
    ({
      row,
      numberOfColumn,
      classes,
      onChangeField,
      onAddExpenses,
      onDeleteExpense,
      plate,
      bookingId,
      trips
    }) => {
      const [open, setOpen] = useState(true);
      let str = `carrental${row.get("plate")}${row.get("date")}`;
      let collapseId = str.split("-").join("");

      return (
        <>
          <ExpensesListExpansionRoot
            setOpen={setOpen}
            open={open}
            collapseId={collapseId}
            rowId={row.get("rowId")}
            date={row.get("date")}
            trips={trips.filter(x => x.get("date") === row.get("date"))}
            numberOfColumn={numberOfColumn}
            onAddExpenses={onAddExpenses}
            plate={plate}
          />
          <Collapse in={open}>
            <div className={classes.collapseItem} id={collapseId}>
              {row.get("items").map((item, itemId) => {
                return (
                  <ExpensesListExpansionItem
                    key={itemId}
                    open={open}
                    collapseId={collapseId}
                    item={item}
                    numberOfColumn={numberOfColumn}
                    onChangeField={onChangeField}
                    onDeleteExpense={onDeleteExpense}
                    plate={plate}
                    bookingId={bookingId}
                  />
                );
              })}
            </div>
          </Collapse>
        </>
      );
    }
  )
);
const ExpensesListExpansionRoot = memo(
  withStyles({
    root: {
      background: "#eeeeee",
      cursor: "pointer",
      color: "rgb(100,108,154) !important",
      gridColumn: `1 / span 8`,
      fontSize: "1.1rem",
      padding: 10,
      display: "grid",
      gridTemplateColumns: "110px auto",
      gridColumnGap: 10
    },
    title: {
      alignSelf: "center"
    }
  })(
    ({
      date,
      rowId,
      plate,
      open,
      setOpen,
      onAddExpenses,
      collapseId,
      classes,
      trips
    }) => {
      return (
        <div className={classes.root}>
          <div
            className={classes.title}
            aria-controls={collapseId}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <i
              className={classNames({
                "fa fa-chevron-right": !open,
                "fa fa-chevron-down": open,
                "mr-2": true
              })}
            />
            <b>{date}</b>
          </div>
          <div>
            <Popover
              placement="topLeft"
              title={"Thông tin lệnh"}
              content={
                <PopOverContent
                  trips={trips}
                  payload={{ plate: plate, rowId: rowId, date: date }}
                  onAddExpenses={onAddExpenses}
                />
              }
              trigger="click"
            >
              <button
                type="button"
                className="btn btn-clean btn-sm btn-icon btn-icon-md"
              >
                <I className="fa fa-bars" />
              </button>
            </Popover>
          </div>
        </div>
      );
    }
  )
);
const ExpensesListExpansionItem = memo(
  withStyles({
    date: { alignSelf: "center", textAlign: "center" },
    fixedRoutesName: {
      alignSelf: "center"
    },
    driverName: {
      textAlign: "center",
      alignSelf: "center"
    },
    type: {
      alignSelf: "center",
      textAlign: "center"
    },
    value: {
      alignSelf: "center",
      textAlign: "center",
      "& .ant-input-number-input": {
        textAlign: "right"
      }
    },
    confirmNote: {
      textAlign: "center",
      alignSelf: "center",
      padding: "10px 0 10px 0"
    },
    note: {
      textAlign: "center",
      alignSelf: "center",
      padding: "10px 0 10px 0"
    },
    confirm: {
      textAlign: "center",
      alignSelf: "center",
      "& .ant-checkbox-checked .ant-checkbox-inner": {
        backgroundColor: "rgb(100,108,154)"
      }
    },
    item: {
      display: "grid",
      gridGap: 10,
      borderBottom: "1px solid lightgray",
      gridTemplateColumns:
        "120px minmax(min-content , auto) 120px 180px 120px 170px 170px 80px"
    },
    newItem: {
      background: "#f7f8fa"
    }
  })(({ item, classes, onChangeField, plate, onDeleteExpense }) => {
    return (
      <div
        className={classNames({
          [classes.item]: true,
          [classes.newItem]: !item.get("uuid")
        })}
      >
        <div className={`${classes.date}`}>
          {item.get("uuid") ? null : (
            <button
              type="button"
              onClick={e =>
                onDeleteExpense({
                  plate: plate,
                  rowId: item.get("rowId"),
                  itemId: item.get("itemId")
                })
              }
              className="btn btn-clean btn-sm btn-icon btn-icon-md"
            >
              <I className="flaticon2-trash text-danger" />
            </button>
          )}
        </div>
        <div className={classes.fixedRoutesName}>
          {item.get("fixedRoutesName")}
        </div>

        <div className={classes.driverName}>{item.get("driverName")}</div>

        <div className={classes.type}>
          {!item.get("uuid") ? (
            <CatologFee
              value={
                item.get("typeId")
                  ? { key: item.get("typeId"), label: item.get("type") }
                  : undefined
              }
              onSelect={fee => {
                onChangeField({
                  plate: plate,
                  rowId: item.get("rowId"),
                  itemId: item.get("itemId"),
                  value: fee.label,
                  name: "type"
                });
                onChangeField({
                  plate: plate,
                  rowId: item.get("rowId"),
                  itemId: item.get("itemId"),
                  value: fee.key,
                  name: "typeId"
                });
              }}
            />
          ) : (
            item.get("type")
          )}
        </div>
        <div className={classes.value}>
          <InputNumber
            formatter={value =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={value => value.replace(/\$\s?|(,*)/g, "")}
            value={item.get("value")}
            onChange={e =>
              onChangeField({
                plate: plate,
                rowId: item.get("rowId"),
                itemId: item.get("itemId"),
                value: e,
                name: "value"
              })
            }
          />
        </div>
        <div className={classes.note}>
          <Input.TextArea
            value={item.get("note")}
            rows={1}
            columns={10}
            onChange={e =>
              onChangeField({
                plate: plate,
                rowId: item.get("rowId"),
                itemId: item.get("itemId"),
                value: e.target.value,
                name: "note"
              })
            }
          />
        </div>
        <div className={classes.confirmNote}>
          <Input.TextArea
            value={item.get("confirmNote")}
            rows={1}
            columns={10}
            onChange={e =>
              onChangeField({
                plate: plate,
                rowId: item.get("rowId"),
                itemId: item.get("itemId"),
                value: e.target.value,
                name: "confirmNote"
              })
            }
          />
        </div>
        <div className={classes.confirm}>
          <Checkbox
            checked={item.get("confirm")}
            onChange={e =>
              onChangeField({
                plate: plate,
                rowId: item.get("rowId"),
                itemId: item.get("itemId"),
                value: e.target.checked,
                name: "confirm"
              })
            }
          />
        </div>
      </div>
    );
  })
);
const ExpensesListBody = withStyles({})(
  memo(
    ({
      rows,
      trips,
      numberOfColumn,
      onChangeField,
      onDeleteExpense,
      onAddExpenses,
      plate,
      bookingId
    }) => {
      return (
        <>
          {rows.map((row, rowId) => {
            return (
              <ExpensesListRow
                key={rowId}
                row={row}
                numberOfColumn={numberOfColumn}
                bookingId={bookingId}
                onChangeField={onChangeField}
                onDeleteExpense={onDeleteExpense}
                onAddExpenses={onAddExpenses}
                plate={plate}
                trips={trips}
              />
            );
          })}
        </>
      );
    }
  )
);

const ExpensesList = memo(
  ({
    plate,
    bookingId,
    trips,
    dataSource,
    classes,
    onChangeField,
    onAddExpenses,
    onDeleteExpense
  }) => {
    const [config] = useState({
      columns: [
        { name: "date", title: "NGÀY", style: { textAlign: "center" } },
        {
          name: "fixedRoutesName",
          title: "TUYẾN ĐƯỜNG",
          style: { textAlign: "left" }
        },
        {
          name: "driverName",
          title: "LÁI XE",
          style: { textAlign: "center" }
        },
        { name: "type", title: "LOẠI CHI PHÍ", style: { textAlign: "center" } },
        { name: "value", title: "GIÁ TIỀN", style: { textAlign: "center" } },
        {
          name: "note",
          title: "GHI CHÚ (HDV)",
          style: { textAlign: "center" }
        },
        {
          name: "confirmNote",
          title: "GHI CHÚ",
          style: { textAlign: "center" }
        },
        { name: "confirm", title: "XÁC NHẬN" }
      ],
      tableColumnExtensions: [
        { columnName: "fixedRoutesName", width: 300 },
        { columnName: "confirm", width: 100, align: "center" }
      ],
      tableGroupColumnExtension: [{ columnName: "date", showWhenGrouped: true }]
    });
    return (
      <Paper classes={{ root: classes.root }}>
        <div className={classes.table}>
          <ExpensesListHead columns={config.columns} />
          <ExpensesListBody
            numberOfColumn={config.columns.length}
            rows={dataSource}
            trips={trips}
            onChangeField={onChangeField}
            onDeleteExpense={onDeleteExpense}
            onAddExpenses={onAddExpenses}
            plate={plate}
            bookingId={bookingId}
          />
        </div>
      </Paper>
    );
  }
);
export default withStyles({
  root: { width: "100%" },
  table: {
    display: "grid",
    width: "100%",
    gridRowGap: 2,
    gridColumnGap: 10,
    gridTemplateColumns:
      "120px minmax(min-content , auto) 120px 180px 120px 170px 170px 80px"
  }
})(ExpensesList);
