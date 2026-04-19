import { BiCheckCircle, BiSearch } from 'react-icons/bi'
import { motion } from 'motion/react';

export interface filterItem {
    officeCode: string,
    year: any,
    propno: any
}

interface IOptions {
    filterData: filterItem
}

const FieldSelectorErrorMsg = (props: IOptions) => {
    const { filterData } = props;

    return (
        <div>
            <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-20 px-6 text-center"
            >
                <div className="bg-slate-100 dark:bg-gray-800 p-6 rounded-full mb-6">
                    <BiSearch className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-gray-400 mb-2">Select a Proposal No</h3>
                <p className="text-slate-500 max-w-sm font-medium">
                    Please complete the selection above to view the associated documents for the proposal.
                </p>

                <div className="mt-8 flex gap-3">
                    <div className={`p-2 rounded-lg flex items-center gap-2 border transition-all ${filterData.officeCode ? 'bg-green-50 border-green-100 text-green-700' : 'bg-slate-50 dark:bg-gray-900 dark:border-gray-800 border-slate-100 text-slate-400'}`}>
                        <BiCheckCircle className={`w-4 h-4 ${filterData.officeCode ? 'text-green-600' : 'text-slate-300'}`} />
                        <span className="text-xs font-bold ">Office Code</span>
                    </div>
                    <div className={`p-2 rounded-lg flex items-center gap-2 border transition-all ${filterData.year ? 'bg-green-50 border-green-100 text-green-700' : 'bg-slate-50 dark:bg-gray-900 dark:border-gray-800 border-slate-100 text-slate-400'}`}>
                        <BiCheckCircle className={`w-4 h-4 ${filterData.year ? 'text-green-600' : 'text-slate-300'}`} />
                        <span className="text-xs font-bold ">Year</span>
                    </div>
                    <div className={`p-2 rounded-lg flex items-center gap-2 border transition-all ${filterData.propno ? 'bg-green-50 border-green-100 text-green-700' : 'bg-slate-50 dark:bg-gray-900 dark:border-gray-800 border-slate-100 text-slate-400'}`}>
                        <BiCheckCircle className={`w-4 h-4 ${filterData.propno ? 'text-green-600' : 'text-slate-300'}`} />
                        <span className="text-xs font-bold">Proposal No</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default FieldSelectorErrorMsg
