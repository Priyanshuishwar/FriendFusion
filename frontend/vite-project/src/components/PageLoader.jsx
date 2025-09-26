import React from 'react'
import { LoaderIcon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

const PageLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div className='min-h-screen flex items-center justify-center' data-them= {theme}>
      <LoaderIcon className="animate-spin size-10 text-primary"></LoaderIcon>
    </div>
  )
}

export default PageLoader
