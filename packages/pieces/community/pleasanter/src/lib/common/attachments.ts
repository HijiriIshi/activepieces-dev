import { Property, ApFile } from '@activepieces/pieces-framework';
import { createHashOptions } from './utils';
import mime from 'mime-types';

type AttachmentsCreateHash = Record<string, {
  Name: string;
  Base64: string;
  ContentType: string;
}[]>;

type AttachmentsCreateProps = {
  fieldKey: string;
  fileName?: string;
  file: ApFile;
};

function isAttachmentsCreateProps(obj: unknown): obj is AttachmentsCreateProps {
  return typeof obj === 'object' &&
    obj !== null &&
    'fieldKey' in obj &&
    'file' in obj;
}

function getMimeType(fileName?: string, extension?: string): string {
  if (fileName) {
    return mime.lookup(fileName) || 'application/octet-stream';
  }
  if (extension) {
    return mime.lookup(extension) || 'application/octet-stream';
  }
  return 'application/octet-stream';
}

export const attachmentsCreateHash = {
  Props: Property.Array({
    displayName: 'AttachmentsHash',
    description: 'Attachment Item',
    properties: {
      fieldKey: Property.StaticDropdown({
        displayName: 'Item',
        required: true,
        options: {
          options: createHashOptions('Attachments'),
        },
      }),
      file: Property.File({
        displayName: 'File',
        description: 'File URL or a BASE64-encoded string with a MIME type (e.g., data:image/png;base64,iVBOR...)',
        required: true,
      }),
      fileName: Property.ShortText({
        displayName: 'File Name',
        required: false,
      }),
    },
    required: false,
    defaultValue: [],
  }),

  buildHash(attachments: unknown[] | undefined): AttachmentsCreateHash | undefined {
    if (!attachments || attachments.length === 0) return undefined;
    const hash: AttachmentsCreateHash = {};

    for (const item of attachments) {
      if (!isAttachmentsCreateProps(item)) continue;

      const { fieldKey, fileName, file } = item;

      if (!hash[fieldKey]) hash[fieldKey] = [];

      const mimeType = getMimeType(fileName, file.extension);

      hash[fieldKey].push({
        Name: fileName || file.filename,
        Base64: file.data.toString('base64'),
        ContentType: mimeType,
      });
    }

    return Object.keys(hash).length > 0 ? hash : undefined;
  },
}
