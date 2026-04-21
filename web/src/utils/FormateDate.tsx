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


const getFinancialYears = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const currentStartYear = month >= 3 ? year : year - 1;

    return {
        currentFY: `Apr ${currentStartYear} - Mar ${currentStartYear + 1}`,
        previousFY: `Apr ${currentStartYear - 1} - Mar ${currentStartYear}`
    };
};

function formatAmount(input: any, prefix?: any) {
    if (input !== 0 && input !== undefined && input !== null) {
        const numericInput = Number(input);
        if (isNaN(numericInput)) return '0';

        const convertAmount = numericInput?.toFixed(0);
        const options = { minimumFractionDigits: 0, maximumFractionDigits: 0 };
        const formattedAmount = Number(convertAmount).toLocaleString('en-IN', options);
        return !prefix ? '₹' + formattedAmount : formattedAmount;
    } else {
        return '0';
    }
}

type RangeType = "days" | "weeks" | "months" | "fy_current" | "fy_previous";

export const customDate = new Date("2026-04-19");
export const getDate = '2026-04-19'
interface DateRange {
    fromMonth: string;
    toMonth: string;
}

export const getDateRange = (
    value: number,
    type: RangeType
): DateRange => {
    const toDate = new Date(customDate);
    const fromDate = new Date(customDate);

    switch (type) {
        case "days":
            fromDate.setDate(toDate.getDate() - (value - 1));
            break;

        case "weeks":
            fromDate.setDate(toDate.getDate() - (value * 7 - 1));
            break;

        case "months":
            fromDate.setMonth(toDate.getMonth() - value + 1);
            break;

        case "fy_current": {
            const year = toDate.getFullYear();
            const month = toDate.getMonth();

            const startYear = month < 3 ? year - 1 : year;

            fromDate.setFullYear(startYear, 3, 1); // Apr 1
            toDate.setFullYear(startYear + 1, 2, 31); // Mar 31
            break;
        }

        case "fy_previous": {
            const year = toDate.getFullYear();
            const month = toDate.getMonth();

            const startYear = month < 3 ? year - 2 : year - 1;

            fromDate.setFullYear(startYear, 3, 1);
            toDate.setFullYear(startYear + 1, 2, 31);
            break;
        }

        default:
            throw new Error("Invalid range type");
    }

    const format = (d: Date) =>
        d.toISOString().split("T")[0];

    return {
        fromMonth: format(fromDate),
        toMonth: format(toDate),
    };
};


type DateFormatType = "month" | "week" | "day" | "default";

export const formatDate = (
    dateInput: string | Date,
    type: DateFormatType = "month",
    locale: string = "en-US"
): string => {
    if (!dateInput) return "";

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    switch (type) {
        case "month":
            return date.toLocaleString(locale, {
                month: "short",
                year: "numeric"
            });

        case "week": {
            const start = new Date(date);
            const end = new Date(date);
            end.setDate(start.getDate() + 6);

            const startStr = start.toLocaleString(locale, {
                day: "2-digit",
                month: "short"
            });

            const endStr = end.toLocaleString(locale, {
                day: "2-digit",
                month: "short"
            });

            return `${startStr} - ${endStr}`;
        }

        case "day":
            return date.toLocaleString(locale, {
                day: "2-digit",
                month: "short"
            });

        default:
            return date.toLocaleString(locale, {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
    }
};

const getTargetDate = (inputDate: string, type: 'month' | 'week') => {
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) return 'Invalid Date';

    if (type === 'month') {
        date.setMonth(date.getMonth() + 1, 0);
    } else if (type === 'week') {
        const dayOfWeek = date.getDay();
        const diff = 6 - dayOfWeek;
        date.setDate(date.getDate() + diff);
    }

    return date.toISOString().split('T')[0];
};



export { formatDateTime, getDaysBetweenDates, getCounts, getFinancialYears }


export { FormateDate, formatRFCDate, handleKeyAction, formatAmount, getTargetDate }