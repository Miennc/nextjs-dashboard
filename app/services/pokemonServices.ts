import KyClient from './KyClient';

interface PokemonQueryParams {
  limit: number;
  offset: number;
}

const getAllDataPokemon = async (payload: PokemonQueryParams) => {
  return await KyClient.get('pokemon/', {
    searchParams: {
      limit: String(payload.limit),
      offset: String(payload.offset),
    },
  }).json();
};

const getDetailDataPokemon = async (id: number) => {
  return await KyClient.get(`pokemon/${id}`).json();
};

export const PokemonServices = {
  getAllDataPokemon,
  getDetailDataPokemon,
};
