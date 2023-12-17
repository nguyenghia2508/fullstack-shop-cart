export default function getDate(date?: Date | string): string {
    if (date) {
      const today = new Date(date);
      const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      const timeString = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
      const period = today.getHours() >= 12 ? 'PM' : 'AM';
      return `${dateString} ${timeString} ${period}`;
    } else {
      const today = new Date();
      const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      const timeString = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
      const period = today.getHours() >= 12 ? 'PM' : 'AM';
      return `${dateString} ${timeString} ${period}`;
    }
  }
  