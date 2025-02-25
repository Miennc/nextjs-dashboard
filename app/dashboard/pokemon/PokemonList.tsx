'use client';
import { useEffect, useRef } from 'react';
import { usePokemonInfiniteQuery } from '@/app/dashboard/pokemon/hooks/usePokemonInfiniteQuery';
import { PokemonTable } from '@/app/dashboard/pokemon/_components/PokemonTable';

export function PokemonList() {
  const { data, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePokemonInfiniteQuery();

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isError)
    return (
      <p className="container mx-auto p-6 text-red-500">
        Failed to load Pokémon data
      </p>
    );
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200">
      {data && (
        <>
          <PokemonTable data={data} />
          <div
            ref={observerRef}
            className="h-10 flex items-center justify-center"
          >
            {isFetchingNextPage && (
              <p className="text-gray-600">Loading more...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
