import { Topbar } from 'components/Topbar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <div className="flex flex-col h-screen">
            <Topbar />
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-50px)]">
                <Outlet />
            </div>
        </div>
    )
}

export { MainLayout }
