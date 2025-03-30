import { Outlet } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';

export default function Layout() {
    return (
        <div className="flex h-screen">
            <div className="w-1/6 md:w-1/4">
                <SideBar />
            </div>
            
            <div className="w-5/6 md:w-3/4 p-4">
                <Outlet />
            </div>
        </div>
    );
}
