import { Topbar } from '../../components/Topbar';
import { PolicySearchPage } from '../policySearch/PolicySearchPage';

const HomePage = () => {

    return (
        <div>
            <Topbar />
            <PolicySearchPage />
        </div>
    );
};

export { HomePage };