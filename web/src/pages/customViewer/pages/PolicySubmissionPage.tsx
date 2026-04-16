import PolicySubmissionFrom from "src/pages/generalSection/PolicySubmissionFrom";
import { getPolicyInfo } from "utils/LocalStorageInfo";

const PolicySubmissionPage = () => {

    const policyUser: any = getPolicyInfo();

    const typeMapper: any = {
        'Revival': 'rev',
        'Ananda': 'and',
        'Policy Bazaar': 'pbv',
    }

    const webType = typeMapper[policyUser]; 

    return (
        <>
            <PolicySubmissionFrom type={webType} />
        </>
    )
}

export default PolicySubmissionPage