import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

export const updateUser = createAction({
  name: 'update_user',
  auth: pleasanterAuth,
  displayName: 'Update User',
  description: '',
  props: {
    userId: pleasanterCommon.userID,
    Name: Property.ShortText({
      displayName: 'Name',
      description: 'Updated User Name',
      required: true
    }),
    MailAddresses: Property.Array({
      displayName: 'MailAddresses',
      description: 'MailAddresses',
      required: false
    })
  },
  async run(context) {
    const {
      userId, Name, MailAddresses
    } = context.propsValue;
    const params: Record<string, unknown> = Object.fromEntries(
      Object.entries({
        Name,
        MailAddresses,
      })
      .filter(([, value]) => value !== undefined)
    );
    
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/users/${userId}/update`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
        ...params,
      },
    });
    return res.body;
  },
});
