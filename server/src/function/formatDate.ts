export default function formatDate(): string {
    // Get the current date in UTC
    const dateUTC = new Date();

    // Convert UTC date to local date
    const dateLocal = new Date(dateUTC.getTime() - dateUTC.getTimezoneOffset() * 60000);

    // Create arrays containing day, month, and year information
    const months = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    // Get day, month, year, and hour information
    const day = dateLocal.getDate();
    const month = months[dateLocal.getMonth()];
    const year = dateLocal.getFullYear();
    let hour = dateLocal.getHours();
    const minute = dateLocal.getMinutes();
    const period = hour >= 12 ? "PM" : "AM";

    // Format the hour
    hour = hour % 12 || 12; // 0 hour is displayed as 12 hour

    // Format the minute if it is a single digit
    const formattedMinute = minute < 10 ? "0" + minute : minute;

    // Create a new formatted date string
    const formattedDate = `${day} ${month} ${year}, ${hour}:${formattedMinute} ${period}`;

    return formattedDate;
}
