
// import LogoText from '../../../public/image/agtext.png';
import './Login.css';
import LoginForm from './LoginForm';

const LoginPage = () => {

    return (
        <div>
            <div className='login-page-container flex items-center justify-center min-h-screen'>
                {/* <div className='login-logo-text '>
                    <img src={LogoText} />
                </div> */}
                <div className="w-full mt-4">
                    <div className="login-box-container max-w-lg mx-auto p-4 shadow-md rounded-3xl bg-white/20">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;