import Parse from 'parse/node';
import request from 'umi-request';
import type { Field } from './data';

if (BACKEND_ENV) {
  Parse.initialize(BACKEND_ENV.parse_app_id);
  Parse.serverURL = BACKEND_ENV.parse_server_url;
}

export class Services {
  name: string;

  url: string;

  fields: Record<string, Field>;

  pointers: object;

  constructor(name: string, fields: Field[], pointers: object) {
    this.name = name;
    this.url = `/api/${this.name.toLowerCase()}s`;
    this.pointers = pointers;
    this.fields = {};
    fields.forEach((f) => {
      this.fields[f.name] = f;
    });
  }

  createServices = () => {
    return {
      create: this.create,
      update: this.update,
      query: this.query,
      delete: this.delete,
    };
  };

  query = async (params: any) => {
    if (REACT_APP_ENV === 'staging' || REACT_APP_ENV === 'production') {
      const sessionToken = localStorage.getItem('sessionToken');
      const query = new Parse.Query(this.name);
      query.withCount();
      const skip = (params.current - 1) * params.pageSize;
      if (skip > 0) {
        query.skip(skip);
      }
      let { sorter } = params;
      if (sorter === undefined) {
        sorter = {};
      }
      if (Object.keys(sorter).length !== 0) {
        Object.keys(sorter).forEach((key) => {
          if (sorter[key] === 'ascend') {
            query.ascending(key);
          }
          if (sorter[key] === 'descend') {
            query.descending(key);
          }
        });
      } else {
        query.descending('createdAt');
      }
      if (params.filter) {
        Object.keys(params.filter).forEach((key) => {
          if (this.pointers[key]) {
            const PointerClass = Parse.Object.extend(this.pointers[key]);
            const p = new PointerClass();
            p.id = params.filter[key];
            query.equalTo(key, p);
          } else if (key === 'id') {
            query.equalTo('objectId', params.filter[key]);
          } else {
            query.fullText(key, params.filter[key]);
          }
        });
      }
      query.limit(params.pageSize);
      const { results, count } = await query.find({ sessionToken });
      const data = results.map((i: { toJSON: () => any; get: (key: string) => any }) => {
        const j = i.toJSON();

        const r: any = {};
        Object.keys(j).forEach((key) => {
          if (key === 'objectId') {
            r.id = j[key];
          } else if (!j[key]) {
            r[key] = '';
          } else if (j[key].objectId) {
            r[key] = j[key].objectId;
            // eslint-disable-next-line no-underscore-dangle
          } else if (j[key].__type === 'Date') {
            r[key] = i.get(key);
          } else if (j[key].constructor === Array || j[key].constructor === Object) {
            if (this.fields[key]) {
              switch (this.fields[key].type) {
                case 'multiselect':
                  r[key] = j[key];
                  break;
                case 'upload':
                  r[key] = j[key];
                  break;
                default:
                  r[key] = JSON.stringify(j[key]);
              }
            } else {
              r[key] = JSON.stringify(j[key]);
            }
          } else if (j[key].constructor === Number) {
            r[key] = parseFloat(j[key]);
          } else if (this.fields[key] && this.fields[key].type === 'boolean') {
            r[key] = i.get(key);
          } else if (this.fields[key] && this.fields[key].type === 'upload') {
            r[key] = JSON.stringify(j[key]);
          } else {
            r[key] = j[key].toString();
          }
        });
        return r;
      });
      return {
        data,
        total: count,
        current: params.current,
        pageSize: params.pageSize,
      };
    }
    return request(this.url, {
      params,
    });
  };

  delete = async ({ id }: { id: string }) => {
    if (REACT_APP_ENV === 'staging' || REACT_APP_ENV === 'production') {
      const sessionToken = localStorage.getItem('sessionToken');
      const query = new Parse.Query(this.name);
      const category = await query.get(id, { sessionToken });
      return category.destroy({ sessionToken });
    }
    return request(this.url, {
      method: 'POST',
      data: {
        id,
        method: 'delete',
      },
    });
  };

  getBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  saveItem = async (item: any, others: any) => {
    const sessionToken = localStorage.getItem('sessionToken');
    const state = Object.keys(others).map(async (key) => {
      if (others[key] === undefined || others[key] === null) {
        item.unset(key);
      } else if (this.pointers[key]) {
        const PointerClass = Parse.Object.extend(this.pointers[key]);
        const p = new PointerClass();
        p.id = others[key];
        item.set(key, p);
      } else if (this.fields[key]) {
        const { type } = this.fields[key];
        let value;
        switch (type) {
          case 'boolean':
            if (others[key] !== undefined) {
              value = others[key] === 'true' || others[key] === true;
            }
            break;
          case 'json':
            value = JSON.parse(others[key]);
            break;
          case 'number':
            value = parseFloat(others[key]);
            break;
          case 'date':
            value = new Date(others[key]);
            break;
          case 'upload':
            if (others[key] && others[key].originFileObj) {
              const base64 = await this.getBase64(others[key].originFileObj);
              const file = new Parse.File('cover.jpg', { base64 });
              await file.save(null, { sessionToken });
              value = file;
            }
            break;
          default:
            value = others[key];
        }
        item.set(key, value);
      }
    });

    await Promise.all(state);
    return item.save(null, { sessionToken });
  };

  create = async (params: any) => {
    if (REACT_APP_ENV === 'staging' || REACT_APP_ENV === 'production') {
      const ItemClass = Parse.Object.extend(this.name);
      const item = new ItemClass();
      const { id, index, ...others } = params;
      return this.saveItem(item, others);
    }
    return request(this.url, {
      method: 'POST',
      data: {
        ...params,
        method: 'post',
      },
    });
  };

  update = async (params: any) => {
    if (REACT_APP_ENV === 'staging' || REACT_APP_ENV === 'production') {
      const { id, index, ...others } = params;
      const sessionToken = localStorage.getItem('sessionToken');
      const query = new Parse.Query(this.name);
      const item = await query.get(id, { sessionToken });
      return this.saveItem(item, others);
    }
    return request(this.url, {
      method: 'POST',
      data: {
        ...params,
        method: 'update',
      },
    });
  };
}
