'use client';
import { Suspense } from 'react';
import { PokemonList } from './PokemonList';
import { PokemonTableSkeleton } from '@/app/ui/skeletons';
export default function PokemonPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Pokemon List</h1>
      <Suspense fallback={<PokemonTableSkeleton />}>
        <PokemonList />
      </Suspense>
    </div>
  );
}
