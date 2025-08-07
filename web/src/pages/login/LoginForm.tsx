import LoginInput from './LoginInput';

const LoginHeader = () => {

    return (
        <div className='login-header flex items-center justify-center'>
            <div>Login</div> <br></br>
        </div>
    )
}

const LoginForm = () => {

    return (
        <div>
            <LoginHeader />
            <LoginInput />
        </div>
    )
}

export default LoginForm;