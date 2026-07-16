import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ServiceEndpoint } from 'config/ServiceEndpoint';
import { PolicyNotFound } from 'src/common/pages/PolicyNotFound';
import { handleError } from 'wire/ErrorHandler';
import { useFormstore } from 'wire/StoreFactory';
import { PolicyDocumentContent } from './PolicyDocumentContent';

/**
 * iframe child render for the policyNo flow.
 * Client entry: /app/iframe/customViewer/policy/docView?policyNo=<policyNo>
 * (or via the parent page /app/customViewer/policyDocument?policyNo=<policyNo>)
 *
 * Looks the policy up by number, then passes policyId + policyData as props to
 * PolicyDocumentContent (same content as PolicyResultView, prop-driven).
 */
const PolicyDocumentView = () => {
    const [searchParams] = useSearchParams();

    // When opened through IFrameDocRenderer the value arrives inside the
    // `filterData` JSON blob rather than as a top-level query param, so fall
    // back to it. This works both for a direct ?policyNo=... hit and the iframe.
    const filterData = JSON.parse(searchParams.get('filterData') || '{}');

    const policyNo =
        searchParams.get('policyNo') ||
        searchParams.get('policyNumber') ||
        searchParams.get('policyno') ||
        filterData?.policyNo ||
        filterData?.policy ||
        '';

    const [policy, setPolicy] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!policyNo) {
            setLoading(false);
            return;
        }

        setLoading(true);
        useFormstore(ServiceEndpoint.policy.searchPolicyApi)
            .query({ filter: { policyNumber: policyNo } })
            .then((d: any) => {
                setPolicy(d?.result?.[0] ?? null);
            })
            .catch(handleError)
            .finally(() => setLoading(false));
    }, [policyNo]);

    if (loading) {
        return <div className="flex items-center justify-center h-[80vh]" />;
    }

    if (!policy?.id) {
        return <PolicyNotFound proposalNo={policyNo} type="neft" />;
    }

    return <PolicyDocumentContent policyId={policy.id} policyData={policy} />;
};

export { PolicyDocumentView };
