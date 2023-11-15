import * as docx from 'docx';
import { fetchImageAsBase64 } from './imageHelpers'; // Placeholder for image fetching helper function

// Helper Functions
function createParagraphWithText(text, styleId) {
  return new docx.Paragraph({
    children: [
      new docx.TextRun({
        text,
        style: styleId,
      }),
    ],
  });
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
    creator: 'Your Creator Name',
    title: 'Your Document Title',
    description: 'Your Document Description',
    styles: {
      default: {},
      paragraphStyles: [],
    },
    sections: [
      {
        children: [
          createParagraphWithText('Hello World', 'myWonkyStyle'),
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
