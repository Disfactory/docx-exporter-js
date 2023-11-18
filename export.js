import { generate } from './docxGenerator.js';
import { saveAs } from 'file-saver';
import * as docx from 'docx';

/**
 * @param {{
 *   sender: string,
 *   serialNumber: string,
 *   location: string,
 *   legislator: string,
 *   townName: string,
 *   imageUrls: string[],
 * }[]} docsData
 */
export async function exportDocx(docsData) {
  const doc = await generate(docsData);

  docx.Packer.toBlob(doc).then(async (blob) => {
    console.log(blob);

    const filename = `${new Date().toISOString()}.docx`;
    saveAs(blob, filename);

    console.log('Document created successfully');
  });
}
