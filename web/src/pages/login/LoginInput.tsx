import { PalmyraNewForm } from '@palmyralabs/rt-forms';
import axios from 'axios';
import { ServiceEndpoint } from 'config/ServiceEndpoint';
import { useRef } from 'react';
import { CiLock } from 'react-icons/ci';
import { IoPersonOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Password, TextField } from 'templates/mantineForm';
import { handleError } from 'wire/ErrorHandler';

const LoginInput = () => {
  // const [loading, setLoading] = useState<boolean>(false);
  const formRef: any = useRef(null);
  const navigate = useNavigate();
  const endPoint = ServiceEndpoint.auth.login;

  const handleClick = () => {
    // setLoading(true)
    const req = {
      ...formRef.current.getData()
    }
    if (req.userName == '' || req.password == '') {
      toast.warn("Invalid Credential")
      // setLoading(false);
    }
    if (req.userName != '' && req.password != '') {
      axios.post(endPoint, req).then((_d: any) => {
        navigate(`/app/home`)
      }).catch((error) => {
        handleError(error);
        // setLoading(false);
      });
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    handleClick();
  }

  return (
    <div className='login-form'>
      <form onSubmit={handleSubmit} noValidate>
        <PalmyraNewForm endPoint={endPoint} ref={formRef}>
          <TextField attribute='userName' placeholder={"Enter username"} className={`pt-3 opacity-85`}
            leftSection={<IoPersonOutline size={20} />}
            label={"User Name"} size='lg'
            radius={'md'} invalidMessage={'Invalid Id'} />
          <Password attribute='password' placeholder='xxxxxx' leftSection={<CiLock size={22} />}
            size='lg' radius={'md'} label={"Password"} />
          <div className='login-btn-container'>
            <button type="submit"
              className="w-full cursor-pointer bg-[var(--primary-color)]
             font-semibold py-3 rounded-lg transition login-btn
             duration-200 shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </div>
        </PalmyraNewForm>
      </form>
    </div>
  )
}

export default LoginInput;