import express from 'express';
import { ItemList, MockBackend } from '../mock';

jest.mock('express');

describe('Test ItemList', () => {
  const fields = [
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
  it('shall delete', () => {
    const itemList = new ItemList();
    itemList.init(fields, 2);
    expect(itemList.items.length).toBe(2);
    itemList.delete(itemList.items[0].id);
    expect(itemList.items.length).toBe(1);
  });
  it('shall create items', () => {
    const itemList1 = new ItemList();
    itemList1.init(fields, 2);
    const itemList2 = new ItemList();
    itemList2.init(fields, 3);
    expect(itemList1.items.length).toBe(2);
    expect(itemList2.items.length).toBe(3);
  });
});

describe('Test api', () => {
  const fields = [
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
  it('shall delete', async () => {
    const itemList = new ItemList();
    itemList.init(fields, 2);
    const mock = new MockBackend(itemList, 'tests');
    express.request.body = { id: itemList.items[0].id, method: 'delete' };
    mock.post(express.request, express.response, '', express.request);
    expect(itemList.items.length).toBe(1);
  });
});
