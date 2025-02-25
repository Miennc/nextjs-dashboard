'use client';
import Image from "next/image";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {JSX} from "react";

interface Pokemon {
    name: string;
    sprites: {
        front_default: string | null;
    };
    types: Array<{
        slot: number;
        type: {
            name: string;
        };
    }>;
}

interface PokemonPage {
    data: Pokemon[];
}

interface PokemonTableProps {
    data: {
        pages: PokemonPage[];
    };
}

export const PokemonTable = ({data}: PokemonTableProps): JSX.Element => {
    return (
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
                {data.pages.map((page, pageIndex) => (
                    page.data.map((pokemon: Pokemon, index: number) => (
                        <TableRow
                            className="h-[38px] hover:bg-gray-50"
                            key={`${pageIndex}-${index}`}
                        >
                            <TableCell className="text-gray6">
                                {pageIndex * 50 + index + 1}
                            </TableCell>
                            <TableCell className="text-left text-gray6 capitalize">
                                {pokemon.name}
                            </TableCell>
                            <TableCell className="text-left">
                                <Image
                                    src={pokemon.sprites.front_default ?? '/placeholder.png'}
                                    alt={pokemon.name}
                                    width={100}
                                    height={100}
                                    priority={index < 4}
                                />
                            </TableCell>
                            <TableCell className="text-left">
                                {pokemon.types.map((type) => (
                                    <span
                                        key={type.slot}
                                        className="text-gray6 capitalize mr-1"
                                    >
                    {type.type.name}
                  </span>
                                ))}
                            </TableCell>
                        </TableRow>
                    ))
                ))}
            </TableBody>
        </Table>
    );
};