import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon, setIfExists } from '../common';
import { pleasanterAuth } from '../..';

export const updateDept = createAction({
  name: 'update_dept',
  auth: pleasanterAuth,
  displayName: 'Update Department',
  description: '',
  props: {
    deptID: pleasanterCommon.deptID,
    deptCode: Property.ShortText({
      displayName: 'DeptCode',
      description: 'Department code of the updated department',
      required: true
    }),
    name: Property.ShortText({
      displayName: 'Name',
      description: 'Updated department name',
      required: true
    }),
    body: Property.LongText({
      displayName: 'Body',
      description: 'Updated department description',
      required: false
    }),
  },
  async run(context) {
    const {
      deptID, deptCode, name, body
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
      url: `${context.auth.baseUrl}/depts/${deptID}/update`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
        ...params,
      },
    });
    return res.body;
  },
});
