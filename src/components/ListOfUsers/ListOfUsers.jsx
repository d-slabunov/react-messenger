import React, {useCallback} from 'react';
import './styles.css';

const ListOfUsers = ({ currentUser, availableUsers, onlineUsers, handleLogout, openChat, isAdmin }) => {
  const handleChange = useCallback((user) => {
    if (isAdmin) return;
    openChat(user);
  }, [isAdmin, openChat]);

  return(
    <div className='users-list-wrapper'>
      <h3>List of users</h3>
      <span className='myUser'>{currentUser}(you)</span>
      <div className='users-wrapper'>
        {availableUsers.map((user, i) => {
          let online
          onlineUsers.map(onlineUser => {
            if (user === onlineUser.name) {
              online = true
            }
            return null;
          })
          return (
            <span
              className='user'
              key={`${user}-${i}`}
              onClick={() => handleChange(user)}
            >
              {`${user}(${online ? 'online' : 'offline'})`}
            </span>
          )
        })}
      </div>
      <div className='logout-button'>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default ListOfUsers;
