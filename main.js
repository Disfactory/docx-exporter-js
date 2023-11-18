import { exportDocx } from './export';

document.querySelector('#download').addEventListener('click', async () => {
  const docsData = [
    {
      sender: '賴沛蓮',
      serialNumber: '00000000',
      location: '台北市中山區中山北路一段',
      legislator: 'XXX',
      townName: '台北市中山區',
      imageUrls: [
        // 'https://i.imgur.com/taKOy2v.png',
        // 'https://i.imgur.com/LrUki4U.jpg',
      ],
    },
  ];

  await exportDocx(docsData);

  console.log('done');
});
