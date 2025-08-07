import { createAction } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

export const getDept = createAction({
  name: 'get_dept',
  auth: pleasanterAuth,
  displayName: 'Get Department',
  description: 'retrieve department records',
  props: {
  },
  async run(context) {
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/depts/get`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
      },
    });
    return res.body;
  },
});
