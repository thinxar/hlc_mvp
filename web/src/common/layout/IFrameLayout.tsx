import { Outlet } from 'react-router-dom'

const IFrameLayout = () => {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    )
}

export { IFrameLayout }

