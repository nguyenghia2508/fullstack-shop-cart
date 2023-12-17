export default function downLine(value) {
  if (value) {
    let breakline = [];
    let lines = value.split('\n');
    for (let i = 0; i < lines.length; i++) {
      breakline.push(`<p style='text-align: justify;'>${lines[i].replace('\r', '')}</p>`);
    }
    return breakline.join('');
  }
  return '';
}