import Image from '../../../public/tneb.png';
import './Login.css';
import LoginForm from './LoginForm';

const LoginPage = () => {

    return (
        <div>
            <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 
            flex items-center justify-center p-4`}>
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        {/* <div className={`inline-flex items-center justify-center w-20 h-20 pr-bgcolor rounded-full mb-4 shadow-lg`}> */}
                            {/* <BiShield className="w-12 h-12 text-white" /> */}
                            {/* <img src={Image}/> */}
                        {/* </div> */}
                        <div className='flex items-center justify-center'>
                               <img src={Image} className='h-30 w-30'/>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Tamil Nadu Electricity Board
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