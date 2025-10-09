import { BiShield } from 'react-icons/bi';
import './Login.css';
import LoginForm from './LoginForm';
import { colorConfig } from 'src/themes/colorConfig';

const LoginPage = () => {

    return (
        <div>
            <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 
            flex items-center justify-center p-4`}>
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-20 h-20 bg-[${colorConfig.lic.blue}] rounded-full mb-4 shadow-lg`}>
                            <BiShield className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Life Insurance Corporation
                        </h1>
                        <p className="text-gray-600">of India</p>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default LoginPage;