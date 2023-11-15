import { generate } from './docxGenerator.js';
import { saveAs } from 'file-saver';
import * as docx from 'docx';

document.querySelector('#download').addEventListener('click', async () => {
  const doc = await generate();

  console.log(doc);

  docx.Packer.toBlob(doc).then(async (blob) => {
    console.log(blob);

    const filename = `${new Date().toISOString()}.docx`;
    saveAs(blob, filename);

    console.log('Document created successfully');
  });
});
