import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

export const createUser = createAction({
  name: 'create_user',
  auth: pleasanterAuth,
  displayName: 'Create User',
  description: '',
  props: {
    LoginId: Property.ShortText({
      displayName: 'loginId',
      description: 'Enter the login ID of the user to register',
      required: true
    }),
    Name: Property.ShortText({
      displayName: 'Name',
      description: 'Name of user to register',
      required: true
    }),
    Password: Property.ShortText({
      displayName: 'Password',
      description: 'Password',
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
      LoginId, Name, Password, MailAddresses
    } = context.propsValue;
    const params: Record<string, unknown> = Object.fromEntries(
      Object.entries({
        LoginId,
        Name,
        Password,
        MailAddresses,
      })
      .filter(([_, value]) => value !== undefined)
    );
    
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/users/create`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
        ...params,
      },
    });
    return res.body;
  },
});
