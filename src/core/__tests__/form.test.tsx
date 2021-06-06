import React from 'react';
import { mount } from 'enzyme';
import './matchMedia';
import { Input, Switch, Form, Modal } from 'antd';

import { formFactory, modalFormFactory } from '../form';

const { TextArea } = Input;

describe('test form', () => {
  it('shall create form', () => {
    // const [form] = Form.useForm();
    const Item = [
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
      {
        name: 'description',
        type: 'text',
        required: true,
      },
      {
        name: 'available',
        type: 'boolean',
        required: true,
      },
      {
        name: 'title',
        type: 'paragraph',
        required: true,
      },
    ];
    const F = formFactory('create', Item);
    let wrapper = mount(<F />);
    expect(wrapper.find(Form.Item).length).toBe(5);
    expect(wrapper.find(Input).length).toBe(2);
    expect(wrapper.find(TextArea).length).toBe(1);
    expect(wrapper.find(Switch).length).toBe(1);
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find(Input).get(0).props.type).toBe('text');
    expect(wrapper.find(Input).get(0).props.value).toBe(undefined);
    expect(wrapper.find(Input).get(0).props.disabled).toBe(true);
    expect(wrapper.find(Input).get(1).props.type).toBe('number');
    expect(wrapper.find(Input).get(1).props.value).toBe(undefined);
    expect(wrapper.find(Switch).get(0).props.defaultChecked).toBe(false);

    wrapper = mount(<F initialValues={{ id: '1234', available: true, title: 'ab' }} />);
    expect(wrapper.find(Input).get(0).props.value).toBe('1234');
    expect(wrapper.find(Switch).get(0).props.checked).toBe(true);
    expect(wrapper.find('p').text()).toBe('Please confirm to delete ab');
  });
  it('shall create modal form', () => {
    // const [form] = Form.useForm();
    const Item = [
      {
        name: 'id',
        label: 'Id',
        type: 'string',
        required: true,
      },
    ];
    const TestModal = modalFormFactory('Test', Item);
    const wrapper = mount(<TestModal modalVisible onCancel={() => true} onSubmit={() => true} />);
    expect(wrapper.find(Modal).get(0).props.title).toBe('Test');
    expect(wrapper.find(Modal).get(0).props.visible).toBe(true);
    expect(wrapper.find(Form).get(0).props.name).toBe('test_form_in_modal');
    expect(wrapper.find(Form.Item).length).toBe(1);
  });
  it('shall submit the modal form', async () => {
    const Item = [
      {
        name: 'id',
        label: 'Id',
        type: 'string',
        required: true,
      },
    ];
    const onSubmit = jest.fn();
    const TestModal = modalFormFactory('Test', Item);
    const wrapper = mount(
      <TestModal
        modalVisible
        onCancel={() => true}
        onSubmit={onSubmit}
        initialValues={{ id: 1 }}
      />,
    );
    await wrapper.find(Modal).get(0).props.onOk();
    expect(onSubmit.mock.calls[0][0]).toStrictEqual({ id: 1 });
  });
  it('shall validate the modal form', async () => {
    const Item = [
      {
        name: 'id',
        label: 'Id',
        type: 'string',
        required: true,
      },
    ];
    const onSubmit = jest.fn();
    const TestModal = modalFormFactory('Test', Item);
    const wrapper = mount(<TestModal modalVisible onCancel={() => true} onSubmit={onSubmit} />);
    await expect(wrapper.find(Modal).get(0).props.onOk()).rejects.toStrictEqual({
      errorFields: [{ errors: ["'id' is required"], name: ['id'] }],
      outOfDate: false,
      values: { id: undefined },
    });

    expect(onSubmit.mock.calls.length).toBe(0);
  });
});
