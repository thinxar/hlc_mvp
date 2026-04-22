import { Topbar } from 'components/Topbar'
import { useEffect, useRef, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const handleScroll = () => {
            setScrollY(el.scrollTop);
        };

        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <div className="flex flex-col h-screen">
            <Topbar />
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-50px)]"
                ref={scrollContainerRef}>
                <Outlet />

                <button
                    onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={`fixed cursor-pointer bottom-6 right-12 bg-blue-600 text-white p-3 
                    rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 animate-fadeIn
                  ${scrollY > 200 ? 'opacity-100' : 'opacity-1'}
                    
                    `}
                    aria-label="Scroll to top"
                >
                    <IoIosArrowUp className="text-lg" />
                </button>
            </div>
        </div>
    )
}

export { MainLayout }
