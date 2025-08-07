import { createAction } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

export const deleteUser = createAction({
  name: 'delete_user',
  auth: pleasanterAuth,
  displayName: 'Delete User',
  description: '',
  props: {
    userID: pleasanterCommon.userID,
  },
  async run(context) {
    const { userID } = context.propsValue;
    
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/users/${userID}/delete`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
      },
    });
    return res.body;
  },
});
