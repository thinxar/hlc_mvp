import { topic } from '@palmyralabs/ts-utils';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { filterItem } from './FieldSelectorErrorMsg';

interface IOptions {
    filterData: filterItem
}
const IFrameDocRenderer = (props: IOptions) => {
    const { filterData } = props;
    const [searchParams] = useSearchParams();
    const [proposalNo, setProposalNo] = useState<any>('')

    const params = new URLSearchParams({
        officecode: searchParams.get("officecode") || filterData?.officeCode,
        appname: searchParams.get("appname") || "",
        year: searchParams.get("year") ?? new Date(filterData?.year).getFullYear().toString(),
        propno: proposalNo || filterData?.propno
    });

    useEffect(() => {
        const sub = topic.subscribe('proposalNo', (_t: string, data: string) => {
            if (data) {
                setProposalNo(data)
            }
        });

        return () => {
            topic.unsubscribe(sub)
        };
    }, []);

    return (
        <div className='border-2 border-blue-500/40 rounded'>
            <iframe
                src={`/app/iframe/customViewer/ap/policyView?${params.toString()}`}
                style={{ width: "100%", height: "calc(100vh - 175px)", border: "none" }}
            />
        </div>
    )
}

export default IFrameDocRenderer
