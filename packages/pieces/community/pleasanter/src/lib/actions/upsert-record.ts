import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { itemProps, buildItemParams } from '../common/item';
import { pleasanterAuth } from '../..';

export const upsertRecord = createAction({
  name: 'upsert_record',
  auth: pleasanterAuth,
  displayName: 'Upsert Record',
  description: 'If a record with a matching key is found, the record will be updated. If no matching record is found, a new record will be created.',
  props: {
    siteID: pleasanterCommon.siteID,
    keys: Property.Array ({
      displayName: 'Keys',
      description: 'Specify the key column. Multiple column can be specified.',
      required: true
    }),
    ...itemProps,
  },
  async run(context) {
    const { siteID, keys } = context.propsValue;
    const params = buildItemParams(context.propsValue);
    params['Keys'] = keys;

    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/items/${siteID}/upsert`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
        ...params,
      },
    });
    return res.body;
  },
});
