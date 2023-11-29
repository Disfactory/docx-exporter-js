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
    '',
    '地址：10049台北市北平東路28號9樓之2',
    '電話：02-23920371',
    '傳真：02-23920381',
    `連絡人：${sender}`,
    `電子信箱：${email}`,
    '',
    '',
  ];

  return context.map(
    (text) =>
      new docx.Paragraph({
        style: 'Normal',
        spacing: {
          line: 240,
          lineRule: docx.LineRuleType.EXACT,
        },
        children: [
          new docx.TextRun({
            text,
            size: 20,
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
        style: 'Normal',
        spacing: {
          after: 150,
          line: 200,
        },
        children: [
          new docx.TextRun({
            text,
            size: 28,
          }),
        ],
        alignment: docx.AlignmentType.LEFT,
      }),
  );
}

function getSubjectParagraphs(location = '') {
  const context = [
    `主旨：舉報 ${location} 地號土地疑有違法新增鐵皮廠房情事。`,
    '',
    '說明：',
  ];

  return context.map(
    (text) =>
      new docx.Paragraph({
        style: 'Normal',
        spacing: {
          line: 420,
          after: 100,
          lineRule: docx.LineRuleType.EXACT,
        },
        children: [
          new docx.TextRun({
            text,
            size: 28,
          }),
        ],
        alignment: docx.AlignmentType.LEFT,
      }),
  );
}

function getContextParagraphs(location = '') {
  const context = [
    '一、　依工廠管理輔導法第28-1、28-12條辦理。',
    // eslint-disable-next-line no-irregular-whitespace
    `二、　${location} 地號土地新發現新增建鐵皮廠房情形，經地球公民基金會志工拍攝存證，如附件一。因懷疑係屬非法建築行為，函請貴府調查處理。若有不法情事，並應依法裁處，請貴府將查處情形，惠知本會。`,
  ];

  return context.map(
    (text) =>
      new docx.Paragraph({
        style: 'Normal',
        spacing: {
          line: 420,
          lineRule: docx.LineRuleType.EXACT,
        },
        children: [
          new docx.TextRun({
            text,
            size: 28,
          }),
        ],
        alignment: docx.AlignmentType.LEFT,
      }),
  );
}

function getCCParagraphs(legislator = 'XXX', _townName = null) {
  let townName;

  if (_townName) {
    townName = _townName
      .replace('臺灣省', '')
      .replace('台灣省', '')
      .slice(0, 3);
  } else {
    townName = 'UNKNOWN';
  }

  const context = [
    '',
    `正本：${townName}政府`,
    `副本：內政部、行政院農委會、經濟部工業局、經濟部中部辦公室、立法委員${legislator}國會辦公室`,
  ];

  return context.map(
    (text) =>
      new docx.Paragraph({
        style: 'Normal',
        spacing: {
          line: 360,
          lineRule: docx.LineRuleType.EXACT,
        },
        children: [
          new docx.TextRun({
            text,
            size: 24,
          }),
        ],
        alignment: docx.AlignmentType.LEFT,
      }),
  );
}

async function createAttachmentParagraphs(imageUrls) {
  /** @type {docx.Paragraph[]} */
  const imageParagraphs = await Promise.all(
    imageUrls.map((url) => {
      return createImageParagraph(url, docx.convertInchesToTwip(3));
    }),
  );

  const descriptionParagraphs = new Array(imageUrls.length)
    .fill(0)
    .map((_, index) => {
      return new docx.Paragraph({
        style: 'Normal',
        spacing: {
          line: 120,
        },
        children: [
          new docx.TextRun({
            text: `附件 ${toLowerCaseNumber(index + 1)}`,
            size: 24,
          }),
        ],
        alignment: docx.AlignmentType.LEFT,
      });
    });

  // one description paragraph for each image
  const mappedParagraphs = imageParagraphs
    .map((paragraph, index) => {
      return [descriptionParagraphs[index], paragraph];
    })
    .flat();

  return mappedParagraphs;
}

async function createImageParagraph(imageURL, _width, _height) {
  return fetchImageAsBase64(imageURL)
    .then((data) => {
      const {
        base64,
        dimension: { width, height },
      } = data;

      const ratio = width / height;

      // calculate image width and height base on given width and height
      // if one of them is not given, use the other one to calculate
      // if both are not given, use default width and height
      let transformWidth, transformHeight;
      if (!_width && !_height) {
        transformWidth = width;
        transformHeight = height;
      } else if (!_width) {
        transformHeight = _height;
        transformWidth = transformHeight * ratio;
      } else if (!_height) {
        transformWidth = _width;
        transformHeight = transformWidth / ratio;
      }

      console.log(transformWidth, transformHeight, width, height);

      const paragraph = new docx.Paragraph({
        style: 'Normal',
        children: [
          new docx.ImageRun({
            data: base64,
            transformation: {
              width: transformWidth,
              height: transformHeight,
            },
          }),
        ],
      });

      return paragraph;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function generateDocumentParagraphs({
  sender = '賴沛蓮',
  serialNumber = '00000000',
  location = '台北市中山區中山北路一段',
  legislator = 'XXX',
  townName = '台北市中山區',
  imageUrls = [],
}) {
  return [
    // original
    new docx.Paragraph({
      style: 'Normal',
      children: [
        new docx.TextRun({
          text: '正本',
        }),
      ],
      spacing: {
        after: 300,
      },
    }),

    // title
    new docx.Paragraph({
      style: 'Normal',
      children: [
        new docx.TextRun({
          text: '地球公民基金會 函',
          size: 40,
        }),
      ],
      spacing: {
        after: 300,
      },
      alignment: docx.AlignmentType.CENTER,
    }),

    // sender
    ...getSenderParagraphs(sender),

    // receiver
    ...getReceiverParagraphs(serialNumber),

    // subject
    ...getSubjectParagraphs(location),

    // context
    ...getContextParagraphs(location),

    // cc
    ...getCCParagraphs(legislator, townName),

    // seal
    await createImageParagraph(sealImageUrl, docx.convertInchesToTwip(4.5)),

    // attachments
    ...(await createAttachmentParagraphs(imageUrls)),
  ];
}

// Main document generation function
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
export async function generate(docsData) {
  const groupsOfParagraphs = await Promise.all(
    docsData.map(generateDocumentParagraphs),
  );

  // for each group of paragraphs, add a page break paragraph after it
  const breakParagraphs = groupsOfParagraphs.map(() => {
    return new docx.Paragraph({
      style: 'Normal',
      children: [
        new docx.TextRun({
          text: '',
        }),
      ],
      pageBreakBefore: true,
    });
  });

  const paragraphsWithBreaks = groupsOfParagraphs
    .map((paragraphs, index) => {
      return [...paragraphs, breakParagraphs[index]];
    })
    .flat();

  // remove the end page break
  paragraphsWithBreaks.pop();

  const doc = new docx.Document({
    // creator: 'Your Creator Name',
    // title: 'Your Document Title',
    // description: 'Your Document Description',
    styles: {
      default: {
        document: {
          run: {
            font: '標楷體',
            size: 12,
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: '標楷體',
            size: 24,
          },
        },
      ],
    },
    sections: [],
  });

  doc.addSection({
    properties: {
      type: docx.SectionType.NEXT_PAGE,
      page: {
        margin: {
          top: docx.convertInchesToTwip(1),
          right: docx.convertInchesToTwip(1),
          bottom: docx.convertInchesToTwip(1),
          left: docx.convertInchesToTwip(1),
        },
        size: {
          // A4
          width: docx.convertMillimetersToTwip(210),
          height: docx.convertMillimetersToTwip(297),
        },
      },
    },
    children: paragraphsWithBreaks,
  });

  return doc;
}
