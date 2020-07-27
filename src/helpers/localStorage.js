export const checkExistUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || []
  } catch (error) {
    return error
  }
};

export const checkAvailableUsers = (currentUser) => {
  try {
    const users = JSON.parse(localStorage.getItem('user'))
    if (!users) {
      return []
    }
    return users.filter(user => user !== currentUser);
  } catch (error) {
    return error
  }
};

export const setItemLocalStorage = (name, arrOfUsers) => {
  localStorage.setItem(name, JSON.stringify(arrOfUsers));
};
