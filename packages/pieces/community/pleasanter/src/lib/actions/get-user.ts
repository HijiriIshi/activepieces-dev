import { createAction } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

export const getUser = createAction({
  name: 'get_user',
  auth: pleasanterAuth,
  displayName: 'Get User',
  description: 'retrieve user records',
  props: {
    View: pleasanterCommon.view,
  },
  async run(context) {
    const { View } = context.propsValue;
    const params: Record<string, unknown> = Object.fromEntries(
      Object.entries({
        View,
      })
      .filter(([_, value]) => value !== undefined)
    );
    
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/users/get`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
        ...params,
      },
    });
    return res.body;
  },
});
