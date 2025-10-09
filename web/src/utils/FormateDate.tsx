function FormateDate(d: any) {
    if (d != null) {
        const date = new Date(d);
        if (isNaN(date.getTime())) {
            return '';
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }
}

function formatRFCDate(dateString: any): any {
    if (dateString == null || typeof dateString == 'boolean' || typeof dateString == 'function') {
        return 'Invalid Input'
    }
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function formatDateTime(dateTime: any, pattern: any) {
  if (dateTime == null || typeof dateTime == 'function') {
    return ''
  }
  const d = new Date(dateTime);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hour = d.getHours();
  // const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';

  const hourX = hour % 12 || 12;
  const hoursFormatted = String(hourX).padStart(2, '0');

  return pattern
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year)
    .replace('HH', hoursFormatted)
    .replace('MM', minutes)
    .replace('SS', seconds)
    .replace('A', ampm);
}

export { formatDateTime }


export { FormateDate, formatRFCDate }