import { Html5Qrcode } from 'html5-qrcode';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      html5Qrcode: () => new Html5Qrcode('reader'), // 'reader' là ID của phần tử HTML
    },
  };
});