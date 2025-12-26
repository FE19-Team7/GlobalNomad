'use client';

import Search from "@/src/components/Search/search";
import { useState } from 'react';

export default function JunyeolPage() {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    console.log('검색어:', value);
  }

  return (
    <section className='flex justify-center'>
      <Search
        value={searchValue}
        onChange={setSearchValue}
        onSearch={handleSearch}
        className='w-full max-w-[740px]'
      />
    </section>
  );
}