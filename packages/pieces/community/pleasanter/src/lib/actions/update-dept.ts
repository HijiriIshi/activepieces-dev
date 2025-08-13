import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

export const updateDept = createAction({
  name: 'update_dept',
  auth: pleasanterAuth,
  displayName: 'Update Department',
  description: '',
  props: {
    deptID: pleasanterCommon.deptID,
    DeptCode: Property.ShortText({
      displayName: 'DeptCode',
      description: 'Department code of the updated department',
      required: true
    }),
    DeptName: Property.ShortText({
      displayName: 'Name',
      description: 'Updated department name',
      required: true
    }),
    Body: Property.LongText({
      displayName: 'Body',
      description: 'Updated department description',
      required: false
    }),
  },
  async run(context) {
    const {
      deptID, DeptCode, DeptName, Body
    } = context.propsValue;
    const params: Record<string, unknown> = Object.fromEntries(
      Object.entries({
        DeptCode,
        DeptName,
        Body,
      })
      .filter(([_, value]) => value !== undefined)
    );
    
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
