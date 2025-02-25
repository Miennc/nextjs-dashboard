import { z } from 'zod';

export const NamedAPIResourceSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const PokemonTypeSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const PokemonTypeSlotSchema = z.object({
  slot: z.number(),
  type: PokemonTypeSchema,
});

export const PokemonSpritesSchema = z.object({
  front_default: z.string().nullable(),
  other: z.object({
    'official-artwork': z.object({
      front_default: z.string().nullable(),
    }),
  }),
});

export const PokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  is_default: z.boolean(),
  sprites: PokemonSpritesSchema,
  species: NamedAPIResourceSchema,
  types: z.array(PokemonTypeSlotSchema),
});
