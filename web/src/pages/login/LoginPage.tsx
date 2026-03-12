import { LicLogo, TitleConfig } from 'templates/FlexImport';
import './Login.css';
import LoginForm from './LoginForm';

// const officeCode = 301;
// const srNo = 9823880;
// const URL = '/customViewer/NG/'

const LoginPage = () => {
    return (
        <div>

            {/* <div className='absolute flex justify-center pt-5 items-center right-0 mr-90'>
                <Button
                    onClick={() =>
                        window.open(
                            `${URL}${officeCode}/${srNo}`,
                            "_blank",
                            "noopener,noreferrer"
                        )
                    }
                >
                    Custom Viewer
                </Button>
            </div> */}

            <div className={`min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 
            flex items-center justify-center p-4`}>
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        {/* <div className={`inline-flex items-center justify-center w-20 h-20 pr-bgcolor rounded-full mb-4 shadow-lg`}> */}
                        {/* <BiShield className="w-12 h-12 text-white" /> */}
                        {/* <img src={Image}/> */}
                        {/* </div> */}
                        <div className='flex items-center justify-center'>
                            <img src={LicLogo} className='h-20 w-30' />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {TitleConfig.appTitle.text}
                        </h1>
                        {/* <p className="text-gray-600">of India</p> */}
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default LoginPage;