import { createAction } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

export const deleteGroup = createAction({
  name: 'delete_group',
  auth: pleasanterAuth,
  displayName: 'Delete Group',
  description: '',
  props: {
    groupID: pleasanterCommon.groupID,
  },
  async run(context) {
    const { groupID } = context.propsValue;
    
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/groups/${groupID}/delete`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
      },
    });
    return res.body;
  },
});
