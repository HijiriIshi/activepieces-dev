import { createAction } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { itemProps, buildItemParams } from '../common/item';
import { pleasanterAuth } from '../..';

export const updateRecord = createAction({
  name: 'update_record',
  auth: pleasanterAuth,
  displayName: 'Update Record',
  description: '',
  props: {
    recordID: pleasanterCommon.recordID,
    ...itemProps,
  },
  async run(context) {
    const { recordID } = context.propsValue;
    const params = buildItemParams(context.propsValue);

    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/items/${recordID}/update`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
        ...params,
      },
    });
    return res.body;
  },
});