import { Button } from "@mantine/core";
import { ExportDataButton, FilterButton, IDataGridDefaultControlConfig, IPluginBtnControl, QuickSearch } from "@palmyralabs/rt-forms-mantine";
import { FaPlus } from "react-icons/fa";

interface IGridOptions extends IDataGridDefaultControlConfig {
    filter?: IPluginBtnControl
    add?: IPluginBtnControl
    addText?: any
    triggerAddClick?: any
}
const HlcPopupGridControls = (props: any) => {
    const { getPluginOptions, ...o } = props;
    const pluginOptions: IGridOptions = getPluginOptions ? getPluginOptions() : {};
    const isFilterVisible = pluginOptions.filter ? pluginOptions.filter?.visible : true;
    const isAddVisible = pluginOptions.add ? pluginOptions.add?.visible : true;
    const addText = pluginOptions.addText ? pluginOptions.addText : 'Add'

    const onAddClick = () => props.setFormData({});
    if (pluginOptions.triggerAddClick) {
        onAddClick();
    }
    return (<>
        {o.quickSearch && <QuickSearch width="200" queryRef={o.queryRef}
            columns={o.columns} {...pluginOptions.quickSearch} />}
        {isFilterVisible &&
            < FilterButton {...o} />}
        {pluginOptions.export?.visible &&
            <ExportDataButton exportOption={{ csv: 'CSV' }}
                visible={pluginOptions.export?.visible} disabled={pluginOptions.export?.disabled}
                queryRef={o.queryRef} {...pluginOptions.export} />}
        {isAddVisible && <Button className="py-action-button" onClick={onAddClick}
            {...pluginOptions.add}
            leftSection={<FaPlus />}>
            {addText}</Button>}
    </>);
}

export { HlcPopupGridControls };
