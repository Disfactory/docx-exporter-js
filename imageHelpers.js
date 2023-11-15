export async function fetchImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest();
    xhr.onload = function () {
      const reader = new window.FileReader();
      reader.onloadend = function () {
        // truncate 'data:image/jpeg;base64,' from the start of the base64 string
        const base64 = reader.result.replace('data:image/jpeg;base64,', '');
        resolve(base64);

        // resolve(reader.result);
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
