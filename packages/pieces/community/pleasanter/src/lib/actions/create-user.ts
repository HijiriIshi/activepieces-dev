import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon, setIfExists } from '../common';
import { pleasanterAuth } from '../..';

export const createUser = createAction({
  name: 'create_user',
  auth: pleasanterAuth,
  displayName: 'Create User',
  description: '',
  props: {
    loginId: Property.ShortText({
      displayName: 'loginId',
      description: 'Enter the login ID of the user to register',
      required: true
    }),
    name: Property.ShortText({
      displayName: 'Name',
      description: 'Name of user to register',
      required: true
    }),
    password: Property.ShortText({
      displayName: 'Password',
      description: 'Password',
      required: true
    }),
    mailAddresses: Property.Array({
      displayName: 'MailAddresses',
      description: 'MailAddresses',
      required: false
    })
  },
  async run(context) {
    const {
      loginId, name, password, mailAddresses
    } = context.propsValue;
    const params: Record<string, unknown> = {};
    const paramsArray: [string, unknown][] = [
      ['LoginId', loginId],
      ['Name', name],
      ['Password', password],
      ['MailAddresses', mailAddresses]
    ];
    paramsArray.forEach(([key, value]) => setIfExists(params, key, value));
    
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
