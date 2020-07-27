import React, {useEffect, useState, useCallback} from 'react';
import { withRouter } from 'react-router';
import { checkAvailableUsers } from '../../helpers/localStorage';
import ListOfUsers from '../ListOfUsers/ListOfUsers';
import './styles.css';
import ablyApi from "../../api/ablyApi";

const AdminPanel = ({ history }) => {
  const availableUsers = checkAvailableUsers('Admin');

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    ablyApi.init('Admin')
    ablyApi.subscribeToPresenceChannel(setOnlineUsers, 'enter');
    ablyApi.subscribeToPresenceChannel(setOnlineUsers, 'leave');
    ablyApi.getFromPresenceChannel(setOnlineUsers, true);
    ablyApi.subscribeToChannel(setMessages, true);
  }, []);

  const handleSubmit = useCallback(() => {
    ablyApi.publishToChannel(true, message);
    setMessage('');
  }, [setMessage, message]);

  useEffect(() => {
    return () => {
      ablyApi.leaveToPresenceChannel();
    }
  }, []);

  const handleLogout = () => {
    ablyApi.leaveToPresenceChannel();
    history.push('/');
  };

  const pressEnter = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return(
    <div className='admin-page-wrapper'>
      <div className='admin-workspace'>
        <div className='chats'>
          <div className='chat-window'>
            <div className='user-name'>Broadcast message</div>
            <div className='messenger'>
              {messages.map((message, i) => {
                return <span className='message my' key={i}>{message}</span>
              })}
            </div>
            <div className='controls'>
              <input
                className='message-input'
                type='text'
                placeholder='Type message...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={pressEnter}
              />
              <button className='send-admin-button' onClick={handleSubmit}>Send</button>
            </div>
          </div>
        </div>
      </div>
      <ListOfUsers
        isAdmin={true}
        availableUsers={availableUsers}
        currentUser={'Admin'}
        handleLogout={handleLogout}
        onlineUsers={onlineUsers}
      />
    </div>
  );
};

export default withRouter(AdminPanel);
