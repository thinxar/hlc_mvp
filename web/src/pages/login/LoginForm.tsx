import LoginInput from './LoginInput';
import { TitleConfig } from 'templates/FlexImport';

const LoginHeader = () => {

    return (
        <div className=''>
            {/* <div>Login</div> <br></br> */}
            {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Login
            </h2> */}
        </div>
    )
}

const LoginCopyright = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className='mt-5 text-center'>
            {/* <span className="text-slate-200">©{currentYear} Life Insurance Corporation of India</span> */}
            <p className="text-xs text-gray-500 mt-4">
                ©{currentYear} {TitleConfig.appTitle.text} of India. All rights reserved.
            </p>
        </div>
    )
}

const LoginForm = () => {

    return (
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
            <LoginHeader />
            <LoginInput />
            <LoginCopyright />
        </div>
    )
}

export default LoginForm;