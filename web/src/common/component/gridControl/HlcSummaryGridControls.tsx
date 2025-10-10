import { Button } from "@mantine/core";
import { ExportDataButton, FilterButton, IDataGridDefaultControlConfig, IPluginBtnControl, QuickSearch } from "@palmyralabs/rt-forms-mantine";
import { FaPlus } from "react-icons/fa";

interface IGridControls extends IDataGridDefaultControlConfig {
    aclCode?: string
    filter?: IPluginBtnControl
    add?: IPluginBtnControl
    filterField?: any
    addText?: string
    onNewClick?: () => void

}
const HclSummaryGridControls = (props: any) => {
    const { getPluginOptions, ...o } = props;
    const pluginOptions: IGridControls = getPluginOptions ? getPluginOptions() : {};
    const handleNewClick = pluginOptions.onNewClick ? pluginOptions.onNewClick : () => props.newRecord();
    const addText = pluginOptions.addText ? pluginOptions.addText : 'Add'
    const FilterLet: any = pluginOptions?.filterField
    const isFilterVisible = pluginOptions.filter ? pluginOptions.filter?.visible : true;
    const ACL_CODE = pluginOptions.aclCode ? pluginOptions.aclCode : '';

    return (<>
        {o.quickSearch && <QuickSearch width="200" queryRef={o.queryRef}
            columns={o.columns} {...pluginOptions.quickSearch} />}
        {FilterLet && <div className="flex">
            {FilterLet}</div>}
        {isFilterVisible &&
            < FilterButton {...o} />}
        {pluginOptions.export?.visible &&
            <div>
                <ExportDataButton exportOption={{ excel: 'Excel' }}
                    visible={pluginOptions.export?.visible} disabled={pluginOptions.export?.disabled}
                    queryRef={o.queryRef} {...pluginOptions.export} />
            </div>}
        {((pluginOptions.add?.visible !== false) && (ACL_CODE ? true : true)) &&
            <div>
                <Button onClick={handleNewClick} {...pluginOptions.add}
                    className={ACL_CODE && !true ? 'py-action-button py-action-button-disabled' : 'py-action-button'}
                    disabled={ACL_CODE && !true || false}
                    leftSection={<FaPlus />}>
                    {addText}</Button></div>}
    </>);
}

export { HclSummaryGridControls };
