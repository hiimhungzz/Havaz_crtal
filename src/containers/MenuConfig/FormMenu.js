import React, { memo, useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import MenuParent from "@Components/SelectContainer/MenuParent";
import IntlMessages from "@Components/Utility/intlMessages";
import { Button, Form, Input, InputNumber, Checkbox } from "antd";

// components

const FormMenu = memo(({ form: { getFieldDecorator, setFieldsValue, validateFields }, item, onSave }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    validateFields(async (err, values) => {
      if (!err) {
        onSave(values)
      }
    });
  };
  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Form.Item label={"Index"}>
          {getFieldDecorator('index', {
            initialValue: item ? item.index : undefined,
            rules: [{ required: true }],
          })(<InputNumber />)}
        </Form.Item>
        <Form.Item label={"Order"}>
          {getFieldDecorator('order', {
            initialValue: item ? item.order : undefined,
            rules: [{ required: true }],
          })(<InputNumber />)}
        </Form.Item>
        <Form.Item label={"Menu cha"}>
          {getFieldDecorator('parent', {
            initialValue: item ? {
              key: item.parentId,
              label: <IntlMessages id={item.name}/>
            } : undefined,
            rules: [{ required: false }],
          })(
            <MenuParent
              onSelect={(item) => {
                setFieldsValue({ parent: item });
              }}
            />
          )}
        </Form.Item>
        <Form.Item label={"Loại"}>
          {getFieldDecorator('type', {
            initialValue: item ? item.type : undefined,
            rules: [{ required: false }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label={"Code"}>
          {getFieldDecorator('code', {
            initialValue: item ? item.code : undefined,
            rules: [{ required: false }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label={"Name"}>
          {getFieldDecorator('name', {
            initialValue: item ? item.name : undefined,
            rules: [{ required: false }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label={"Route"}>
          {getFieldDecorator('route', {
            initialValue: item ? item.route : undefined,
            rules: [{ required: false }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label={"Icon"}>
          {getFieldDecorator('icon', {
            initialValue: item ? item.icon : undefined,
            rules: [{ required: false }],
          })(<Input />)}
        </Form.Item>
        <div>
          <div>Has Sub</div>
          <Form.Item>
            {getFieldDecorator('hasSub', {
              initialValue: item ? item.hasSub : undefined,
              rules: [{ required: false }],
            })(<Checkbox />)}
          </Form.Item>  
        </div>
        <div>
          <button
              onClick={onSubmit}
              type="button"
              className={classNames({
                "btn btn-primary btn-icon-sm mr-3": true,
              })}
            >
              Lưu
          </button>
        </div>
      </Form>
    </>
  );
});

export default Form.create() (FormMenu);
