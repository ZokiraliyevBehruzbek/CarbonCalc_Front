import { useState } from 'react';
import { PageType } from '../types';

export const useNavigation = (initialPage: PageType = 'login') => {
  const [currentPage, setCurrentPage] = useState<PageType>(initialPage);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    navigateTo,
  };
};