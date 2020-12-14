import React, { useEffect, useCallback, useState } from "react";
import { Input, DatePicker } from "antd";
import CategoryPayList from "./CategoryPayList";
import _ from "lodash";
import moment from "moment";
import PortletHead from "@Components/Portlet/PortletHead";
import PortletBody from "@Components/Portlet/PortletBody";
import Portlet from "@Components/Portlet";
import { Ui } from "@Helpers/Ui";
import { memo } from "react";
// import BookingModal from "./BookingModal";
import Helmet from "react-helmet";
import { Grid, Paper } from "@material-ui/core";
import ServiceBase from "@Services/ServiceBase";
import { API_URI } from "@Constants";
import { Map } from "immutable";
import { calculateTotalPage } from "helpers/utility";
import CategoryPayModal from "./CategoryPayModal";

let plateTimer;

function disabledDate(current) {
  // Can not select days before today and today
  if (current.year() > moment().year()) {
    return true;
  } else {
    if (current.month() > moment().month()) {
      return true;
    }
  }
  return false;
}

const CategoryPay = () => {
  const [showModal, setShowModal] = useState({
    isShow: false,
    vehicleId: null
  });
  const [grid, setGrid] = useState(
    Map({
      data: [],
      currentPage: 0,
      pageLimit: 15,
      totalLength: 0,
      loading: false
    })
  );
  const [query, setQuery] = useState(
    Map({
      plate: "",
      filterDate: moment(),
      month: moment().month() + 1,
      year: moment().year(),
      // driverName: "",
      pageSize: 15,
      pages: 0
    })
  );

  const handleFilter = useCallback(async param => {
    setGrid(prevState => {
      let nextState = prevState;
      nextState = nextState.set("loading", true);
      return nextState;
    });
    let jsParam = param.toJS();
    let temp = _.pick(jsParam, ["plate", "pageSize", "pages"]);
    temp.month = jsParam.filterDate.month() + 1;
    temp.year = jsParam.filterDate.year();

    let result = await ServiceBase.requestJson({
      method: "GET",
      url: API_URI.BROWSE_CATEGORY_PAY,
      data: temp
    });
    if (!result.hasErrors) {
      Ui.showErrors(result.errors);
      setGrid(prevState => {
        let nextState = prevState;
        nextState = nextState.set(
          "data",
          result.value.docs.map(x => {
            x.organization = x.refOrganization.name;
            return x;
          })
        );
        nextState = nextState.set("currentPage", result.value.pages);
        nextState = nextState.set("pageLimit", result.value.pageSize);
        nextState = nextState.set("totalLength", result.value.total);
        let totalPages = calculateTotalPage(
          result.value.total,
          result.value.pageSize
        );
        nextState = nextState.set("totalPages", totalPages);
        return nextState;
      });
    } else {
      Ui.showErrors(result.errors);
    }
    setGrid(prevState => {
      let nextState = prevState;
      nextState = nextState.set("loading", false);
      return nextState;
    });
  }, []);

  useEffect(() => {
    clearTimeout(plateTimer);
    plateTimer = setTimeout(() => {
      if (showModal.isShow === false) {
        handleFilter(query);
      }
    }, 500);
  }, [handleFilter, query, showModal.isShow]);
  return (
    <Grid container>
      <Helmet title="CATEGORY PAY">
        <meta name="description" content="Category Pay - Car Rental" />
      </Helmet>
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Portlet className="mb-0">
              <PortletHead className="border-bottom-0">
                <div className="kt-portlet__head-label" />
                <div className="kt-portlet__head-toolbar">
                  <div className="kt-portlet__head-wrapper">
                    <button
                      onClick={e => {
                        e.preventDefault();
                        setQuery(prevState => {
                          let nextState = prevState;
                          nextState = nextState.set("driverName", "");
                          nextState = nextState.set("plate", "");
                          return nextState;
                        });
                      }}
                      className="btn btn-clean btn-icon-sm"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                </div>
              </PortletHead>
              <PortletBody className="pt-0 pb-0">
                <Grid container spacing={2}>
                  {/* <Grid item xs={4}>
                    <Input
                      placeholder="Tên lái xe"
                      value={query.get("driverName")}
                      onChange={e => {
                        let driverName = e.target.value;
                        setQuery(prevState => {
                          let nextState = prevState;
                          nextState = nextState.set("driverName", driverName);
                          return nextState;
                        });
                      }}
                    />
                  </Grid> */}
                  <Grid item xs={4}>
                    <Input
                      placeholder="Biến số xe"
                      value={query.get("plate")}
                      onChange={e => {
                        let plate = e.target.value;
                        setQuery(prevState => {
                          let nextState = prevState;
                          nextState = nextState.set("plate", plate);
                          return nextState;
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <DatePicker.MonthPicker
                      value={query.get("filterDate")}
                      format="MM-YYYY"
                      disabledDate={disabledDate}
                      placeholder="Chọn tháng"
                      onChange={(date, dateString) => {
                        setQuery(prevState => {
                          let nextState = prevState;
                          nextState = nextState.set("filterDate", date);
                          return nextState;
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </PortletBody>
            </Portlet>
          </Grid>
          <Grid item xs={12}>
            <CategoryPayList
              query={query}
              onSetQuery={setQuery}
              onFilter={handleFilter}
              onShowModal={setShowModal}
              grid={grid}
            />
          </Grid>
        </Grid>
      </Paper>
      <CategoryPayModal
        showModal={showModal}
        onShowModal={setShowModal}
        month={query.get("month")}
        year={query.get("year")}
      />
    </Grid>
  );
};
export default memo(CategoryPay);
