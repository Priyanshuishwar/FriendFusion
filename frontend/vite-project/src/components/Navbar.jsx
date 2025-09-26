import React from 'react'
import userAuthUser from '../hooks/userAuthUser';
import { useLocation,Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/api';
import { BellIcon, LogOutIcon, ShipWheelIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector.jsx';

const Navbar = () => {
    const { authUser } = userAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");
    const queryClient = useQueryClient();
   const { mutate: logoutMutation } = useMutation({
  mutationFn: logout,
  onSuccess: () => {
    queryClient.setQueryData(["authUser"], null);   // clear cache immediately
    queryClient.removeQueries(["authUser"]);        // optional cleanup
  }
})

  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-300 h-16 flex items-center'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-end w-full'>
                {/* Logo-only if int he chat page */}

                {isChatPage && (
                    <div className='pl-5'>
                        <Link to="/" className="size-9 text-primary" >
                        <ShipWheelIcon className='size-9 text-primary'/>
                        <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
                            FriendFusion
                        </span>
                        </Link>
                    </div>
                )}
                <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
                    <Link to = {"/notifications"}>
                    <button className='btn btn-ghost btn-circle'>
                        <BellIcon className='h-6 w-6 text-base-content opacity-70'/>
                    </button>
                    </Link>
                </div>
                {/* To dO */}
                <ThemeSelector />

                <div className='avatar'>
                    <div className='w-9 rounded-full'>
                        <img src= {authUser?.profilePic} alt="User Avatar" rel='noreferrer'/>
                    </div>
                </div>
                {/* Logout-Button */}
                <button className='btn btn-ghost btn-circle' onClick={logoutMutation}>
                    <LogOutIcon className='h-6 w-6 text-base-content opacity-70'/>
                </button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar;