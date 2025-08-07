import { createAction } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

export const deleteRecord = createAction({
  name: 'delete_record',
  auth: pleasanterAuth,
  displayName: 'Delete Record',
  description: '',
  props: {
    recordID: pleasanterCommon.recordID,
  },
  async run(context) {
    const { recordID } = context.propsValue;
    
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/items/${recordID}/delete`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
      },
    });
    return res.body;
  },
});
