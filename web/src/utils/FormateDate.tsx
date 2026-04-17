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

function getDaysBetweenDates(date1: string | Date, date2: string | Date, labelRemove?: boolean): string {
    const parseDate = (input: string | Date): Date => {
        if (input instanceof Date) return input;

        const parts = input.split('-');
        if (parts.length !== 3) return new Date(NaN);

        const [day, month, year] = parts.map(Number);
        return new Date(year, month - 1, day);
    };

    const d1 = parseDate(date1);
    const d2 = parseDate(date2);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return 'Invalid Date';
    }

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays}  ${labelRemove ? '' : diffDays > 1 ? ' Days' : ' Day'}`;
}

const handleKeyAction = (key: string, action: () => void) =>
    (event: React.KeyboardEvent) => {
        if (event.key === key) {
            action();
        }
    };


const getCounts = (data: any[]) => {
    const today: any = new Date();

    return data.reduce(
        (acc, item) => {
            if (!item.dateOfSubmission) return acc;

            const submittedDate: any = new Date(item.dateOfSubmission);
            const diffDays = Math.max(
                0,
                Math.floor((today - submittedDate) / (1000 * 60 * 60 * 24))
            );

            acc.total++;

            if (diffDays < 3) acc["<3"]++;
            else if (diffDays <= 10) acc["3-10"]++;
            else acc[">10"]++;

            return acc;
        },
        { total: 0, "<3": 0, "3-10": 0, ">10": 0 }
    );
};


export { formatDateTime, getDaysBetweenDates, getCounts }


export { FormateDate, formatRFCDate, handleKeyAction }