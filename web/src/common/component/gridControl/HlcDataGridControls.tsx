import { DataGridPluginOptions } from "@palmyralabs/rt-forms";
import { Button } from "@mantine/core";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import { ExportDataButton, FilterButton, IDataGridDefaultControlConfig, IPluginBtnControl, QuickSearch } from "@palmyralabs/rt-forms-mantine";

interface IOptions extends IDataGridDefaultControlConfig {
    filter?: IPluginBtnControl
    onNewClick?: any,
    backOption: any,
    addText?: any
}

const HclDataGridControls = (props: DataGridPluginOptions) => {
    const { getPluginOptions, ...o } = props;
    const pluginOptions: IOptions = getPluginOptions ? getPluginOptions() : {};
    const isFilterVisible = pluginOptions.filter ? pluginOptions.filter?.visible : true;
    const handleNewClick = pluginOptions.onNewClick ? pluginOptions.onNewClick : () => { };
    const addText = pluginOptions.addText ? pluginOptions.addText : 'Add'

    return (<>
        {o.quickSearch && <QuickSearch width="200" queryRef={o.queryRef}
            columns={o.columns} {...pluginOptions.quickSearch} />}
        {isFilterVisible &&
            < FilterButton {...o} />}
        <ExportDataButton exportOption={{ csv: 'CSV' }}
            visible={pluginOptions.export?.visible} disabled={pluginOptions.export?.disabled}
            queryRef={o.queryRef} {...pluginOptions.export} />
        {(pluginOptions.backOption != false) &&
            <Button onClick={() => window.history.back()} {...pluginOptions.backOption} className="py-action-button"
                leftSection={<FaArrowLeft />}>
                Back</Button>}
        {(pluginOptions.add?.visible !== false) &&
            <Button onClick={handleNewClick} {...pluginOptions.add} className="py-action-button"
                leftSection={<FaPlus />}>
                {addText}</Button>}
    </>);
}

export { HclDataGridControls }