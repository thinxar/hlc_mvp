import { BiLogOutCircle } from "react-icons/bi"

const Topbar = () => {
    return (
        <div>
            <div className='text-white m-2 p-2 flex items-center gap-2 justify-end'><BiLogOutCircle /> Logout</div>
        </div>
    )
}

export { Topbar }