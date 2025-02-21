import { KyClient } from './KyClient';

const getAllDataPokemon = (payload: any) => {
    return KyClient.get('pokemon/', payload);
}

const getDetailDataPokemon = (id: string) => {
    return KyClient.get(`pokemon/${id}`);
}
export const PokemonServices = {
    getAllDataPokemon,
    getDetailDataPokemon
}

