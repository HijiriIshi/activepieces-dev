import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { propsValidation } from '@activepieces/pieces-common';
import { myjvnCommon } from '../common';
import { Parser } from 'xml2js';
import { z } from 'zod';

export const getVulnOverviewList = createAction({
  name: 'get-vulnoverviewlist',
  displayName: 'Get Vuln Overview List',
  description: 'fetch the overview list of vulnerability countermeasures.',
  props: {
    startItem: Property.Number({
      displayName: 'startItem',
			description: 'Start entry index (1 or greater))',
      required: false,
      defaultValue: 1
    }),
    maxCountItem: Property.Number({
      displayName: 'maxCountItem',
			description: 'Number of Entries to Retrieve (1 to 50)',
      required: false,
      defaultValue: 50
    }),
    cpeName: Property.Array({
      displayName: 'cpeNames',
			description: 'CPE Product Name (Format: cpe:/{part}:{vendor}:{product})',
      required: false,
      defaultValue: [],
    }),
    vendorId: Property.Array({
      displayName: 'vendorIds',
			description: 'vendorId',
      required: false,
      defaultValue: [],
    }),
    productId: Property.Array({
      displayName: 'productIds',
			description: 'productId',
      required: false,
      defaultValue: [],
    }),
    keyword: Property.ShortText({
      displayName: 'keyword',
			description: 'Keyword for partial match search of vendor name',
      required: false,
    }),
    severity: Property.StaticDropdown({
      displayName: 'severity',
      description: 'CVSS Severity ',
      required: false,
      options: {
        options: [
          { label: 'Critical', value: 'c'},
          { label: 'Important', value: 'h' },
          { label: 'Warning', value: 'm' },
          { label: 'Attention', value: 'l' },
          { label: 'None', value: 'n' },
        ],
      },
    }),
    vector: Property.ShortText({
      displayName: 'CVSS Base Metrics',
			description: 'CVSS Base Metrics',
      required: false,
    }),
    rangeDatePublic: Property.StaticDropdown({
      displayName: 'rangeDatePublic',
      description: 'Specify discovery date range',
      required: true,
      options: {
        options: [
          { label: 'No date range specified', value: 'n'},
          { label: 'Past week', value: 'w' },
          { label: 'Past month', value: 'm' },
        ],
      },
      defaultValue: 'w'
    }),
    rangeDatePublished: Property.StaticDropdown({
      displayName: 'rangeDatePublished',
      description: 'Specify update date range',
      required: true,
      options: {
        options: [
          { label: 'No date range specified', value: 'n'},
          { label: 'Past week', value: 'w' },
          { label: 'Past month', value: 'm' },
        ],
      },
      defaultValue: 'w'
    }),
    rangeDateFirstPublished: Property.StaticDropdown({
      displayName: 'rangeDateFirstPublished',
      description: 'Specify publication date range',
      required: true,
      options: {
        options: [
          { label: 'No date range specified', value: 'n'},
          { label: 'Past week', value: 'w' },
          { label: 'Past month', value: 'm' },
        ],
      },
      defaultValue: 'w'
    }),
    lang: myjvnCommon.lang,
    ft: myjvnCommon.ft,
  },
  async run(context) {
    await propsValidation.validateZod(context.propsValue, {
      startItem: z.number().min(1,'startItem (1 or greater)').optional(),
      maxCountItem: z.number().min(1).max(50,'maxCountItem (1 to 50)').optional(),
    });

    const {startItem, maxCountItem, cpeName, vendorId, 
      productId, keyword, severity, vector, rangeDatePublic, 
      rangeDatePublished, rangeDateFirstPublished, lang, ft} = context.propsValue;
    const payload = new URLSearchParams({
      method: 'getVulnOverviewList',
      feed: 'hnd',
    });

    if (startItem) payload.append('startItem', startItem.toString());
    if (maxCountItem) payload.append('maxCountItem', maxCountItem.toString());
    if (cpeName && cpeName.length > 0) payload.append('cpeName', cpeName.join('+'));
    if (vendorId && vendorId.length > 0) payload.append('vendorId', vendorId.join('+'));
    if (productId && productId.length > 0) payload.append('productId', productId.join('+'));
    if (keyword) payload.append('keyword', keyword);
    if (severity) payload.append('severity', severity);
    if (vector) payload.append('vector', vector);
    if (rangeDatePublic) payload.append('rangeDatePublic', rangeDatePublic);
    if (rangeDatePublished) payload.append('rangeDatePublished', rangeDatePublished);
    if (rangeDateFirstPublished) payload.append('rangeDateFirstPublished', rangeDateFirstPublished);
    if (lang) payload.append('lang', lang); 

    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      url: myjvnCommon.baseUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });
    if (ft === 'json') {
      const parser = new Parser({explicitArray: false});
      const jsonData = await parser.parseStringPromise(res.body);
      return jsonData;
    } else {
      return res.body;
    }
  },
});
