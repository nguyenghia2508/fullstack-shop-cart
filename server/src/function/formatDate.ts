export default function formatDate(): string {
    // Set múi giờ Việt Nam (UTC+7)
    const timeZone = "Asia/Ho_Chi_Minh";
    
    // Create a new Date object with the current time and the specified time zone
    const date = new Date(new Date().toLocaleString("en-US", { timeZone }));

    // Create arrays containing day, month, and year information
    const months = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    // Get day, month, year, and hour information
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hour = date.getHours();
    const minute = date.getMinutes();
    const period = hour >= 12 ? "PM" : "AM";

    // Format the minute if it is a single digit
    const formattedMinute = minute < 10 ? "0" + minute : minute;

    // Create a new formatted date string
    const formattedDate = `${day} ${month} ${year}, ${hour}:${formattedMinute} ${period}`;

    return formattedDate;
}