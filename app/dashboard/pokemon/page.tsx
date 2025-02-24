'use client';
import Image from "next/image";
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from "react";
import { PokemonServices } from '@/app/services/pokemonServices';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PokemonSchema } from "@/app/dashboard/pokemon/schema/pokemon";
type PokemonDetailType = {
    name: string;
    url: string;
};
const getDataPokemon = async ({ pageParam = 0 }) => {
    try {
        const res = await PokemonServices.getAllDataPokemon({
            limit: 50,
            offset: pageParam
        });

        const dataPokemon = res.results;
        const idPokemon = dataPokemon.map((pokemon: PokemonDetailType) => pokemon.url.split('/').filter(Boolean).pop());
        const detailPokemon = await Promise.all(idPokemon.map(async (id: string[]) => await getDetail(id)));
        console.log('dataPokemon', detailPokemon);
        const allDataPokemon = dataPokemon.map((pokemon, index: number) => ({
            ...pokemon,
            ...detailPokemon[index],
        }));
        return { data: allDataPokemon, nextOffset: pageParam + 50 };
    } catch (err) {
        console.error('Error fetching Pokémon:', err);
        throw err;
    }
};

const getDetail = async (id: number) => {
    try {
        const res = await PokemonServices.getDetailDataPokemon(id.toString());
        // return res;
        return  PokemonSchema.parse(res);
    } catch (err) {
        console.error('Error fetching Pokémon:', err);
        throw err;
    }
};

export default function PokemonPage() {
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['pokemon'],
        queryFn: getDataPokemon,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextOffset < 500 ? lastPage.nextOffset : undefined,
    });
    const observerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, fetchNextPage]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Pokemon List</h1>
            {isLoading && <p>Loading...</p>}
            {isError && <p className="text-red-500">Failed to load Pokémon data</p>}

            {data && (
                <div className="w-full bg-[#fff] rounded-[8px] border border-gray1">
                    <Table>
                        <TableHeader className="h-[40px] bg-gray-100">
                            <TableRow>
                                <TableHead className="w-[80px] text-gray4 text-left">ID</TableHead>
                                <TableHead className="w-[457px] text-gray4 text-left">Name</TableHead>
                                <TableHead className="w-[457px] text-gray4 text-left">Image</TableHead>
                                <TableHead className="w-[457px] text-gray4 text-left">Type Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.pages.map((page, pageIndex) =>
                                page.data.map((pokemon, index: number) => (
                                    <TableRow className="h-[38px] hover:bg-gray-50" key={`${pageIndex}-${index}`}>
                                        <TableCell className="text-gray6">{pageIndex * 50 + index + 1}</TableCell>
                                        <TableCell className="text-left text-gray6 capitalize">{pokemon.name}</TableCell>
                                        <TableCell className="text-left">
                                            <Image src={pokemon?.sprites?.front_default} alt={pokemon.name} width={100} height={100} priority/>
                                        </TableCell>
                                        <TableCell className="text-left">
                                            {pokemon?.types?.map((type) => (
                                                <span key={type?.slot} className="text-gray6 capitalize">
                                                    {type.type?.name} {pokemon?.types?.length > 1 ? ' ' : ''}
                                                </span>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* **Vùng để Observer theo dõi (khi user scroll xuống cuối)** */}
                    <div ref={observerRef} className="h-10 flex items-center justify-center">
                        {isFetchingNextPage && <p>loading</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
