import { createTable } from 'paxy-ui';
import { Services } from '../../core/service';

import { requestFields, updateRequestFields, tableFields } from './fields';

const services = new Services('Field', tableFields, {});

const TableList = createTable(
  'Field',
  null,
  requestFields,
  updateRequestFields,
  tableFields,
  services,
);

export default TableList;
