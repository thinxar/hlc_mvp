import { Box, Loader, Modal, Text } from '@mantine/core';
import { PalmyraNewForm } from '@palmyralabs/rt-forms';
import { StringFormat, topic } from '@palmyralabs/ts-utils';
import { ServiceEndpoint } from 'config/ServiceEndpoint';
import { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BiCloudUpload } from 'react-icons/bi';
import { FiTrash2, FiUpload } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { RiLoader2Fill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { ServerLookup } from 'templates/mantineForm';
import { handleError } from 'wire/ErrorHandler';
import { useFormstore } from 'wire/StoreFactory';
import Html from '../../../public/images/html.png';
import Image from '../../../public/images/image.png';
import Pdf from '../../../public/images/pdf.png';
import TextFile from '../../../public/images/text.png';
import Tiff from '../../../public/images/tiff.png';
import './FileDropZone.css';

interface IOptions {
    onClose?: any
    onSaveSuccess?: (data: any) => void;
    onSaveFailure?: any;
    policyId: any
}
const FileDropZone = (props: IOptions) => {
    const { onClose, onSaveSuccess, policyId } = props;
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [docketId, setDocketId] = useState(null);
    const lookupRef = useRef<any>(null)

    const endPoint = StringFormat(ServiceEndpoint.policy.fileUploadApi,
        { policyId: policyId, docketTypeId: docketId })

    const { getRootProps, getInputProps } = useDropzone({
        onDropRejected: (_fileRejections: any) => {
            toast.error(`Error.`);
        },
        onDrop: (acceptedFiles: any) => {
            const existingPaths = fileList.map((img: any) => img.key);

            const newFiles = acceptedFiles.filter((file: any) => {
                return !existingPaths.includes(file?.path);
            });

            if (newFiles.length > 0) {
                setFileList([acceptedFiles[0]]);
            }
        },
        multiple: false,
        accept: {
            pdf: ['.pdf'], docx: ['.docx'], html: ['.html', '.htm'], text: ['.txt'],
            images: ['.jpg', '.jpeg', '.png'], 'image/tiff': ['.tiff', '.tif']
        }
    });

    // useEffect(() => {
    //     setUploadedFile(fileList);
    // }, [fileList])

    const removeFile = (file: any) => {
        const updatedFiles = fileList.filter((f: any) => f.path !== file.path);
        setFileList(updatedFiles);
    }

    const files: any = fileList.map((file: any, index: any) => {
        const fileExtension = file.path.split(".").pop()?.toLowerCase();

        const getImage = () => {
            if (fileExtension === "pdf") {
                return Pdf;
            } else if (fileExtension === "tiff" || fileExtension === "tif") {
                return Tiff;
            } else if (["jpg", "jpeg", "png"].includes(fileExtension)) {
                return Image;
            } else if (fileExtension === "html") {
                return Html;
            } else if (fileExtension === "txt") {
                return TextFile;
            }
            return Image;
        };

        return (
            <div key={index} className={`w-[200px] shadow-md rounded-md border-1 border-gray-200 p-3 relative text-gray-100`}>
                <div className='flex justify-center items-center'>
                    <div className=''>
                        <img src={getImage()} alt={file.path.split("/").pop()} className='h-20' />
                    </div>
                </div>
                <div className='file-name text-sm p-2 text-center break-all'>{file.path.split("/").pop()}</div>
                <div className='flex items-center justify-between absolute top-2 right-1 w-full'>
                    <div></div>
                    <IoMdClose onClick={() => removeFile(file)} className='text-gray-800 cursor-pointer' />
                </div>
                <div className='file-name text-sm font-semibold text-center p-1'>
                    {file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(2)} KB`
                        : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                </div>
            </div>
        );
    });

    const onRefresh = () => {
        topic.publish('fileUpload', {});
    }

    const handleCancel = () => {
        setFileList([]);
    }

    const handleChange: any = (_val: string, data: any) => {
        if (_val)
            setDocketId(data.id)
        else setDocketId(null)
    }

    const handleUploadFile = () => {
        setLoading(true);
        const formData = new FormData();

        fileList.forEach((file: any) => {
            formData.append('file', file);
        });
        if (docketId) {
            useFormstore(endPoint, {}, '').post(formData).then((d: any) => {
                if (onSaveSuccess) {
                    onSaveSuccess(d);
                }
                setFileList([]);
                setLoading(true)
                onRefresh();
                onClose();
                topic.publish("fileUpload", "fileUpload");
                toast.success("File Uploaded Successfully!");
            }).catch((error: any) => {
                setLoading(false);
                handleError(error);
            }).finally(() => setLoading(false));
        }
        else {
            toast.error("Please select a docket type before uploading the file.");
            lookupRef?.current?.setError("This field is mandatory"),
                setLoading(false)
        }
    }

    const isBtnEnable = fileList.length > 0;

    return (
        <div>
            <PalmyraNewForm endPoint={''}>
                <ServerLookup attribute="docketType" required placeholder="Select Docket Type"
                    label={"Docket Type"} invalidMessage={"This field is mandatory"} onChange={handleChange}
                    queryOptions={{ endPoint: ServiceEndpoint.lookup.docketType }} initParams={{ limit: -1 }} ref={lookupRef}
                    lookupOptions={{ idAttribute: 'id', labelAttribute: 'document' }} />
            </PalmyraNewForm>
            {fileList.length == 0 ? <section className="dropzone-container">
                <div className={"file-cards-container"}>
                    {/* {isBtnEnable && files} */}
                    <div {...getRootProps({ className: isBtnEnable ? 'dropzone' : ' dropzone dropzone-zero' })}>
                        <div className='dropzone-input-container'>
                            <input {...getInputProps()} />
                        </div>
                        <div className={`flex flex-col items-center space-y-3`}>
                            <div className={`p-3 rounded-full bg-blue-100`}>
                                <BiCloudUpload className={`w-7 h-7 text-gray-500`} />
                            </div>
                            <div className="space-y-2 text-center">
                                <p className={`font-medium text-gray-900`}>
                                    Drop file here
                                    <p className={`text-sm text-gray-500`}>OR</p>
                                    <p className={` font-medium text-blue-900`}>
                                        Browse file
                                    </p>
                                    <div className={`text-sm space-y-1 text-gray-500`}>
                                        <p>Supported formats: {'PDF, TIFF , PNG , JPG, JPEG'}</p>
                                    </div>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section> : <div className='border-1 border-gray-200 p-3 rounded-xl flex items-center'>
                {isBtnEnable && files}
                <div></div>
            </div>}
            {/* <div className='upload-img-btn-container'>
                {isBtnEnable &&
                    <Button onClick={handleCancel}
                        className='filled-button'
                        leftSection={<IoMdClose className='button-icon' />}>
                        Remove
                    </Button>}
                <Button loading={loading} loaderProps={{ type: 'dots' }}
                    className={!isBtnEnable ? 'disabled-button' : 'filled-button'}
                    onClick={handleUploadFile}
                    disabled={!isBtnEnable}
                    leftSection={<FaUpload className='button-icon' />}>
                    Upload
                </Button>
            </div> */}
            <div className="flex justify-center gap-4 mt-6">
                {isBtnEnable && (
                    <button
                        onClick={handleCancel}
                        className={`cursor-pointer flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <FiTrash2 className="w-4 h-4" />
                        Remove All
                    </button>
                )}

                <button
                    onClick={handleUploadFile}
                    disabled={!isBtnEnable || loading}
                    className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${isBtnEnable && !loading
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                        : false
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {loading ? <RiLoader2Fill className="w-4 h-4 animate-spin" /> : <FiUpload className="w-4 h-4" />}
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
            <Modal opened={loading} onClose={() => { }} centered withCloseButton={false}
                transitionProps={{ transition: 'fade', duration: 200 }}>
                <div className="loading-modal">
                    <Loader size="lg" color="blue" type="bars" />
                    <Box style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Text size="lg" color="blue" fw={600}>
                            Your file is being uploaded...
                        </Text>
                        <Text size="sm" color="dimmed" mt="sm">
                            This might take a few moments. Please stay on this page.
                        </Text>
                    </Box>
                </div>
            </Modal>
        </div>
    );
}

export { FileDropZone };
