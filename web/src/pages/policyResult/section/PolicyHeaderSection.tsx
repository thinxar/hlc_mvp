import { Menu, Modal, ScrollArea, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { useEffect, useState } from "react";
import { IoAddCircle, IoClose } from "react-icons/io5";
import { LiaStampSolid } from "react-icons/lia";
import { MdHistory } from "react-icons/md";
import { EndorseTemplatePicker } from "src/pages/endorsements/EndorseTemplatePicker";
import { EndorsementSummaryGrid } from "src/pages/endorsements/history/EndorsementSummaryGrid";
import { handleKeyAction } from "utils/FormateDate";
import { useFormstore } from "wire/StoreFactory";

interface IOptions {
    data: any,
    selectedStamp: any,
    id: number,
    stampData: any,
    setSelectedFile: any,
    file: any,
    fildata?: any,
    setStampDataArr?: any,
    stampDataArr: any
}
const PolicyHeaderSection = (props: IOptions) => {
    const { data, selectedStamp, stampData, setSelectedFile, file, id, fildata, setStampDataArr, stampDataArr } = props;
    const [firstOpened, firstHandlers] = useDisclosure(false);
    const [secondOpened, secondHandlers] = useDisclosure(false);
    const [stampCategory, setStampCategory] = useState<any>()
    const stampEndPoint = ServiceEndpoint.policy.stamp.lookup
    const handleStampChange = (d?: any) => {
        selectedStamp(d)
        if (d) {
            setStampDataArr((prev: any) => {
                return [...(prev || []), { ...d }];
            });
        }
    }

    useEffect(() => {
        useFormstore(stampEndPoint, {}).query({ limit: -1 }).then((res: any) => {
            setStampCategory(res?.result)
        }).catch((err) => console.log(err)
        )
    }, [])
  
    const stampDisable = (id == null || isNaN(Number(id)));
    return (
        <div>
            <div className="relative p-1 flex justify-between items-center border-b border-indigo-100">
                <div>
                </div>
                <div className='flex items-center gap-4 p-1'>
                    <Tooltip label='Stamp Category'>
                        <span><Menu shadow="md" width={200}>
                            <Menu.Target>
                                {/* <button disabled={stampDisable}
                                    className='cursor-pointer px-2 py-1.5 flex items-center gap-2 bg-linear-to-r 
                                    pr-bgcolor text-white font-semibold rounded-lg shadow-md hover:shadow-lg 
                                   transform hover:scale-101 transition-all duration-200 ease-out'
                                >
                                    <LiaStampSolid fontSize={26} /></button> */}
                                <button
                                    disabled={stampDisable}
                                    className={`px-2 py-1.5 flex items-center gap-2 font-semibold rounded-lg shadow-md 
                                         transition-all duration-200 ease-out
                                      ${stampDisable
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-linear-to-r pr-bgcolor text-white hover:shadow-lg hover:scale-101 cursor-pointer"
                                        }
                                    `}
                                >
                                    <LiaStampSolid fontSize={26} />
                                </button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <ScrollArea style={{ height: 300 }} >
                                    {
                                        stampCategory?.map((e: any, i: any) => {
                                            return <Menu.Item
                                                key={i}
                                                onClick={() => handleStampChange(e)}
                                                disabled={stampDataArr?.some((x: any) => x.code === e.code)}>
                                                {e?.name}
                                            </Menu.Item>
                                        })
                                    }
                                </ScrollArea>
                            </Menu.Dropdown>
                        </Menu></span>
                    </Tooltip>
                    <button
                        className='cursor-pointer px-2 py-1.5 flex items-center gap-2 bg-linear-to-r pr-bgcolor text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-101 transition-all duration-200 ease-out'
                        onClick={secondHandlers.open}>
                        <MdHistory fontSize={22} className='' />
                        Endorsement Summary
                    </button>
                    <button
                        className='cursor-pointer px-2 py-1.5 flex items-center gap-2 bg-linear-to-r pr-bgcolor text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-101 transition-all duration-200 ease-out'
                        onClick={firstHandlers.open}>
                        <IoAddCircle fontSize={22} className='' />
                        Create Endorsement
                    </button>
                    <button
                        className='cursor-pointer p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 transform hover:rotate-90'
                        onClick={() => window.history.back()}>
                        <IoClose fontSize={22} className='text-gray-600' />
                    </button>
                </div>
            </div >

            <Modal opened={firstOpened} onClose={firstHandlers.close} onKeyDown={handleKeyAction("Escape", firstHandlers.close)}
                centered size={"lg"} title={`Endorsement`} >
                <EndorseTemplatePicker data={data} />
            </Modal>

            <Modal opened={secondOpened} onClose={secondHandlers.close} onKeyDown={handleKeyAction("Escape", secondHandlers.close)}
                centered size={"xl"} title={`Endorsement Summary`} >
                <EndorsementSummaryGrid data={data} stampData={stampData} setSelectedFile={setSelectedFile} file={file} id={id} fildata={fildata} />
            </Modal>
        </div >
    )
}

export { PolicyHeaderSection };

