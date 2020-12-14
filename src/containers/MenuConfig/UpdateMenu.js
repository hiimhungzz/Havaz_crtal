import React, { memo, useState, useEffect, useCallback } from "react";
import { Ui } from "@Helpers/Ui";
import { URI } from "./constants";
import ServiceBase from "@Services/ServiceBase";

import { Spin, Drawer, Modal as Modaled, Button } from "antd";

// components
import FormMenu from './FormMenu';

const UpdateMenu = memo(({item, onSaved}) => {
  const [loadding, setLoading] = useState(false);

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
      hasSub: values.hasSub,
    }
    const result = await ServiceBase.requestJson({
      method: "PUT",
      url: `${URI.GET_LIST_MENU}/${item.uuid}`,
      data: params,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      onSaved()
      Ui.showSuccess({ message: "Sửa cầu thành công" });
    }
  });
  return (
    <Spin spinning={loadding} tip="Đang lấy dữ liệu...">
      {
        item ? (
          <FormMenu item={item} onSave={onSave}/>
        ) : null
      }
    </Spin>
  );
});

export default UpdateMenu;
