import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon, setIfExists } from '../common';
import { pleasanterAuth } from '../..';

export const createDept = createAction({
  name: 'create_dept',
  auth: pleasanterAuth,
  displayName: 'Create Department',
  description: '',
  props: {
    deptCode: Property.ShortText({
      displayName: 'DeptCode',
      description: 'Department code of the department to register',
      required: true
    }),
    name: Property.ShortText({
      displayName: 'Name',
      description: 'Name of the department to register',
      required: true
    }),
    body: Property.LongText({
      displayName: 'Body',
      description: 'Description of the department to register',
      required: false
    }),
  },
  async run(context) {
    const {
      deptCode, name, body
    } = context.propsValue;
    const params: Record<string, unknown> = {};
    const paramsArray: [string, unknown][] = [
      ['DeptCode', deptCode],
      ['DeptName', name],
      ['Body', body],
    ];
    paramsArray.forEach(([key, value]) => setIfExists(params, key, value));
    
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/depts/create`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
        ...params,
      },
    });
    return res.body;
  },
});
