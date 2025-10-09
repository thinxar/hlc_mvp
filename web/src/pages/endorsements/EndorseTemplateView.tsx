import { Button, ScrollArea } from "@mantine/core";
import React, { useRef, useState } from "react";
import { MdDone, MdOutlinePreview } from "react-icons/md";
import { ErrorDisplay } from "./EmptyTemplateMsg";
import { templateMap } from "./TemplateMapper";
import { IoMdCreate } from "react-icons/io";
import { formatRFCDate } from "utils/FormateDate";
import { useFormstore } from "wire/StoreFactory";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { handleError } from "wire/ErrorHandler";
import { Toast } from "wire/errorToast";
import { StringFormat, topic } from '@palmyralabs/ts-utils';

interface Props {
  endorsementTitle: string;
  policyData: any
  onClose: any
}

const normalize = (str: string) => str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
const EndorseTemplateView: React.FC<Props> = ({ endorsementTitle, policyData, onClose }: any) => {
  const initialFormData = { currDate: formatRFCDate(new Date()), polNumber: policyData?.policyNumber };

  const formRef = useRef<any>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const normalizedTitle = normalize(endorsementTitle);

  const endorseCreateEndPoint = StringFormat(ServiceEndpoint.policy.endorseCreateApi, {
    policyId: policyData?.id
  });

  const code = Object.keys(templateMap).find((key) => {
    return normalizedTitle.includes(normalize(key));
  });

  const endorseText = endorsementTitle == '' ? '--' : endorsementTitle;
  if (!code) {
    return <ErrorDisplay endorsementTitle={endorseText} type="invalid" />;
  }

  const templateEntry = templateMap[code];
  if (!templateEntry) return <ErrorDisplay code={code} type="notfound" />;

  const EditorComponent = templateEntry.editor;
  const ViewerComponent = templateEntry.viewer;

  const handleSave = () => {
    if (formRef.current && formRef.current.getData) {
      const formData = formRef?.current?.getData();
      const req = {
        endorsementSubType: endorsementTitle,
        formData: formData
      }
      useFormstore(endorseCreateEndPoint).post(req).then((_d) => {
        topic.publish("fileUpload", "fileUpload");
        onClose();
        Toast.onSaveSuccess("Endorsement Save Successfully.")
      }).catch(handleError)
      setFormData(formData)
      // localStorage.setItem(`formData_${code}`, JSON.stringify(formData));
    } else {
      console.warn("⚠️ No form data available or ref not set.");
    }
  };

  const handleTogglePreview = () => {
    const formData = formRef?.current?.getData();
    setFormData(formData)
    setIsPreview(!isPreview);
  };

  return <div>
    <ScrollArea className="flex-1 overflow-y-auto p-2">
      <div className="form-container flex items-center justify-center bg-white text-blue-700  text-justify template-sec">
        <div className="border-double border-4 border-blue-800 p-3 ">
          {!isPreview ? (
            <EditorComponent formRef={formRef} formData={formData} />
          ) : ViewerComponent ? (
            <ViewerComponent formRef={formRef} formData={formData} />
          ) : (
            <div className="text-gray-500 italic">No viewer available</div>
          )}
        </div>
      </div>
    </ScrollArea>
    <div className="sticky bottom-0 py-2 bg-gray-100 flex justify-center mt-4 gap-2">
      <Button
        className="filled-button text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-semibold"
        onClick={handleTogglePreview}
        leftSection={
          isPreview ? (
            <IoMdCreate className="text-sm" />
          ) : (
            <MdOutlinePreview className="text-sm" />
          )
        }
      >
        {isPreview ? "Back to Edit" : "Preview Mode"}
      </Button>

      <Button
        className="filled-button text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-semibold"
        leftSection={<MdDone className="text-sm" />} onClick={handleSave}
      >
        Save
      </Button>
    </div>
  </div>;
};

export { EndorseTemplateView };