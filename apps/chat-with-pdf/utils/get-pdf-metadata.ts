import { PDFDocument } from "pdf-lib";

type GetPdfMetadataProps = {
  file?: File;
  link?: string;
};

export async function getPdfData({ file, link }: GetPdfMetadataProps) {
  if (!file && !link) return null;

  if (link) return getPdfDataFromLink(link);
}

async function getPdfDataFromLink(link: string) {
  const response = await fetch(link);
  const pdfBlob = await response.blob();
  const pdfBytes = await pdfBlob.arrayBuffer();

  const pdfDoc = await PDFDocument.load(pdfBytes);

  const title = pdfDoc.getTitle();
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
