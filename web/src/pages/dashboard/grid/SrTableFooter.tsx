import { Pagination } from "@mantine/core"
interface FooterProps {
    setPageIndex: any
    pageIndex: number
    totalPagesCount: number | undefined
}
const SrTableFooter = (props: FooterProps) => {
    const { setPageIndex, pageIndex, totalPagesCount } = props;
    return (
        <div className="flex justify-between custom-pagination">
            <div className=""></div>
            <div className="">
                <Pagination
                    color="rgb(37, 99, 235)" size="sm" radius="xl"
                    value={pageIndex + 1}
                    onChange={(c) => setPageIndex(c - 1)}
                    total={totalPagesCount || 1}
                />
            </div>
        </div>
    )
}

export default SrTableFooter