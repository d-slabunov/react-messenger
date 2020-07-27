import React, { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { checkAvailableUsers, checkExistUsers, setItemLocalStorage } from '../../helpers/localStorage'
import ablyApi from '../../api/ablyApi';
import ListOfUsers from '../ListOfUsers/ListOfUsers';
import './styles.css';

const UserPanel = ({ history, location }) => {
  const currentUser = location.search.replace(/^([^:]+)=/, '');

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [startMessages, setStartMessages] = useState(false);
  const [addressee, setAddressee] = useState('');

  useEffect(() => {
    const existedUsers = checkExistUsers();
    let arrOfUsers = [...existedUsers];
    if (!existedUsers.includes(currentUser)) {
      arrOfUsers = [...existedUsers, currentUser];
      setOnlineUsers(arrOfUsers);
    }
    setItemLocalStorage('user', arrOfUsers);
  }, [currentUser, setOnlineUsers]);

  const availableUsers = checkAvailableUsers(currentUser);

  useEffect(() => {
    ablyApi.init(currentUser);
    ablyApi.enterToPresenceChannel()
    ablyApi.subscribeToChannel(setAdminMessages, true);
    ablyApi.getFromPresenceChannel(setOnlineUsers, false, currentUser);
    ablyApi.subscribeToPresenceChannel(setOnlineUsers, 'enter');
    ablyApi.subscribeToPresenceChannel(setOnlineUsers, 'leave');
  }, []);

  useEffect(() => {
    return () => {
      ablyApi.leaveToPresenceChannel();
    }
  }, []);

  const openChat = useCallback((user) => {
    setAddressee(user);
    ablyApi.subscribeToChannel(setMessages, false, user, currentUser);
    setStartMessages(true);
  }, [setAddressee, setStartMessages, setMessages, currentUser]);

  const submit = useCallback(() => {
    if (text.trim() !== '') {
      ablyApi.publishToChannel(false, text, addressee, currentUser)
      setText('');
    }
  }, [text, setText, addressee, currentUser]);

  const handleLogout = () => {
    ablyApi.leaveToPresenceChannel();
    history.push('/');
  };

  const pressEnter = (e) => {
    if (e.key === 'Enter') {
      submit()
    }
  }

  return(
    <div className='chat-wrapper'>
      <div className='private-admin-chats'>
        <div className='chats'>
          {startMessages ? (
            <div className='chat-window'>
              <div className='user-name'>{addressee}</div>
              <div className='messenger'>
                {messages.map((el, i) => {
                  return <p className={`message ${el.myMessage ? 'my' : 'you'}`} key={i}>{el.message}</p>
                })}
              </div>
              <div className='controls'>
                <input
                  className='message-input'
                  placeholder='Type message...'
                  type='text'
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={pressEnter}
                />
                <button className='send-button' onClick={submit}>Send</button>
              </div>
            </div>
          ) : (
            <div className='no-chat-window'>
              <p>Click on user to start chat</p>
            </div>
          )}
        </div>
        <div className='chats'>
          <div className='chat-window'>
            <div className='user-name'>System messages</div>
            <div className='messenger'>
              {adminMessages.map((message, i) => {
                return <span className='message you' key={i}>{message}</span>
              })}
            </div>
          </div>
        </div>
      </div>
      <ListOfUsers
        isAdmin={false}
        availableUsers={availableUsers}
        currentUser={currentUser}
        handleLogout={handleLogout}
        onlineUsers={onlineUsers}
        openChat={openChat}
      />
    </div>
  );
};

export default withRouter(UserPanel);
