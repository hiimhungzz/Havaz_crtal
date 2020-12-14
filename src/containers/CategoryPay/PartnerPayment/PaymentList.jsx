import React, { useState, useEffect, memo } from "react";
import { Paper, withStyles } from "@material-ui/core";
import { Input, InputNumber } from "antd";
import classNames from "classnames";
import { Collapse } from "react-bootstrap";
import _ from "lodash";
import { FormattedNumber } from "react-intl";

const gridTemplateColumns =
  "60px minmax(min-content , auto) 100px 120px 200px 200px 250px";

const PaymentListRow = withStyles({
  collapseItem: {
    display: "grid"
  }
})(
  memo(({ category, categoryId, classes, onChangeField }) => {
    const [open, setOpen] = useState(false);
    console.log("Render PaymentListRow", categoryId);
    return (
      <>
        {category.map((row, rowId) => {
          return (
            <>
              <PaymentListExpansionRoot
                setOpen={setOpen}
                open={open}
                row={row}
              />
              <Collapse in={open}>
                <div className={classes.collapseItem}>
                  {row.get("items").map((item, itemId) => {
                    return (
                      <PaymentListExpansionItem
                        key={itemId}
                        open={open}
                        item={item}
                        itemId={itemId}
                        rowId={rowId}
                        categoryId={categoryId}
                        onChangeField={onChangeField}
                      />
                    );
                  })}
                </div>
              </Collapse>
            </>
          );
        })}
      </>
    );
  })
);
const PaymentListExpansionRoot = memo(
  withStyles({
    root: {
      background: "#eeeeee",
      cursor: "pointer",
      color: "rgb(100,108,154) !important",
      fontSize: "1.1rem",
      display: "grid",
      gridTemplateColumns: gridTemplateColumns,
      gridColumnGap: 10,
      "& > div:not(:last-child)": {
        borderRight: "1px solid lightgray"
      }
    },
    title: {
      alignSelf: "center",
      textAlign: "center",
      height: "100%",
      padding: "10px 0 10px 0"
    },
    perform: {
      textAlign: "right !important",
      paddingRight: "21px !important"
    }
  })(({ row, open, setOpen, collapseId, classes }) => {
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
          <b>{row.id}</b>
        </div>
        <div className={`${classes.title} text-left`}>
          <b>{row.get("revenue")}</b>
        </div>
        <div className={classes.title}>
          <b>{row.get("unit")}</b>
        </div>
        <div className={classes.title}>
          <b>{row.get("quota")}</b>
        </div>
        <div className={`${classes.title} ${classes.perform}`}>
          <b>
            {_.isNumber(row.get("perform")) ? (
              <FormattedNumber value={row.get("perform")} />
            ) : (
              row.get("perform")
            )}
          </b>
        </div>
        <div className={`${classes.title}`}>
          <b>{row.get("vat")}</b>
        </div>
        <div className={classes.title}>
          <b>{row.get("note")}</b>
        </div>
      </div>
    );
  })
);
const PaymentListExpansionItem = memo(
  withStyles({
    id: { justifyContent: "center" },
    revenue: {
      alignSelf: "center"
    },
    unit: {
      alignSelf: "center",
      justifyContent: "center",
      "& .ant-input-number-input": {
        textAlign: "right"
      }
    },
    quota: {
      alignSelf: "center",
      textAlign: "center",
      "& .ant-input-number-input": {
        textAlign: "right"
      }
    },
    perform: {
      paddingRight: "21px !important",
      justifyContent: "flex-end",
      alignSelf: "center",
      "& .ant-input-number-input": {
        textAlign: "right"
      }
    },
    vat: {
      textAlign: "center",
      alignSelf: "center",
      "& .ant-input-number-input": {
        textAlign: "right"
      }
    },
    note: {
      borderRight: "0 !important",
      textAlign: "center",
      alignSelf: "center",
      padding: 10
    },
    item: {
      display: "grid",
      gridColumnGap: 10,
      gridRowGap: 0,
      borderBottom: "1px solid lightgray",
      gridTemplateColumns: gridTemplateColumns,
      "& > div:not(:last-child)": {
        display: "flex",
        alignItems: "center",
        height: "100%",
        width: "100%",
        borderRight: "1px solid lightgray",
        padding: "10px 10px 10px 0"
      }
    }
  })(({ item, rowId, itemId, categoryId, classes, onChangeField }) => {
    console.log("PaymentListExpansionItem", rowId, itemId);
    let isEdit = item.get("isEdit");
    return (
      <div key={itemId} className={classes.item}>
        <div className={classes.id}>{item.get("id")}</div>
        <div className={classes.revenue}>{item.get("revenue")}</div>
        <div className={classes.unit}>
          {isEdit ? (
            <InputNumber
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              value={item.get("unit")}
              onChange={e =>
                onChangeField({
                  categoryId: categoryId,
                  rowId: rowId,
                  itemId: itemId,
                  value: e,
                  name: "unit"
                })
              }
            />
          ) : (
            item.get("unit")
          )}
        </div>
        <div className={classes.quota}>
          {isEdit ? (
            <InputNumber
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              value={item.get("quota")}
              onChange={e =>
                onChangeField({
                  categoryId: categoryId,
                  rowId: rowId,
                  itemId: itemId,
                  value: e,
                  name: "quota"
                })
              }
            />
          ) : (
            item.get("quota")
          )}
        </div>
        <div className={classes.perform}>
          {isEdit ? (
            <InputNumber
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              value={item.get("perform")}
              onChange={e =>
                onChangeField({
                  categoryId: categoryId,
                  rowId: rowId,
                  itemId: itemId,
                  value: e,
                  name: "perform"
                })
              }
            />
          ) : (
            <b className="kt-font-lg">
              {item.get("perform") ? (
                <FormattedNumber value={item.get("perform")} />
              ) : null}
            </b>
          )}
        </div>
        <div className={classes.vat}>
          {isEdit ? (
            <InputNumber
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              value={item.get("vat")}
              onChange={e =>
                onChangeField({
                  categoryId: categoryId,
                  rowId: rowId,
                  itemId: itemId,
                  value: e,
                  name: "vat"
                })
              }
            />
          ) : (
            item.get("vat")
          )}
        </div>
        <div className={classes.note}>
          {isEdit ? (
            <Input.TextArea
              value={item.get("note")}
              rows={1}
              columns={10}
              onChange={e =>
                onChangeField({
                  categoryId: categoryId,
                  rowId: rowId,
                  itemId: itemId,
                  value: e.target.value,
                  name: "note"
                })
              }
            />
          ) : (
            item.get("note")
          )}
        </div>
        {item.get("items").map((ytem, ytemId) => {
          return (
            <PaymentListItem
              key={ytemId}
              ytemId={ytemId}
              itemId={itemId}
              rowId={rowId}
              categoryId={categoryId}
              item={ytem}
              onChangeField={onChangeField}
            />
          );
        })}
      </div>
    );
  })
);
const PaymentListItem = memo(
  withStyles({
    id: {
      textAlign: "center",
      justifyContent: "center"
    },
    revenue: {
      alignSelf: "center",
      paddingLeft: "10px !important"
    },
    unit: {
      alignSelf: "center",
      justifyContent: "center",
      "& .ant-input-number-input": {
        textAlign: "right"
      }
    },
    quota: {
      alignSelf: "center",
      textAlign: "center",
      "& .ant-input-number-input": {
        textAlign: "right"
      }
    },
    perform: {
      paddingRight: "21px !important",
      alignSelf: "center",
      justifyContent: "flex-end",
      "& .ant-input-number-input": {
        textAlign: "right"
      }
    },
    vat: {
      textAlign: "center",
      alignSelf: "center"
    },
    note: {
      paddingRight: 10,
      borderRight: "0 !important",
      textAlign: "center",
      alignSelf: "center"
    }
  })(({ item, rowId, categoryId, itemId, ytemId, classes, onChangeField }) => {
    let isEdit = item.get("isEdit");
    return (
      <>
        <div className={classes.id}>{item.get("id")}</div>
        <div className={classes.revenue}>{` - ${item.get("revenue")}`}</div>
        <div className={classes.unit}>
          {isEdit ? (
            <InputNumber
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              value={item.get("unit")}
              onChange={e =>
                onChangeField({
                  categoryId: categoryId,
                  rowId: rowId,
                  itemId: itemId,
                  ytemId: ytemId,
                  value: e,
                  name: "unit"
                })
              }
            />
          ) : (
            item.get("unit")
          )}
        </div>
        <div className={classes.quota}>
          {isEdit ? (
            <InputNumber
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              value={item.get("quota")}
              onChange={e =>
                onChangeField({
                  rowId: rowId,
                  categoryId: categoryId,
                  itemId: itemId,
                  ytemId: ytemId,
                  value: e,
                  name: "quota"
                })
              }
            />
          ) : (
            item.get("quota")
          )}
        </div>
        <div className={classes.perform}>
          {isEdit ? (
            <InputNumber
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              value={item.get("perform")}
              onChange={e =>
                onChangeField({
                  categoryId: categoryId,
                  rowId: rowId,
                  itemId: itemId,
                  ytemId: ytemId,
                  value: e,
                  name: "perform"
                })
              }
            />
          ) : (
            <b className="kt-font-lg">
              {item.get("perform") ? (
                <FormattedNumber value={item.get("perform")} />
              ) : null}
            </b>
          )}
        </div>
        <div className={classes.vat}>
          {isEdit ? (
            <InputNumber
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              value={item.get("vat")}
              onChange={e =>
                onChangeField({
                  categoryId: categoryId,
                  rowId: rowId,
                  itemId: itemId,
                  ytemId: ytemId,
                  value: e,
                  name: "vat"
                })
              }
            />
          ) : (
            item.get("vat")
          )}
        </div>
        <div className={classes.note}>
          {isEdit ? (
            <Input.TextArea
              value={item.get("note")}
              rows={1}
              columns={10}
              onChange={e =>
                onChangeField({
                  categoryId: categoryId,
                  rowId: rowId,
                  itemId: itemId,
                  ytemId: ytemId,
                  value: e.target.value,
                  name: "note"
                })
              }
            />
          ) : (
            item.get("note")
          )}
        </div>
      </>
    );
  })
);

const PaymentList = memo(({ dataSource, classes, onChangeField }) => {
  return (
    <Paper variant="outlined" square classes={{ root: classes.root }}>
      <div className={classes.table}>
        {dataSource.entrySeq().map(([categoryId, category]) => {
          return (
            <PaymentListRow
              key={categoryId}
              categoryId={categoryId}
              category={category}
              onChangeField={onChangeField}
            />
          );
        })}
      </div>
    </Paper>
  );
});
export default withStyles({
  root: {
    // padding: 10
  },
  table: {
    display: "grid",
    width: "100%",
    gridRowGap: 2,
    gridColumnGap: 10
  }
})(PaymentList);
