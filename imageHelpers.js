/**
 * @param {string} url
 * @return {Promise<{
 *  base64: string,
 *  dimension: {
 *  width: number,
 *  height: number,
 * }
 * }>}
 */
export async function fetchImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest();
    xhr.onload = function () {
      const reader = new window.FileReader();

      reader.onloadend = async function () {
        const base64 = reader.result.replace('data:image/jpeg;base64,', '');

        const dimension = await new Promise((resolve, reject) => {
          // read image dimensions
          const img = new window.Image();
          img.src = url;
          img.onload = function () {
            resolve({ width: img.width, height: img.height });
          };
          img.onerror = function () {
            reject(new Error('Error fetching image dimensions.'));
          };
        });

        resolve({
          base64,
          dimension,
        });
      };

      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = function () {
      reject(new Error('Error fetching image.'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', url);
    xhr.send();
  });
}

export async function fetchImageAsUint8Array(url) {
  return new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest();
    xhr.onload = function () {
      const reader = new window.FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(xhr.response);
    };
    xhr.onerror = function () {
      reject(new Error('Error fetching image.'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', url);
    xhr.send();
  });
}
