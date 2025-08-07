import { Property } from '@activepieces/pieces-framework';

export type FieldEntry<T> = { fieldKey: string; fieldValue: T };

export function buildHash<T>(array: FieldEntry<T>[] | undefined): Record<string, T> | undefined {
  return array?.length
    ? Object.fromEntries(array.map(({ fieldKey, fieldValue }) => [fieldKey, fieldValue]))
    : undefined;
}

const createHashOptions = (prefix: string) =>
  Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i); // 65 = 'A'
    const label = `${prefix}${letter}`;
    return { label, value: label };
});

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
  processIds: Property.Array({
    displayName: 'ProccessIds',
    description: 'execute a process by specifying the Process ID',
    required: false
  }),
  classHash: createHashProperty('Class', 'ClassHash', 'Class Item', Property.ShortText({ displayName: 'Value', required: false })),
  numHash: createHashProperty('Num', 'NumHash', 'Numerical Item', Property.Number({ displayName: 'Value', required: false })),
  dateHash: createHashProperty('Date', 'DateHash', 'Date Item', Property.DateTime({ displayName: 'Value', required: false })),
  descriptionHash: createHashProperty('Description', 'DescriptionHash', 'Description Item', Property.LongText({ displayName: 'Value', required: false })),
  checkHash: createHashProperty('Check', 'CheckHash', 'Check Item', Property.Checkbox({ displayName: 'Value', required: false })),
}