import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Search } from '@/lib/icons';
import { cn } from '@/lib/utils';

export type Column<T> = {
    header: string;
    cell: (row: T, index: number) => ReactNode;
    className?: string;
};

const PAGE_SIZE = 10;

/**
 * Client-side search + paging.
 * ponytail: filters in the browser over all rows; switch to server pagination if a table outgrows a few thousand rows.
 */
export function DataTable<T>({
    rows,
    columns,
    searchText,
    empty = 'Tidak ada data untuk ditampilkan.',
    toolbar,
}: {
    rows: T[];
    columns: Column<T>[];
    searchText: (row: T) => string;
    empty?: string;
    toolbar?: ReactNode;
}) {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q
            ? rows.filter((r) => searchText(r).toLowerCase().includes(q))
            : rows;
    }, [rows, query, searchText]);

    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = Math.min(page, pages - 1);
    const visible = filtered.slice(
        current * PAGE_SIZE,
        (current + 1) * PAGE_SIZE,
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(0);
                        }}
                        placeholder="Cari..."
                        className="pl-8"
                        aria-label="Cari data"
                    />
                </div>
                {toolbar}
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            {columns.map((c) => (
                                <TableHead
                                    key={c.header}
                                    className={c.className}
                                >
                                    {c.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visible.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    {empty}
                                </TableCell>
                            </TableRow>
                        ) : (
                            visible.map((row, i) => (
                                <TableRow key={i}>
                                    {columns.map((c) => (
                                        <TableCell
                                            key={c.header}
                                            className={cn(
                                                'whitespace-normal',
                                                c.className,
                                            )}
                                        >
                                            {c.cell(
                                                row,
                                                current * PAGE_SIZE + i,
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {filtered.length > PAGE_SIZE && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        {current * PAGE_SIZE + 1}–
                        {Math.min((current + 1) * PAGE_SIZE, filtered.length)}{' '}
                        dari {filtered.length}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={current === 0}
                            onClick={() => setPage(current - 1)}
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={current >= pages - 1}
                            onClick={() => setPage(current + 1)}
                        >
                            Berikutnya
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
