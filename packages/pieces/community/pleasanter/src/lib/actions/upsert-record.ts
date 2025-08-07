import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon, setIfExists } from '../common';
import { itemProps, FieldEntry, buildHash } from '../common/item';
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
    ...itemProps
  },
  async run(context) {
    const {
      siteID, keys, title, body, startTime, completionTime,
      workValue, progressRate, status, manager, owner,
      locked, comments, processIds,
      classHash, numHash, dateHash, descriptionHash, checkHash,
    } = context.propsValue;
    const params: Record<string, unknown> = {};
    const paramsArray: [string, unknown][] = [
      ['Keys', keys],
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
