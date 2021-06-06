import { createTable } from 'paxy-ui';
import { Services } from '../../core/service';

import { requestFields, updateRequestFields, tableFields } from './fields';

const services = new Services('Table', tableFields, {});

const TableList = createTable(
  'Table',
  null,
  requestFields,
  updateRequestFields,
  tableFields,
  services,
);

export default TableList;
