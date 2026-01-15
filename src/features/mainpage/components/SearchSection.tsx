'use client';

import { useState } from 'react';
import SearchBar from '@/src/components/Search/Search';

export default function SearchSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    console.log('검색:', term);
  };

  return (
    <section className="w-full h-[208px]">
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={handleSearch}
      />
    </section>
  );
}
