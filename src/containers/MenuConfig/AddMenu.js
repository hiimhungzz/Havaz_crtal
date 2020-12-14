import React, { memo, useEffect, useCallback } from "react";
import classNames from "classnames";
import { Grid } from "@material-ui/core";
import { Ui } from "@Helpers/Ui";
import { URI } from "./constants";
import ServiceBase from "@Services/ServiceBase";
import Portlet from "@Components/Portlet";
import PortletBody from "@Components/Portlet/PortletBody";
import downloadFile from "@Components/Utility/downloadFile";
import Helmet from "react-helmet";
import { Spin, Drawer, Modal as Modaled, Button } from "antd";

// components
import FormMenu from './FormMenu';

const AddMenu = memo(({onSaved}) => {
	const onSave = useCallback( async (values) => {
    const params = {
      parentId: values.parent ? values.parent.key : null,
      index: values.index,
      order: values.order,
      type: values.type,
      code: values.code,
      name: values.name,
      route: values.route,
      icon: values.icon,
      hasSub: values.hasSub
    }
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: URI.GET_LIST_MENU,
      data: params,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      onSaved();
      Ui.showSuccess({ message: "Tạo cầu thành công" });
    }
  });
  
  return (
		<FormMenu item={undefined} onSave={onSave}/>
  );
});

export default AddMenu;
