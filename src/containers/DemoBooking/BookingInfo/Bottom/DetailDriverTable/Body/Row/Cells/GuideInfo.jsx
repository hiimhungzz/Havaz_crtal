import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import classNames from "classnames";
import { Input } from "antd";
import { List } from "immutable";

const GuideInfo = memo(
  withStyles({
    col: {
      minWidth: 125
    },
    gridRootContainer: {
      display: "grid",
      gridTemplateColumns: "365px 2.5rem",
      gridGap: 2
    },
    guideInfoContainer: {
      display: "grid",
      gridTemplateColumns: "auto",
      gridGap: 2
    },
    guideInfoItem: {
      display: "grid",
      gridTemplateColumns: "25px auto 125px 2.5rem 2.5rem",
      gridGap: 5
    }
  })(
    ({
      guideInfo,
      errors,
      rowId,
      classes,
      handleAddNewGuide,
      handleDeleteGuide,
      handleChangeGuideInfo,
      handleCopyNextGuideInfo,
      handleCopyAllGuideInfo
    }) => {
      if (guideInfo && List.isList(guideInfo) && guideInfo.size > 0) {
        return (
          <td className={`align-middle text-center ${classes.col}`}>
            <div className={classes.gridRootContainer}>
              <div className={classes.guideInfoContainer}>
                {guideInfo.map((item, itemId) => {
                  return (
                    <div
                      key={item.get("key")}
                      className={classes.guideInfoItem}
                    >
                      <div className="d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-clean btn-sm btn-icon btn-icon-md"
                          onClick={e =>
                            handleDeleteGuide({ rowId: rowId, itemKey: itemId })
                          }
                          title="Xóa hướng dẫn viên"
                        >
                          <i className="flaticon2-trash d-flex align-items-center text-danger" />
                        </button>
                      </div>
                      <div className="d-flex">
                        <Input
                          placeholder="Nhập tên HDV"
                          value={item.get("name")}
                          onChange={e =>
                            handleChangeGuideInfo({
                              fieldName: "name",
                              rowId: rowId,
                              itemKey: itemId,
                              fieldValue: e.target.value
                            })
                          }
                        />
                      </div>
                      <div className="d-flex">
                        <Input
                          placeholder="Nhập SĐT"
                          className={classNames({
                            "border-invalid": errors.get(itemId)
                              ? errors.get(itemId).get("phone")
                                ? true
                                : false
                              : false
                          })}
                          value={item.get("phone")}
                          onChange={e =>
                            handleChangeGuideInfo({
                              fieldName: "phone",
                              rowId: rowId,
                              itemKey: itemId,
                              fieldValue: e.target.value
                            })
                          }
                        />
                      </div>
                      <div className="d-flex">
                        <button
                          type="button"
                          title="Thêm dòng dưới"
                          className="btn btn-clean btn-sm btn-icon btn-icon-md"
                          onClick={() =>
                            handleCopyNextGuideInfo({
                              rowId: rowId,
                              itemKey: itemId
                            })
                          }
                        >
                          <i className="la la-angle-down kt-font-bolder kt-font-xl" />
                        </button>
                      </div>
                      <div className="d-flex">
                        <button
                          type="button"
                          title="Thêm tất cả dòng"
                          className="btn btn-clean btn-sm btn-icon btn-icon-md"
                          onClick={() =>
                            handleCopyAllGuideInfo({
                              rowId: rowId,
                              itemKey: itemId
                            })
                          }
                        >
                          <i className="la la-angle-double-down kt-font-bolder kt-font-xl" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="d-flex align-items-center justify-content-center">
                <button
                  onClick={() => handleAddNewGuide({ rowId: rowId })}
                  title="Thêm mới HDV"
                  className="btn btn-clean btn-sm btn-icon btn-icon-md"
                >
                  <i className="flaticon2-add-1" />
                  &nbsp;
                </button>
              </div>
            </div>
          </td>
        );
      } else {
        return (
          <td className={`align-middle text-center ${classes.col}`}>
            <button
              onClick={() => handleAddNewGuide({ rowId: rowId })}
              title="Thêm mới HDV"
              className="btn btn-clean btn-sm btn-icon btn-icon-md"
            >
              <i className="flaticon2-add-1" />
            </button>
          </td>
        );
      }
    }
  )
);
export default GuideInfo;
