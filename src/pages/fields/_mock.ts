import { MockBackend, ItemList } from 'paxy-ui';
import { tableFields } from './fields';

const items = new ItemList();
items.init(tableFields, 3);

const mock = new MockBackend(items, 'fields');
const apis = mock.api();

export default apis;
