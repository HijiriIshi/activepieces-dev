import { createAction } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { itemProps, buildItemParams } from '../common/item';
import { pleasanterAuth } from '../..';

export const createRecord = createAction({
  name: 'create_record',
  auth: pleasanterAuth,
  displayName: 'Create Record',
  description: '',
  props: {
    siteID: pleasanterCommon.siteID,
    ...itemProps,
  },
  async run(context) {
    const {
      siteID
    } = context.propsValue;
    const params = buildItemParams(context.propsValue);
    
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/items/${siteID}/create`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
        ...params,
      },
    });
    return res.body;
  },
});