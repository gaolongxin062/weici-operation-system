
function formatDate (inputTime) {
  const date = new Date(inputTime);
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatDateDay (inputTime) {
  const date = new Date(inputTime);
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  return `${year}-${month}-${day}`
}

function padZero(num) {
  return num < 10 ? '0' + num : num;
}
export default {
  formatDate,
  formatDateDay
}
