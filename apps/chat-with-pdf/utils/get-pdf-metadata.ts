import { PDFDocument } from "pdf-lib";

type GetPdfMetadataProps = {
  documentFile?: File;
  documentUrl?: string;
};

export async function getPdfData({
  documentFile,
  documentUrl,
}: GetPdfMetadataProps) {
  if (!documentFile && !documentUrl) return null;

  let fileFetchResponse = null;

  fileFetchResponse = documentUrl
    ? await fetch(documentUrl)
    : fileFetchResponse;

  const pdfFile = fileFetchResponse
    ? await fileFetchResponse?.blob()
    : (documentFile as File);
  const pdfBytes = await pdfFile.arrayBuffer();

  const pdfDoc = await PDFDocument.load(pdfBytes, {
    updateMetadata: false,
    ignoreEncryption: true,
  });

  const title = pdfDoc.getTitle() || "Untitled";
  const numPages = pdfDoc.getPageCount();
  const size = pdfFile.size;
  const sizeInKB = +(size / 1024).toFixed(2);
  const sizeInMB = +(sizeInKB / 1024).toFixed(2);

  const metadata = {
    title,
    numPages,
    size: {
      kb: sizeInKB,
      mb: sizeInMB,
    },
  };

  const pdfData = {
    metadata,
    pdfBlob: pdfFile,
  };

  return pdfData;
}

async function getPdfDataFromLink(documentUrl: string) {
  const response = await fetch(documentUrl);
  const pdfBlob = await response.blob();
  const pdfBytes = await pdfBlob.arrayBuffer();

  const pdfDoc = await PDFDocument.load(pdfBytes, {
    updateMetadata: false,
    ignoreEncryption: true,
  });

  const title = pdfDoc.getTitle() || "Untitled";
  const numPages = pdfDoc.getPageCount();
  const size = pdfBlob.size;
  const sizeInKB = +(size / 1024).toFixed(2);
  const sizeInMB = +(sizeInKB / 1024).toFixed(2);

  const metadata = {
    title,
    numPages,
    size: {
      kb: sizeInKB,
      mb: sizeInMB,
    },
  };

  const pdfData = {
    metadata,
    pdfBlob,
  };

  return pdfData;
}

async function getPdfDataFromFile(file: File) {
  file.arrayBuffer();
  const reader = new FileReader();

  reader.onabort = () => console.log("file reading was aborted");
  reader.onerror = () => console.log("file reading has failed");

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const binaryStr = reader.result;

      const pdfDoc = await PDFDocument.load(binaryStr as ArrayBuffer, {
        updateMetadata: false,
        ignoreEncryption: true,
      });

      const title = pdfDoc.getTitle() || "Untitled";
      const numPages = pdfDoc.getPageCount();
      const fileName = file.name;
      const size = file.size;
      const sizeInKB = +(size / 1024).toFixed(2);
      const sizeInMB = +(sizeInKB / 1024).toFixed(2);

      const metadata = {
        fileName,
        title,
        numPages,
        size: {
          kb: sizeInKB,
          mb: sizeInMB,
        },
      };

      const pdfData = {
        metadata,
        pdfBlob: file,
      };

      resolve(pdfData);
    };

    reader.readAsArrayBuffer(file);
  });
}
