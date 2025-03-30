import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore"; 

export default function SideBar() {
    const [unreadCount, setUnreadCount] = useState(0); 
    const [isOpen, setIsOpen] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMessages = async () => {
            const querySnapshot = await getDocs(collection(db, "inbox"));
            const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const unreadMessages = msgs.filter((msg) => msg.isRead === false);
            setUnreadCount(unreadMessages.length); 
        };
        fetchMessages(); 
    }, []); 
    
    function handleLogout() {
        localStorage.removeItem("uid");
        dispatch(logout());
    }
    
    return (
        <>
            <button onClick={() => setIsOpen(true)} className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside className={` fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 dark:bg-gray-800 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}>
                <div className="h-full px-3 py-4 relative">
                    <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 sm:hidden">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                    <ul className="space-y-2 font-medium">
                        {user ? (
                            <>
                                <li>
                                    <NavLink to="/" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <span className="ms-3">Dashboard</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/inbox" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                                        {unreadCount > 0 && (
                                            <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/users" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <span className="flex-1 ms-3 whitespace-nowrap">users</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/product" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/addProduct" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <span className="flex-1 ms-3 whitespace-nowrap">add Product</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/order" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <span className="flex-1 ms-3 whitespace-nowrap">orders</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleLogout}>
                                        <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <NavLink to="/login" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/register" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <span className="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </aside>
        </>
    );
}
