import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { pleasanterCommon } from '../common';
import { pleasanterAuth } from '../..';

export const createGroup = createAction({
  name: 'create_group',
  auth: pleasanterAuth,
  displayName: 'Create Group',
  description: 'create new groups',
  props: {
    GroupName: Property.ShortText({
      displayName: 'GroupName',
      description: 'Name of group to register',
      required: true
    }),
    Body: Property.LongText({
      displayName: 'Body',
      description: 'Description of the group to register',
      required: false
    }),
    GroupMembers: Property.Json({
      displayName: 'GroupMembers',
      description: 'Specify the information of users and organizations to add as group members in an array, separated by commas.',
      required: false,
      defaultValue: ['User,1,True', 'Dept,1,False']
    }),
    GroupChildren: Property.Json({
      displayName: 'GroupChildren',
      description: 'Specify the group information to be added to the child group in an array separated by commas.',
      required: false,
      defaultValue: ['Group,1,']
    }),
  },
  async run(context) {
    const {
      GroupName, Body, GroupMembers, GroupChildren
    } = context.propsValue;
    const params: Record<string, unknown> = Object.fromEntries(
      Object.entries({
        GroupName,
        Body,
        GroupMembers,
        GroupChildren,
      })
      .filter(([, value]) => value !== undefined)
    );

    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: `${context.auth.baseUrl}/groups/create`,
      body: {
        ApiVersion: pleasanterCommon.ApiVersion,
        ApiKey: context.auth.apiKey,
        ...params,
      },
    });
    return res.body;
  },
});
