import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

interface BinaryResponse {
  FileName?: string;
  Base64?: string;
  [key: string]: any;
}

export const getAttachment = createAction({
  name: 'get_attachment',
  auth: pleasanterAuth,
  displayName: 'Get Attachment',
  description: 'retrieve attachment',
  props: {
    guid: pleasanterCommon.guid,
    raw: Property.Checkbox({
      displayName: 'Raw Response',
      description: 'Check this box to receive the raw API response.',
      required: true,
      defaultValue: false,
    })
  },
  async run(context) {
    const { guid, raw } = context.propsValue;
    const res = await httpClient.sendRequest<{Response: BinaryResponse}>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/binaries/${guid}/get`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
      },
    });

    if (raw) {
      return res.body;
    }

    const response = res.body.Response;
    let file: string | null = null;
    if (response?.FileName && response?.Base64) {
      file = await context.files.write({
        fileName: response.FileName,
        data: Buffer.from(response.Base64, 'base64'),
      });
    }
    const { Base64, ...responseWithoutBase64 } = response; //delete Base64
    return {
      ...res.body,
      file,
      Response: {
        ...responseWithoutBase64,
      }
    };
  },
});
