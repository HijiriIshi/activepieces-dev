import { Property } from '@activepieces/pieces-framework';
import { createHashOptions } from './utils';
import { attachmentsCreateHash } from './attachments';

export type FieldEntry<T> = { fieldKey: string; fieldValue: T };

function buildHash<T>(array: FieldEntry<T>[] | undefined): Record<string, T> | undefined {
  return array?.length
    ? Object.fromEntries(array.map(({ fieldKey, fieldValue }) => [fieldKey, fieldValue]))
    : undefined;
}

const createHashProperty = (
  prefix: 'Class' | 'Num' | 'Date' | 'Description' | 'Check',
  displayName: string,
  description: string,
  valueProp: ReturnType<typeof Property.ShortText | typeof Property.Number | typeof Property.DateTime | typeof Property.LongText | typeof Property.Checkbox>,
) =>
  Property.Array({
    displayName,
    description,
    properties: {
      fieldKey: Property.StaticDropdown({
        displayName: 'Item',
        required: true,
        options: {
          options: createHashOptions(prefix),
        },
      }),
      fieldValue: valueProp,
    },
    required: false,
    defaultValue: [],
  });

export const itemProps = {
  title: Property.ShortText({
    displayName: 'Title',
    description: 'Title',
    required: false,
  }),
  body: Property.LongText({
    displayName: 'Body',
    description: 'Body',
    required: false,
  }),
  timeLimited: Property.Checkbox({
    displayName: 'Time-limited Table',
    defaultValue: false,
    description: 'Show the settings for the Time-limited Table.',
    required: false,
  }),
  timeLimitedSettings: Property.DynamicProperties({
      displayName: 'Time-limited Table Settings',
      refreshers: ['timeLimited'],
      required: false,
      props: async ({ timeLimited }) => {
        if (!timeLimited) return {};
        const properties = {
          startTime: Property.DateTime({
            displayName: 'Start Time',
            description: 'Only for time-limited tables',
            required: false,
          }),
          completionTime: Property.DateTime({
            displayName: 'Complete',
            description: 'Only for time-limited tables',
            required: false,
          }),
          workValue: Property.Number({
            displayName: 'Workload',
            description: 'Only for time-limited tables',
            required: false,
          }),
          progressRate: Property.Number({
            displayName: 'Progress Rate',
            description: 'Only for time-limited tables',
            required: false,
          }),
        };
        return properties;
      },
    }),
  status: Property.Number({
    displayName: 'Status',
    description: 'Status Item',
    required: false,
  }),
  manager: Property.Number({
    displayName: 'Manager',
    description: 'User ID',
    required: false,
  }),
  owner: Property.Number({
    displayName: 'Owner',
    description: 'User ID',
    required: false,
  }),
  locked: Property.Checkbox({
    displayName: 'Locked',
    description: 'Lock Item',
    required: false,
  }),
  comments: Property.LongText({
    displayName: 'Comments',
    description: 'Comment Item',
    required: false,
  }),
  classHash: createHashProperty('Class', 'ClassHash', 'Class Item', Property.ShortText({ displayName: 'Value', required: false })),
  numHash: createHashProperty('Num', 'NumHash', 'Numerical Item', Property.Number({ displayName: 'Value', required: false })),
  dateHash: createHashProperty('Date', 'DateHash', 'Date Item', Property.DateTime({ displayName: 'Value', required: false })),
  descriptionHash: createHashProperty('Description', 'DescriptionHash', 'Description Item', Property.LongText({ displayName: 'Value', required: false })),
  checkHash: createHashProperty('Check', 'CheckHash', 'Check Item', Property.Checkbox({ displayName: 'Value', required: false })),
  attachments: attachmentsCreateHash.Props,
  proccessIds: Property.Array({
    displayName: 'ProccessIds',
    description: 'execute a process by specifying the Process ID',
    required: false
  }),
}

export function buildItemParams(props: Record<string, any>): Record<string, unknown> {
  const {
    title,
    body,
    timeLimited,
    timeLimitedSettings,
    status,
    manager,
    owner,
    locked,
    comments,
    proccessIds,
    classHash,
    numHash,
    dateHash,
    descriptionHash,
    checkHash, 
    attachments,
  } = props;
  const params: Record<string, unknown> = {};
  const paramsArray: [string, unknown][] = [
    ['Title', title],
    ['Body', body],
    ['Status', status],
    ['Manager', manager],
    ['Owner', owner],
    ['Locked', locked],
    ['Comments', comments],
  ];
  if (timeLimited) {
    if (timeLimitedSettings) {
      paramsArray.push(['StartTime', timeLimitedSettings['startTime']]);
      paramsArray.push(['CompletionTime', timeLimitedSettings['completionTime']]);
      paramsArray.push(['WorkValue', timeLimitedSettings['workValue']]);
      paramsArray.push(['ProgressRate', timeLimitedSettings['progressRate']]);
    }
  }
  paramsArray.forEach(([key, value]) => {
    if (value !== undefined) params[key] = value;
  });

  params['ClassHash'] = buildHash(classHash as FieldEntry<string>[] | undefined);
  params['NumHash'] = buildHash(numHash as FieldEntry<number>[] | undefined);
  params['DateHash'] = buildHash(dateHash as FieldEntry<unknown>[] | undefined);
  params['DescriptionHash'] = buildHash(descriptionHash as FieldEntry<string>[] | undefined);
  params['CheckHash'] = buildHash(checkHash as FieldEntry<boolean>[] | undefined);
  params['AttachmentsHash'] = attachments?.length ? attachmentsCreateHash.buildHash(attachments) : undefined;

  if(proccessIds && proccessIds.length > 0) {
    params['ProccessIds'] = (proccessIds as string[]).map(id => Number(id)).filter(num => !isNaN(num));
  }

  return params;
}