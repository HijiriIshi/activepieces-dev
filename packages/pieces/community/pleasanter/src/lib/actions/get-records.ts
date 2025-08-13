import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

export const getRecords = createAction({
  name: 'get_records',
  auth: pleasanterAuth,
  displayName: 'Get Multiple Records',
  description: 'retrieves multiple records',
  props: {
    siteID: pleasanterCommon.siteID,
    Offset: Property.Number({
      displayName: 'Offset',
      description: 'By specifying Offset, you can retrieve subsequent records.',
      required: false,
    }),
    View: pleasanterCommon.view,
  },
  async run(context) {
    const { siteID, Offset, View } = context.propsValue;
    const params: Record<string, unknown> = Object.fromEntries(
      Object.entries({
        Offset,
        View,
      })
      .filter(([_, value]) => value !== undefined)
    );
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/items/${siteID}/get`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
        ...params,
      },
    });
    return res.body;
  },
});
