import React, {useState} from 'react';
import { withRouter } from 'react-router';
import loginIcon from '../../assets/images/loginIcon.png';
import { checkExistUsers, setItemLocalStorage } from '../../helpers/localStorage'
import './styles.css';

const Login = ({ history }) => {
  const [userValue, setUserValue] = useState('');

  const handleLogin = () => {
    const existedUsers = checkExistUsers();

    let arrOfUsers = [...existedUsers];
    if (!existedUsers.includes(userValue)) {
      arrOfUsers = [...existedUsers, userValue];
    }
    setItemLocalStorage('user', arrOfUsers);
    arrOfUsers.forEach((user) => {
      if (user.includes(userValue)) {
        history.push({
          pathname: '/user',
          search: `?name=${userValue}`
        });
      }
    });
  };

  const pressEnter = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className='container-login'>
      <div className='wrap-login'>
        <div className='login-form'>
          <span className='login-form-title'>Welcome</span>
          <span className="">Enter your name to continue</span>
          <div className='wrap-input'>
            <img className='image-wrapper' src={loginIcon} alt=""/>
            <input
              className='input'
              type='text'
              value={userValue}
              onChange={e => setUserValue(e.target.value)}
              placeholder='Username'
              onKeyDown={pressEnter}
            />
          </div>
          <div className='container-button'>
            <button className='button' onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);

