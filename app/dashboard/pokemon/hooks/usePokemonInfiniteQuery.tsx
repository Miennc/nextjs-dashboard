import {useInfiniteQuery} from '@tanstack/react-query';
import {PokemonServices} from '@/app/services/pokemonServices';
import {PokemonSchema} from "@/app/dashboard/pokemon/schema/pokemon";
import {PokemonListResponse, PaginatedResponse} from '@/app/dashboard/pokemon/types/pokemon';

const POKEMON_PER_PAGE = 50;
const MAX_POKEMON = 500;

const getDetailPokemon = async (id: number) => {
    try {
        const res = await PokemonServices.getDetailDataPokemon(id);
        return PokemonSchema.parse(res);
    } catch (err) {
        console.error('Error fetching Pokémon details:', err);
        throw err;
    }
};

const fetchPokemonData = async ({pageParam = 0}): Promise<PaginatedResponse> => {
    try {
        const res = await PokemonServices.getAllDataPokemon({
            limit: POKEMON_PER_PAGE,
            offset: pageParam
        }) as PokemonListResponse;

        const idPokemon = res.results.map(pokemon =>
            Number(pokemon.url.split('/').filter(Boolean).pop())
        );

        const detailPokemon = await Promise.all(
            idPokemon.map(getDetailPokemon)
        );

        const allDataPokemon = res.results.map((pokemon, index) => ({
            ...pokemon,
            ...detailPokemon[index],
        }));

        return {
            data: allDataPokemon,
            nextOffset: pageParam + POKEMON_PER_PAGE
        };
    } catch (err) {
        console.error('Error fetching Pokémon list:', err);
        throw err;
    }
};

export const usePokemonInfiniteQuery = () => {
    return useInfiniteQuery({
        queryKey: ['pokemon'],
        queryFn: fetchPokemonData,
        initialPageParam: 0,
        getNextPageParam: (lastPage: PaginatedResponse) =>
            lastPage.nextOffset < MAX_POKEMON ? lastPage.nextOffset : undefined,
    });
};