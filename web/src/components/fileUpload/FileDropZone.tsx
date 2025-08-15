import { Box, Button, Loader, Modal, Text } from '@mantine/core';
import { PalmyraNewForm } from '@palmyralabs/rt-forms';
import { StringFormat, topic } from '@palmyralabs/ts-utils';
import { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BiSolidCloudUpload } from 'react-icons/bi';
import { FaUpload } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import Image from '../../../public/images/image.png';
import Pdf from '../../../public/images/pdf.png';
import Tiff from '../../../public/images/tiff.png';
import './FileDropZone.css';
import { ServiceEndpoint } from 'config/ServiceEndpoint';
import { ServerLookup } from 'templates/mantineForm';
import { handleError } from 'wire/ErrorHandler';
import { useFormstore } from 'wire/StoreFactory';

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
        accept: { pdf: ['.pdf'], docx: ['.docx'], images: ['.jpg', '.jpeg', '.png'], 'image/tiff': ['.tiff', '.tif'] }
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
            } else if (fileExtension === "tiff") {
                return Tiff;
            } else if (["jpg", "jpeg", "png"].includes(fileExtension)) {
                return Image;
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
                <div className='flex items-center justify-between absolute top-0 w-full'>
                    <div></div>
                    <IoMdClose onClick={() => removeFile(file)} className='file-remove-icon' />
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
                    queryOptions={{ endPoint: ServiceEndpoint.lookup.docketType }} ref={lookupRef}
                    lookupOptions={{ idAttribute: 'id', labelAttribute: 'document' }} />
            </PalmyraNewForm>
            {fileList.length == 0 ? <section className="dropzone-container">
                <div className={"file-cards-container"}>
                    {/* {isBtnEnable && files} */}
                    <div {...getRootProps({ className: isBtnEnable ? 'dropzone' : ' dropzone dropzone-zero' })}>
                        <div className='dropzone-input-container'>
                            <input {...getInputProps()} />
                        </div>
                        <div className='text-center'>
                            <div>
                                <div className='flex justify-center'><BiSolidCloudUpload className='upload-icon' /></div>
                                <div className='text-xx file-text'>Drop file here</div>

                                <div className='text file-text'>OR</div>
                                <div className='text-xxx file-text'>
                                    Browse file</div>
                                <div className='text file-text'>
                                    <br />
                                    Supported format: {'PDF, TIFF , PNG , JPG, JPEG'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> : <div className='border-1 border-gray-200 p-3 rounded-xl flex items-center'>
                {isBtnEnable && files}
                <div></div>
            </div>}
            <div className='upload-img-btn-container'>
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