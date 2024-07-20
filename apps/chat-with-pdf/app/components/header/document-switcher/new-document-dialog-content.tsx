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
import { RefObject, useEffect, useState } from "react";
import { DropzoneInputProps, useDropzone } from "react-dropzone";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
  useWatch,
} from "react-hook-form";

const enum DOCUMENT_SWITCHER_TAB {
  LINK = "link",
  IMPORT = "import",
}

const enum INPUT_NAME {
  LINK = "pdf-link",
  FILE = "pdf-file",
}

type FileAttached = {
  file: File;
  metadata: {
    fileName: string;
    title: string;
    numPages: number;
    size: {
      kb: number;
      mb: number;
    };
  };
};

export function NewDocumentDialogContent() {
  const [fileAttached, setFileAttached] = useState<FileAttached | null>(null);
  const [tab, setTab] = useState<DOCUMENT_SWITCHER_TAB | string>(
    DOCUMENT_SWITCHER_TAB.LINK,
  );

  useEffect(handleInputFileValueChange, [fileAttached, tab]);

  const {
    register,
    setValue: setInputValue,
    trigger: triggerInputValidation,
    control,
    formState,
  } = useFormContext();

  const inputFile = useWatch({ name: INPUT_NAME.FILE });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: loadFile,
    maxFiles: 1,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  function handleRemoveFile() {
    setFileAttached(null);
    triggerInputValidation(INPUT_NAME.FILE as string);
    console.log("triggered validation");
  }

  function handleInputFileValueChange() {
    const isOnImportTab = tab === DOCUMENT_SWITCHER_TAB.IMPORT;
    const fileData = isOnImportTab ? fileAttached?.file : undefined;

    // Set the value of the input depending on the tab and validate
    setInputValue(INPUT_NAME.FILE as string, fileData, {
      shouldValidate: true,
    });
  }

  function handleTabChange(value: DOCUMENT_SWITCHER_TAB | string) {
    setTab(value);
  }

  function loadFile(acceptedFiles: File[]) {
    const [file] = acceptedFiles;
    if (!file) return false;

    const { name: fileName } = file;
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
        file,
        metadata: {
          fileName,
          title,
          numPages,
          size: {
            kb: sizeInKB,
            mb: sizeInMB,
          },
        },
      });
    };
    reader.readAsArrayBuffer(file);
  }

  function validateFile(fileData: FileAttached) {
    console.log("validating file", fileData);
    const MAX_FILE_SIZE = 40 * 1024 * 1024; // 40MB
    const MAX_PAGES = 5; // 5 pages

    const sizeInMB = fileData?.metadata?.size.mb;
    const numPages = fileData?.metadata?.numPages;

    if (sizeInMB > MAX_FILE_SIZE) {
      return `File size exceeds the limit of 40MB. Current size is ${sizeInMB}MB`;
    }

    if (numPages > MAX_PAGES) {
      return `File pages exceeds the limit of 5 pages. Current pages are ${numPages}`;
    }

    return true;
  }

  function getMergedInputProps(
    reactHookFormInputProps: ControllerRenderProps<
      FieldValues,
      INPUT_NAME.FILE
    >,
    reactDropzoneInputProps: DropzoneInputProps & {
      ref: RefObject<HTMLInputElement>;
    },
  ) {
    const {
      ref: rdInputRef,
      onChange: rdOnChange,
      ...rdInputProps
    } = reactDropzoneInputProps;

    const {
      value,
      ref: rhfInputRef,
      onChange: rhfOnChange,
      ...field
    } = reactHookFormInputProps;

    const mergedInputProps: JSX.IntrinsicElements["input"] = {
      ...rdInputProps,
      ...field,
      value: value?.fileName,
      ref: (el) => {
        (rdInputRef.current as HTMLInputElement | null) = el;
        rhfInputRef(el);
      },
      onChange: (event) => {
        if (rdOnChange) rdOnChange(event);
        rhfOnChange(event);
      },
      id: "file-uploader",
    };

    return mergedInputProps;
  }

  console.log({
    currentTab: tab,
    fileAttached,
    inputValues: {
      file: inputFile,
    },
    formState,
  });

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
              {...register(INPUT_NAME.LINK, {
                required: tab === DOCUMENT_SWITCHER_TAB.LINK,
                disabled: tab !== DOCUMENT_SWITCHER_TAB.LINK,
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
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                    <span className="truncate">
                      {fileAttached?.metadata?.fileName}
                    </span>
                    <div className="flex flex-row gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {fileAttached?.metadata?.numPages} page
                        {fileAttached?.metadata?.numPages > 1 ? "s" : ""}{" "}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {fileAttached?.metadata?.size.mb > 1
                          ? `${fileAttached?.metadata?.size.mb} MB`
                          : `${fileAttached?.metadata?.size.kb} KB`}
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
          <Controller
            control={control}
            name={INPUT_NAME.FILE}
            disabled={tab !== DOCUMENT_SWITCHER_TAB.IMPORT}
            rules={{
              required: true,
              validate: validateFile,
              shouldUnregister: true,
            }}
            render={({ field }) => (
              <input {...getMergedInputProps(field, getInputProps())} />
            )}
          ></Controller>
        </div>
      </TabsContent>
    </Tabs>
  );
}
