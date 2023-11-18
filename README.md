# Factory reporting docx exporter

A browser javascript rewrite of the [original python exporter](https://github.com/Disfactory/Disfactory/blob/caeac2bc710d8786e8abdf2eb2b9af77ec0bed94/backend/api/admin/actions/export_docx.py)

## Development

```bash
pnpm install
pnpm dev
```

Click the download button will generate a docx file with sample data inside [`main.js`](https://github.com/Disfactory/docx-exporter-js/blob/main/main.js)

## Build

```bash
pnpm build
```

This will generate a `dist` folder with `export-word-docx.js` inside. Copy the file to your project and include it with script tag.

## Usage

```html
<script src="export-word-docx.js"></script>
```

And the `exportWordDocx` function will be available in the global scope.

```js
const exampleData = [
{
  sender: 'XXX',
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

await window.exportWordDocx(exampleData);
```

## License

MIT
