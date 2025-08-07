import { Property, ApFile } from '@activepieces/pieces-framework';
import { createHashOptions } from './item'
import mime from 'mime-types';

type AttachmentsCreateHash = Record<string, {
  Name: string;
  Base64: string;
  ContentType: string;
}[]>;

type AttachmentsCreateProps = {
  fieldKey: string;
  fileName: string | undefined;
  file: ApFile;
};

const isAttachmentsCreateProps = (obj: unknown): obj is AttachmentsCreateProps =>
  typeof obj === 'object' &&
  obj !== null &&
  'fieldKey' in obj &&
  'fileName' in obj &&
  'file' in obj;

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

  buildHash(attachmentsCreateProps: unknown[] | undefined): AttachmentsCreateHash | undefined {
    if (!attachmentsCreateProps || attachmentsCreateProps.length === 0) return undefined;
    const hash: AttachmentsCreateHash = {};

    for (const item of attachmentsCreateProps) {
      if (!isAttachmentsCreateProps(item)) continue;

      const { fieldKey, fileName, file } = item;

      if (!hash[fieldKey]) {
        hash[fieldKey] = [];
      }

      let mimeType = 'application/octet-stream';
      if (fileName) {
        mimeType = mime.lookup(fileName) || mimeType;
      } else if (file.extension) {
        mimeType = mime.lookup(file.extension) || mimeType;
      }

      hash[fieldKey].push({
        Name: fileName || file.filename,
        Base64: file.data.toString('base64'),
        ContentType: mimeType,
      });
    }

    return Object.keys(hash).length > 0 ? hash : undefined;
  },
}
