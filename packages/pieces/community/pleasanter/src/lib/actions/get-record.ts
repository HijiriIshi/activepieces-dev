import { createAction } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

export const getRecord = createAction({
  name: 'get_record',
  auth: pleasanterAuth,
  displayName: 'Get Record',
  description: 'retrieve a single record by ID',
  props: {
    controllerName: pleasanterCommon.controllerName,
    recordID: pleasanterCommon.recordID,
  },
  async run(context) {
    const {controllerName, recordID} = context.propsValue;
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/${controllerName}/${recordID}/get`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
      },
    });
    return res.body;
  },
});
