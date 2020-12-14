import React, { memo, useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import { Grid } from "@material-ui/core";
import { Ui } from "@Helpers/Ui";
import PortletHead from "@Components/Portlet/PortletHead";
import { URI } from "./constants";
import ServiceBase from "@Services/ServiceBase";
import Portlet from "@Components/Portlet";
import PortletBody from "@Components/Portlet/PortletBody";
import downloadFile from "@Components/Utility/downloadFile";
import Helmet from "react-helmet";
import { Spin, Drawer, Modal as Modaled, Button } from "antd";

// components
import AddMenu from './AddMenu';
import UpdateMenu from './UpdateMenu';

import List from './List';

const MenuConfig = memo(() => {
  const [itemSelected, setItemSelected] = useState(null)
  const [data, setData] = useState([])
	const [loadding, setLoading] = useState(false);
	const [isVisibleAddMenu, setVisibleAddMenu] = useState(false);
	const [isVisibleUpdateMenu, setVisibleUpdateMenu] = useState(false);

	const onCloseAddMenu = useCallback(() => {
		setVisibleAddMenu(false)
  });
  
	const onCloseUpdateMenu = useCallback(() => {
    setItemSelected(undefined)
		setVisibleUpdateMenu(false)
  });

	const onEditItem = useCallback(async(uuid) => {
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: `${URI.GET_LIST_MENU}/${uuid}`,
      data: {},
    });
    if (result.hasErrors) {
      setLoading(false);
      Ui.showErrors(result.errors);
    } else {
      setItemSelected(result.value)
      setLoading(false);
    }
    setVisibleUpdateMenu(true)
  });

  const browseCommand = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: URI.GET_LIST_MENU,
      data: {},
    });
    if (result.hasErrors) {
      setLoading(false);
      Ui.showErrors(result.errors);
    } else {
      setLoading(false);
      setData(result.value.data)
    }
  }, []);

  const onSaved = useCallback(async () => {
    browseCommand()
    setItemSelected(undefined)
    setVisibleAddMenu(false)
    setVisibleUpdateMenu(false)
  }, []);
  // Load data
  useEffect(() => {
    browseCommand();
  }, []);

  return (
    <>
    <Grid container spacing={3}>
        <Helmet title="MENU CONFIG">
          <meta
            name="description"
            content="MENU config - Car Rental"
          />
        </Helmet>
        <Grid item xs={12}>
          <Portlet>
						<PortletHead>
            <div className="kt-portlet__head-label"></div>
							<div className="kt-portlet__head-toolbar">
								<div className="kt-portlet__head-wrapper">
									<button
										onClick={() => {
											setVisibleAddMenu(true)
										}}
										type="button"
										className={classNames({
											"btn btn-primary btn-icon-sm mr-3": true,
										})}
									>
										Thêm Menu
								</button>
								</div>
							</div>
						</PortletHead>
					
            <PortletBody className="pt-0">
              <Spin spinning={loadding} tip="Đang lấy dữ liệu...">
                <List data={data} onEditItem={onEditItem}/>
              </Spin>
            </PortletBody>
          </Portlet>
        </Grid>
      </Grid>
      <Drawer
      width={"80%"}
      title={
        <span>
          <i onClick={onCloseUpdateMenu} className="fa fa-chevron-left"></i> &nbsp; Thêm menu
        </span>
      }
      placement="right"
      closable={false}
      onClose={onCloseAddMenu}
      visible={isVisibleAddMenu}
      destroyOnClose
    >
      <AddMenu onSaved={onSaved}/>
    </Drawer>
      <Drawer
        width={"80%"}
        title={
          <span>
            <i onClick={onCloseUpdateMenu} className="fa fa-chevron-left"></i> &nbsp;  Sửa menu
          </span>
        }
        placement="right"
        closable={false}
        onClose={onCloseUpdateMenu}
        visible={isVisibleUpdateMenu}
        destroyOnClose
      >
        <UpdateMenu item={itemSelected} onSaved={onSaved}/>
      </Drawer>
    </>
  );
});

export default MenuConfig;
