export default function dateFormat(value)
{
    if(value)
    {
        var today = new Date(value);
        var value = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
        if(today.getHours() >= 12)
        {
            return value + ' '+ time + ' '+  "PM"
        }
        else
        {
            return value + ' '+ time + ' '+  "AM"
        }
    }
    else
    {
        var today = new Date();
        var value = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var value = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
        if(today.getHours() >= 12)
        {
            return value + ' '+ time + ' '+  "PM"
        }
        else
        {
            return value + ' '+ time + ' '+  "AM"
        }
    }
}