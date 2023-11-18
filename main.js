import { generate } from './docxGenerator.js';
import { saveAs } from 'file-saver';
import * as docx from 'docx';

document.querySelector('#download').addEventListener('click', async () => {
  const docsData = [
    {
      sender: '賴沛蓮',
      serialNumber: '00000000',
      location: '台北市中山區中山北路一段',
      legislator: 'XXX',
      townName: '台北市中山區',
      imageUrls: [
        'https://i.imgur.com/taKOy2v.png',
        'https://i.imgur.com/LrUki4U.jpg',
      ],
    },
  ];
  const doc = await generate(docsData);

  console.log(doc);

  docx.Packer.toBlob(doc).then(async (blob) => {
    console.log(blob);

    const filename = `${new Date().toISOString()}.docx`;
    saveAs(blob, filename);

    console.log('Document created successfully');
  });
});
