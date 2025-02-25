export interface PokemonDetailType {
    name: string;
    url: string;
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonDetailType[];
}

export interface PaginatedResponse<T> {
    data: T[];
    nextOffset: number;
}