'use client';

import { useState } from 'react';
import SearchBar from '@/src/components/Search/Search';

interface SearchSectionProps {
  onSearch: (term: string) => void;
}

export default function SearchSection({ onSearch }: SearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    onSearch(term);
  };

  return (
    <section className="w-full h-[208px] mb-[60px]">
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={handleSearch}
      />
    </section>
  );
}
