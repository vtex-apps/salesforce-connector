function padTo2Digits(num:number) {
    return num.toString().padStart(2, '0');
  }
  
  function formatDate(date:Date) {
    return (
      `${[
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear()
      ].join('/')
      } ${
        [
          padTo2Digits(date.getHours()),
          padTo2Digits(date.getMinutes()),
          padTo2Digits(date.getSeconds()),
        ].join(':')}`
    );
  }
  
export function getCurrentDate() {
  return formatDate(new Date());
}

export function validateResponse(data:any):boolean{
  return  (data!=null && data!=undefined && data.length>0);
}