import * as docx from 'docx';
import { fetchImageAsBase64 } from './imageHelpers'; // Placeholder for image fetching helper function

const sealImageUrl =
  'https://raw.githubusercontent.com/Disfactory/Disfactory/master/backend/doc_resources/seal.png';

const lowerCaseNumber = '〇一二三四五六七八九';
const toLowerCaseNumber = (number) => lowerCaseNumber[number];

const STAFF_EMAIL = {
  賴沛蓮: 'peii@cet-taiwan.org',
};
function getSenderParagraphs(sender = '賴沛蓮') {
  const email = STAFF_EMAIL[sender] || 'cet@cet-taiwan.org';

  const context = [
    '地址：10049台北市北平東路28號9樓之2',
    '電話：02-23920371',
    '傳真：02-23920381',
    `連絡人：${sender}`,
    `電子信箱：${email}`,
  ];

  return context.map(
    (text) =>
      new docx.Paragraph({
        spacing: {
          line: 10,
        },
        children: [
          new docx.TextRun({
            text,
            size: 10,
          }),
        ],
        alignment: docx.AlignmentType.RIGHT,
      }),
  );
}

function getReceiverParagraphs(serealNumber = '00000000') {
  const taipeiDateString = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Taipei',
  });

  const [month, day, year] = taipeiDateString.split('/');
  const twYear = parseInt(year, 10) - 1911;

  const context = [
    '',
    '受文者：如正、副本行文單位',
    `發文日期：中華民國${twYear}年${month}月${day}日`,
    `發文字號：地球公民違字第 ${serealNumber} 號`,
    '速別：普通件',
    '附件：舉證照片',
    '',
  ];

  return context.map(
    (text) =>
      new docx.Paragraph({
        spacing: {
          line: 10,
        },
        children: [
          new docx.TextRun({
            text,
            size: 10,
          }),
        ],
        alignment: docx.AlignmentType.LEFT,
      }),
  );
}

async function createImageParagraph(imageURL) {
  return fetchImageAsBase64(imageURL)
    .then((data) => {
      console.log(data.length);
      const paragraph = new docx.Paragraph({
        children: [
          new docx.ImageRun({
            data,
            transformation: {
              width: 100,
              height: 100,
            },
            altText: {
              title: 'Image Title',
              description: 'Image Description',
            },
          }),
        ],
      });

      console.log(paragraph);

      return paragraph;
    })
    .catch((err) => {
      console.log(err);
    });
}

// Main document generation function
export async function generate() {
  // Add images (placeholder function)
  // Note: Ensure fetchImageAsBase64 function handles asynchronous image fetching
  const paragraph = await createImageParagraph(
    'https://i.imgur.com/4cFtGFW.jpeg',
  );

  const doc = new docx.Document({
    // creator: 'Your Creator Name',
    // title: 'Your Document Title',
    // description: 'Your Document Description',
    styles: {
      default: {},
      paragraphStyles: [],
    },
    sections: [
      {
        children: [
          // original
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: '正本',
                size: 12,
              }),
            ],
            spacing: {
              line: 20,
            },
          }),

          // title
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: '地球公民基金會 函',
                size: 20,
              }),
            ],
            alignment: docx.AlignmentType.CENTER,
          }),

          // sender
          ...getSenderParagraphs(),

          // receiver
          ...getReceiverParagraphs('00000000'),

          paragraph,
        ],
      },
    ],
  });

  //
  // // Add a page break
  doc.addSection({
    children: [
      new docx.Paragraph({
        text: 'Start of a new page',
        pageBreakBefore: true,
      }),
    ],
  });

  return doc;
}
