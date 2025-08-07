import {
  createPiece,
  PieceAuth,
  Property
} from "@activepieces/pieces-framework";
import { getRecord } from './lib/actions/get-record';
import { createRecord } from './lib/actions/create-record';
import { updateRecord } from "./lib/actions/update-record";
import { upsertRecord } from "./lib/actions/upsert-record";
import { deleteRecord } from "./lib/actions/delete-record";
import { getGroup } from './lib/actions/get-group';
import { deleteGroup } from './lib/actions/delete-group';
import { createUser } from './lib/actions/create-user';
import { getUser } from './lib/actions/get-user';
import { deleteUser } from './lib/actions/delete-user';
import { createDept } from './lib/actions/create-dept';
import { getDept } from './lib/actions/get-dept';
import { updateDept } from './lib/actions/update-dept';
import { deleteDept } from './lib/actions/delete-dept';

const markdown = `
Pleasanter API Key
(https://pleasanter.org/ja/manual/api)
**Note**: The API Key is available in "User" - "API Settings" from the navigation menu.
`;

export const pleasanterAuth = PieceAuth.CustomAuth({
  description: markdown,
  required: true,
  props: {
    baseUrl: Property.ShortText({
      displayName: 'Base URL',
      description: 'Must start with http:// or https:// and must end with /api',
      defaultValue: 'https://pleasanter.net/fs/api',
      required: true,
    }),
    apiKey: PieceAuth.SecretText({
      displayName: 'API Key',
      description: 'Please use **test-key** as value for API Key',
      required: true
    })
  },
  validate: async ({ auth }) => {
    if (!auth) {
      return {
        valid: false,
        error: 'Missing authentication information',
      };
    }
    const baseUrl = (auth as { baseUrl: string }).baseUrl.trim();
    const startsWithHttp = baseUrl.startsWith('http://') || baseUrl.startsWith('https://');
    const endsWithSlash = baseUrl.endsWith('/api');

    if (!startsWithHttp) {
      return {
        valid: false,
        error: 'Base URL must start with http:// or https://',
      };
    }
    if (!endsWithSlash) {
      return {
        valid: false,
        error: 'Base URL must end with a "/api"',
      };
    }

    return {
      valid: true,
    };
  },
});

export const pleasanter = createPiece({
  displayName: 'Pleasanter(unofficial)',
  auth: pleasanterAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/pleasanter.png',
  authors: ['hijiriishi'],
  actions: [
    createRecord,
    getRecord,
    updateRecord,
    upsertRecord,
    deleteRecord,
    getGroup,
    deleteGroup,
    createUser,
    getUser,
    deleteUser,
    createDept,
    getDept,
    updateDept,
    deleteDept,
  ],
  triggers: [],
});
