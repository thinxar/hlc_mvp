import { topic } from '@palmyralabs/ts-utils';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { filterItem } from './FieldSelectorErrorMsg';

interface IOptions {
    filterData: filterItem
    source?: string
}
const IFrameDocRenderer = (props: IOptions) => {
    const { filterData, source } = props;
    const [searchParams] = useSearchParams();
    const [proposalNo, setProposalNo] = useState<any>('')

    const params = new URLSearchParams({
        officecode: searchParams.get("officecode") || filterData?.officeCode,
        appname: searchParams.get("appname") || "",
        year: searchParams.get("year") ?? new Date(filterData?.year).getFullYear().toString(),
        propno: proposalNo || filterData?.propno,
        filterData: JSON.stringify(filterData)
    });

    const baseSrc = '/app/iframe/customViewer/';
    const src = source ? baseSrc + source : baseSrc + 'ap/policyView';

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
                src={`${src}?${params.toString()}`}
                style={{
                    width: "100%",
                    height:
                        source === "policy/docView"
                            ? "calc(100vh - 1px)"
                            : source
                                ? "calc(100vh - 135px)"
                                : "calc(100vh - 175px)",
                    border: "none",
                }}
            />
        </div>
    )
}

export default IFrameDocRenderer
