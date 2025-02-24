import { KyClient } from './KyClient';
interface PokemonQueryParams {
    limit: number;
    offset: number;
}
const getAllDataPokemon = (payload: PokemonQueryParams) => {
    return KyClient.get('pokemon/', { searchParams: payload });
};


const getDetailDataPokemon = (id: number) => {
    return KyClient.get(`pokemon/${id}`);
}
export const PokemonServices = {
    getAllDataPokemon,
    getDetailDataPokemon
}

