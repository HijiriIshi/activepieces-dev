import { createAction } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

export const deleteDept = createAction({
  name: 'delete_dept',
  auth: pleasanterAuth,
  displayName: 'Delete Department',
  description: '',
  props: {
    deptID: pleasanterCommon.deptID,
  },
  async run(context) {
    const { deptID } = context.propsValue;
    
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/depts/${deptID}/delete`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
      },
    });
    return res.body;
  },
});
