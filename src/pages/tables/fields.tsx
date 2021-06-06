import React from 'react';
import { Image } from 'antd';

export const requestFields = [
  { name: 'name', required: true, type: 'string', },
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
