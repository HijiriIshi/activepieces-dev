import { createAction } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

export const getGroup = createAction({
  name: 'get_group',
  auth: pleasanterAuth,
  displayName: 'Get Group',
  description: 'retrieve group records',
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
      url: `${context.auth.baseUrl}/groups/get`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
        ...params,
      },
    });
    return res.body;
  },
});
