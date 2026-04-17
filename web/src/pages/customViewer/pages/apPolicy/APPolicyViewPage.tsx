import { useSearchParams } from 'react-router-dom';
import { APPolicyListGrid } from './APPolicyListGrid'
import IFrameDocRenderer from './IFrameDocRenderer';

const APPolicyViewPage = () => {
  const [searchParams] = useSearchParams();
  const srno: any = searchParams.get("appname")?.toLocaleLowerCase().toString();

  return (
    <div className="flex  gap-4 p-3 overflow-hidden">
      <div className="w-[15%] shadow rounded-lg p-1 h-[calc(100vh-80px)] overflow-auto">
        <APPolicyListGrid pageName="" type={srno} />
      </div>
      <div className="w-[85%] bg-white rounded-lg shadow overflow-auto h-[calc(100vh-80px)]">
        <IFrameDocRenderer />
      </div>
    </div>
  )
}

export { APPolicyViewPage }
