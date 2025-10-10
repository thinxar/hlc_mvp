import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IoAddCircle, IoClose } from "react-icons/io5"
import { MdHistory } from "react-icons/md";
import { EndorseTemplatePicker } from "src/pages/endorsements/EndorseTemplatePicker";
import { EndorsementHistoryGrid } from "src/pages/endorsements/history/EndorsementHistoryGrid";
import { handleKeyAction } from "utils/FormateDate";

interface IOptions {
    data: any
}
const PolicyHeaderSection = (props: IOptions) => {
    const { data } = props;
    // const [historyOpened, { open: openHistory, close: closeHistory }] = useDisclosure(false);
    // const [opened, { open, close }] = useDisclosure(false);
    const [firstOpened, firstHandlers] = useDisclosure(false);
    const [secondOpened, secondHandlers] = useDisclosure(false);

    return (
        <div>
            <div className="relative p-1 flex justify-between items-center border-b-1 border-indigo-100">
                <div></div>
                <div className='flex items-center gap-4'>
                    <button
                        className='cursor-pointer px-2 py-1.5 flex items-center gap-2 bg-gradient-to-r pr-bgcolor text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-101 transition-all duration-200 ease-out'
                        onClick={secondHandlers.open}>
                        <MdHistory fontSize={22} className='' />
                        Endorsement Summary
                    </button>
                    <button
                        className='cursor-pointer px-2 py-1.5 flex items-center gap-2 bg-gradient-to-r pr-bgcolor text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-101 transition-all duration-200 ease-out'
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
            </div>

            <Modal opened={firstOpened} onClose={firstHandlers.close} onKeyDown={handleKeyAction("Escape", firstHandlers.close)}
                centered size={"lg"} title={`Endorsement`} >
                <EndorseTemplatePicker data={data} />
            </Modal>

            <Modal opened={secondOpened} onClose={secondHandlers.close} onKeyDown={handleKeyAction("Escape", secondHandlers.close)}
                centered size={"lg"} title={`Endorsement Summary`} >
                <EndorsementHistoryGrid />
            </Modal>
        </div>
    )
}

export { PolicyHeaderSection }

