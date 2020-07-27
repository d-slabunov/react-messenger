export const chatName = (firstName, secondName) => {
  let arr = [];
  arr.push(firstName);
  arr.push(secondName);
  return arr.sort().join('-');
};
