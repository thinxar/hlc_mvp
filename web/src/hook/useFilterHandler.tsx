import { delayGenerator } from "@palmyralabs/ts-utils";

type FilterType = 'text' | 'lookup' | 'select' | 'customLookup';

const delay = delayGenerator(300);
export const useFilterHandler = <T extends Record<string, any>>(
    setFilter: React.Dispatch<React.SetStateAction<T>>
) => {
    const updateFilter = (key: keyof T, value: string) => {
        setFilter((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleFilterChange =
        (key: keyof T, type: FilterType, customKey?: string, defaultValue?: string) =>
            (a: any, b?: any) => {
                let value = '';

                if (type === 'text') {
                    value = a?.target?.value || '';
                    if (value != '') {
                        if (!value.endsWith('*')) value += '*';
                        value = '*' + value;
                    }
                } else if (type === 'select') {
                    value = a || '';
                    value = value ? value : ''
                } else if (type === 'customLookup') {
                    value = customKey ? b?.[customKey] || defaultValue || '' : '';
                }
                else {
                    value = b?.id || '';
                }

                delay(() => updateFilter(key, value));
            };

    return { handleFilterChange };
};