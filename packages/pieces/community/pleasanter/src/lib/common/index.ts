import { Property } from '@activepieces/pieces-framework';

export function setIfExists(params: Record<string, unknown>, key: string, value: unknown): void {
  if (value !== undefined && value !== null) {
    params[key] = value;
  }
}

export const pleasanterCommon = {
  ApiVersion: '1.1',
  controllerName: Property.StaticDropdown({
    displayName: 'controller name',
    description: 'The controller type',
    required: true,
    options: {
      options: [
        {label: 'Tenant management screen', value: 'tenants'},
        {label: 'Department management screen', value: 'depts'},
        {label: 'Group management screen', value: 'groups'},
        {label: 'User management screen', value: 'users'},
        {label: 'Item management screen', value: 'items'},
      ],
    },
    defaultValue: 'items'
  }),
  siteID: Property.Number({
    displayName: 'Site ID',
    description: '',
    required: true,
  }),
  recordID: Property.Number({
    displayName: 'Record ID',
    description: '',
    required: true,
  }),
  groupID: Property.Number({
    displayName: 'Group ID',
    description: '',
    required: true,
  }),
  userID: Property.Number({
    displayName: 'User ID',
    description: '',
    required: true,
  }),
  deptID: Property.Number({
    displayName: 'Dept ID',
    description: 'Department ID',
    required: true,
  }),
}
