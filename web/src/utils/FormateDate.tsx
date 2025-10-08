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

export { FormateDate, formatRFCDate }