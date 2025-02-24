import { KyClient } from './KyClient';
interface PokemonQueryParams {
    limit: number;
    offset: number;
}
const getAllDataPokemon = (payload: PokemonQueryParams) => {
    return KyClient.get('pokemon/', { searchParams: payload });
};


const getDetailDataPokemon = (id: string) => {
    return KyClient.get(`pokemon/${id}`);
}
export const PokemonServices = {
    getAllDataPokemon,
    getDetailDataPokemon
}

