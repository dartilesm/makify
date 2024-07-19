import {
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { TrashIcon } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";

const enum DOCUMENT_SWITCHER_TAB {
  LINK = "link",
  IMPORT = "import",
}

type FileMetadata = {
  fileName: string;
  title: string;
  numPages: number;
  size: {
    kb: number;
    mb: number;
  };
};

export function NewDocumentDialogContent() {
  const [fileAttached, setFileAttached] = useState<FileMetadata | null>(null);
  const [tab, setTab] = useState<DOCUMENT_SWITCHER_TAB | string>(
    DOCUMENT_SWITCHER_TAB.LINK,
  );

  const { register } = useFormContext();

  function handleRemoveFile() {
    setFileAttached(null);
  }

  function handleTabChange(value: DOCUMENT_SWITCHER_TAB | string) {
    setTab(value);
  }

  const onDrop = useCallback((acceptedFiles) => {
    const [file] = acceptedFiles;

    const { name: fileName } = file;
    const fileExtension = fileName.split(".").pop();
    const size = file.size;
    const sizeInKB = +(size / 1024).toFixed(2);
    const sizeInMB = +(sizeInKB / 1024).toFixed(2);

    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = async () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;

      const pdfDoc = await PDFDocument.load(binaryStr as ArrayBuffer, {
        updateMetadata: false,
        ignoreEncryption: true,
      });

      const title = pdfDoc.getTitle() || "";
      const numPages = pdfDoc.getPageCount();

      setFileAttached({
        fileName,
        title,
        numPages,
        size: {
          kb: sizeInKB,
          mb: sizeInMB,
        },
      });
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Tabs defaultValue={tab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value={DOCUMENT_SWITCHER_TAB.LINK}>
          Import from link
        </TabsTrigger>
        <TabsTrigger value={DOCUMENT_SWITCHER_TAB.IMPORT}>
          From your computer
        </TabsTrigger>
      </TabsList>
      <TabsContent value={DOCUMENT_SWITCHER_TAB.LINK}>
        <div className="h-48 space-y-4 py-2">
          <Label className="flex flex-col gap-2">
            Link to your pdf *
            <p className="text-muted-foreground text-sm">
              Make sure the link ends with .pdf, otherwise, download the
              document and upload it manually.
            </p>
            <Input
              placeholder="https://mydomain.com/how-many-cups-did-argentina-win.pdf"
              {...register("pdf-link", {
                required: tab === DOCUMENT_SWITCHER_TAB.LINK,
              })}
            />
          </Label>
        </div>
      </TabsContent>
      <TabsContent value={DOCUMENT_SWITCHER_TAB.IMPORT}>
        <div className="h-48 space-y-4 py-2">
          {!fileAttached && (
            <Label
              className="flex h-full flex-col gap-2"
              htmlFor="file-uploader"
            >
              Upload your pdf *
              <div
                className={cn(
                  "flex flex-1 shrink-0 items-center justify-center rounded-md border border-dashed",
                  {
                    "cursor-pointer": !fileAttached,
                  },
                )}
                {...getRootProps()}
              >
                <div
                  className={cn(
                    "flex max-w-[420px] flex-col items-center justify-center px-4 text-center",
                    {
                      "w-full": fileAttached,
                    },
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="text-muted-foreground h-10 w-10"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M10 9H8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                  </svg>

                  <h3 className="mt-4 text-lg font-semibold">
                    Drag 'n' drop or click to select
                  </h3>
                  <p className="text-muted-foreground mb-4 mt-2 text-sm">
                    Only .pdf up to 5 pages and 50MB are supported.
                  </p>
                </div>
              </div>
            </Label>
          )}
          {fileAttached && (
            <div className="flex h-full flex-col gap-2">
              Upload your pdf *
              <div className="z-10 flex flex-row items-center justify-between gap-2 rounded-md border-2 border-gray-100 p-4">
                <div className="flex shrink flex-row items-center gap-2 truncate">
                  <div className="flex flex-col gap-1 truncate text-left">
                    <span className="truncate">{fileAttached?.fileName}</span>
                    <div className="flex flex-row gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {fileAttached?.numPages} page
                        {fileAttached?.numPages > 1 ? "s" : ""}{" "}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {fileAttached?.size.mb > 1
                          ? `${fileAttached?.size.mb} MB`
                          : `${fileAttached?.size.kb} KB`}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  className="ml-auto flex shrink-0 gap-2"
                  variant="outline"
                  size="default"
                  onClick={handleRemoveFile}
                >
                  <span>Remove file</span>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          <input
            type="file"
            id="file-uploader"
            accept="application/pdf"
            {...getInputProps()}
            {...register("pdf-file", {
              required: tab === DOCUMENT_SWITCHER_TAB.IMPORT,
            })}
            multiple={false}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
