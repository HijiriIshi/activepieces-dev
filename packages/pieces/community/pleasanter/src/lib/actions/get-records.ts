import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon, setIfExists } from '../common';
import { pleasanterAuth } from '../..';

export const getRecords = createAction({
  name: 'get_records',
  auth: pleasanterAuth,
  displayName: 'Get Multiple Records',
  description: 'retrieves multiple records',
  props: {
    siteID: pleasanterCommon.siteID,
    offset: Property.Number({
      displayName: 'Offset',
      description: 'By specifying Offset, you can retrieve subsequent records.',
      required: false,
    }),
  },
  async run(context) {
    const { siteID, offset } = context.propsValue;
    const params: Record<string, unknown> = {};
    const paramsArray: [string, unknown][] = [
      ['Offset', offset ],
    ];
    paramsArray.forEach(([key, value]) => setIfExists(params, key, value));
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/items/${siteID}/get`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
      },
    });
    return res.body;
  },
});
