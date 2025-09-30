declare module 'qrcode' {
  namespace QRCode {
    function toDataURL(text: string, options?: unknown): Promise<string>;
  }
  export = QRCode;
}


