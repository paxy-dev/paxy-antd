import React from 'react';
import { Image } from 'antd';

export const requestFields = [
  { name: 'name', required: true, type: 'string', },
  { name: 'type', required: true, type: 'string', },
  { name: 'required',required: true, type: 'boolean', },
  { name: 'disabled', required: true, type: 'boolean', },
  { name: 'width',required: false, type: 'string', },
  { name: 'valueEnum',required: false, type: 'json', },
  { name: 'label', required: false, type: 'string', },      
  { name: 'render', required: false, type: 'json', },
  { name: 'sorter', required: false, type: 'json', },      
  { name: 'pointTo', required: false, type: 'string', },      
];

export const updateRequestFields = [
  { name: 'id', required: true, type: 'string', disabled: true },
  ...requestFields,
];

export const tableFields = [
  ...updateRequestFields,
  { name: 'createdAt', required: true, type: 'date', disabled: true },
  { name: 'updatedAt', required: true, type: 'date', disabled: true },
];
