import { Button } from '@mantine/core';
import { PalmyraNewForm } from '@palmyralabs/rt-forms';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoPersonOutline } from 'react-icons/io5';
import { CiLock } from 'react-icons/ci';
import { ServiceEndpoint } from 'config/ServiceEndpoint';
import { TextField, Password } from 'templates/mantineForm';
import { handleError } from 'wire/ErrorHandler';

const LoginInput = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const formRef: any = useRef(null);
  const navigate = useNavigate();
  const endPoint = ServiceEndpoint.auth.login;

  const handleClick = () => {
    setLoading(true)
    const req = {
      ...formRef.current.getData()
    }
    if (req.userName == '' || req.password == '') {
      toast.warn("Invalid Credential")
      setLoading(false);
    }
    if (req.userName != '' && req.password != '') {
      axios.post(endPoint, req).then((_d: any) => {
        navigate(`/app/home`)
      }).catch((error) => {
        handleError(error);
        setLoading(false);
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
            leftSection={<IoPersonOutline size={20}/>}
            label={"User Name"} size='lg'
            radius={'md'} invalidMessage={'Invalid Id'} />
          <Password attribute='password' placeholder='xxxxxx' leftSection={<CiLock size={22}/>}
            size='lg' radius={'md'} label={"Password"} />
          <div className='login-btn-container'>
            <Button type="submit" variant="contained" className='login-btn' loading={loading}
              loaderProps={{ type: 'dots' }}>
              Login
            </Button>
          </div>
        </PalmyraNewForm>
      </form>
    </div>
  )
}

export default LoginInput;