import { useRef } from "react";
import { MdClose } from "react-icons/md";
import { TextField } from "templates/mantineForm";
import { Transition } from "@mantine/core";
import { BiSearch } from "react-icons/bi";

interface Props {
    attribute: string;
    placeholder?: string;
    filter: any;
    setFilter: any;
    handleFilterChange: any;
}

export const SearchFilterField = ({
    attribute,
    placeholder,
    filter,
    setFilter,
    handleFilterChange
}: Props) => {

    const inputRef = useRef<any>(null);

    const handleClear = () => {
        if (inputRef.current?.setValue) {
            inputRef.current.setValue('');
        }

        setFilter((prev: any) => ({
            ...prev,
            [attribute]: ''
        }));
    };

    return (
        <TextField
            attribute={attribute} style={{ padding: '0px' }}
            placeholder={placeholder || "Search"}
            ref={inputRef}
            leftSection={<BiSearch size={18} />}
            onChange={handleFilterChange(attribute, "text")}
            rightSection={
                <Transition
                    mounted={!!filter?.[attribute]}
                    transition="slide-left"
                    duration={100}
                    timingFunction="ease"
                >
                    {(styles) => (
                        <div style={styles}>
                            <MdClose
                                style={{ cursor: "pointer" }}
                                onClick={handleClear}
                            />
                        </div>
                    )}
                </Transition>
            }
        />
    );
};
