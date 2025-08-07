import { createAction } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon, setIfExists } from '../common';
import { itemProps, FieldEntry, buildHash } from '../common/item';
import { pleasanterAuth } from '../..';

export const updateRecord = createAction({
  name: 'update_record',
  auth: pleasanterAuth,
  displayName: 'Update Record',
  description: '',
  props: {
    recordID: pleasanterCommon.recordID,
    ...itemProps
  },
  async run(context) {
    const {
      recordID, title, body, startTime, completionTime,
      workValue, progressRate, status, manager, owner,
      locked, comments, processIds,
      classHash, numHash, dateHash, descriptionHash, checkHash,
    } = context.propsValue;
    const params: Record<string, unknown> = {};
    const paramsArray: [string, unknown][] = [
      ['Title', title],
      ['Body', body],
      ['StartTime', startTime],
      ['CompletionTime', completionTime],
      ['WorkValue', workValue],
      ['ProgressRate', progressRate],
      ['Status', status],
      ['Manager', manager],
      ['Owner', owner],
      ['Locked', locked],
      ['Comments', comments],
      ['processIds', processIds],
    ];
    paramsArray.forEach(([key, value]) => setIfExists(params, key, value));

    setIfExists(params, 'ClassHash', buildHash(classHash as FieldEntry<string>[] | undefined));
    setIfExists(params, 'NumHash', buildHash(numHash as FieldEntry<number>[] | undefined));
    setIfExists(params, 'DateHash', buildHash(dateHash as FieldEntry<unknown>[] | undefined));
    setIfExists(params, 'DescriptionHash', buildHash(descriptionHash as FieldEntry<string>[] | undefined));
    setIfExists(params, 'CheckHash', buildHash(checkHash as FieldEntry<boolean>[] | undefined));
    
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
