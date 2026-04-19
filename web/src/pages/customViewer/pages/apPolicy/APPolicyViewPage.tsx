import { useState } from 'react';
import ApDocumentFilter from './ApDocumentFilter';
import FieldSelectorErrorMsg from './FieldSelectorErrorMsg';
import IFrameDocRenderer from './IFrameDocRenderer';
import { useSearchParams } from 'react-router-dom';

const APPolicyViewPage = () => {
  const [searchParams] = useSearchParams();
  const appName: any = searchParams.get("appname")?.toLocaleLowerCase().toString();
  
  const [filterData, setFilterData] = useState<any>({
    officeCode: null,
    year: null,
    propno: null
  });

  const isAllSelected = filterData.officeCode && filterData.year && filterData.propno;
  return (
    <div className="p-3 overflow-hidden">
      <ApDocumentFilter onChange={setFilterData} type={appName} />
      <div className="rounded-lg shadow overflow-auto h-[calc(100vh-170px)]">
        {isAllSelected ? (
          <IFrameDocRenderer filterData={filterData} />
        ) : (
          <FieldSelectorErrorMsg filterData={filterData} />
        )}
      </div>
    </div>
  )
}

export { APPolicyViewPage };

