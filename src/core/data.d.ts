export interface ValueEnum {
  text: string;
  value: string;
}

export interface Field {
  name: string;
  label?: string;
  type: string;
  required: boolean;
  disabled?: boolean;
  render?: function;
  width?: string | number;
  valueEnum?: ValueEnum[];
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface Services {
  create: (fieldsValues: object) => void;
  update: (fieldsValues: object) => void;
  query: (fieldsValues: object) => any;
  delete: (fieldsValues: object) => void;
}
