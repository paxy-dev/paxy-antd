import React from 'react';
import { mount } from 'enzyme';
import { Modal } from 'antd';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import { createTable, createEditTable } from '../table';
import './matchMedia';

describe('test table', () => {
  it('shall create table', () => {
    // const [form] = Form.useForm();
    const requestFields = [
      {
        name: 'id',
        label: 'Id',
        type: 'string',
        required: true,
        disabled: true,
      },
      {
        name: 'weight',
        type: 'number',
        required: true,
      },
    ];

    const services = {
      create: jest.fn(),
      update: jest.fn(),
      query: jest.fn(),
      delete: jest.fn(),
    };

    const Table = createTable('Test', requestFields, requestFields, requestFields, services);
    const wrapper = mount(<Table />);
    expect(wrapper.find(ProTable).get(0).props.columns.length).toBe(3);
    expect(wrapper.find(Modal).length).toBe(3);
  });
  it('shall create edit table', () => {
    const requestFields = [
      {
        name: 'id',
        label: 'Id',
        type: 'string',
        required: true,
        disabled: true,
      },
      {
        name: 'weight',
        type: 'number',
        required: true,
      },
    ];

    const services = {
      create: jest.fn(),
      update: jest.fn(),
      query: jest.fn(),
      delete: jest.fn(),
    };

    const Table = createEditTable('Test', 'parent', [], requestFields, services);
    const wrapper = mount(<Table />);
    expect(wrapper.find(EditableProTable).get(0).props.columns.length).toBe(3);
  });
});
