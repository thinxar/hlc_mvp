import LoginInput from './LoginInput';

const LoginHeader = () => {

    return (
        <div className='login-header flex items-center justify-center'>
            <div>Login</div> <br></br>
        </div>
    )
}

const LoginCopyright = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className='mt-5'>
            <span className="text-slate-200">©{currentYear} Life Insurance Corporation of India</span>
        </div>
    )
}

const LoginForm = () => {

    return (
        <div>
            <LoginHeader />
            <LoginInput />
            <LoginCopyright/>
        </div>
    )
}

export default LoginForm;