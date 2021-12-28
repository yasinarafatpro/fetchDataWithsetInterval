import React, { useEffect, useState } from 'react'
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface Column {
    id: 'title' | 'url' | 'created_at' | 'author';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

export interface InitPost {
    title: 'string',
    url: 'string',
    created_at: Date,
    author: 'string'
}

const columns: readonly Column[] = [
    {
        id: 'title',
        label: 'Title',
        minWidth: 170
    },
    {
        id: 'url',
        label: 'URL',
        minWidth: 100
    },
    {
        id: 'created_at',
        label: 'Created_at',
        minWidth: 170,
    },
    {
        id: 'author',
        label: 'Author',
        minWidth: 170,
    },
];

const Home: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [postData, setPostData] = useState<InitPost[]>([])
    const [totalElements, setTotalElements] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const [myInterval, setMyInterval] = useState<any>(null)

    const navigate = useNavigate()

    useEffect(() => {
        getData(0)
        setInterval(getData, 10000)
    }, [])


    const getData = async (pageNumber:number) => {
        try {
            setLoading(true)
            console.log(loading)
            const res = fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNumber}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setPostData(data.hits)
                    setTotalElements(data.nbHits)
                    setLoading(false)
                })
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const goDetails = (post: InitPost) => {
        navigate('/details', { state: post })
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        if (newPage === 0) {
            const interval = setInterval(() => {
                getData(0)
            }, 10000)
            setMyInterval(interval)
        } else {
            clearInterval(myInterval)
        }
        setPage(newPage);
        getData(newPage)
    };

    return (
        <>
            <p>Get Data List</p>
            <Container>
                <Paper>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {postData.map((row, i) => {
                                    return (
                                        <TableRow key={i}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id}>
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[]}
                        component="div"
                        count={totalElements}
                        rowsPerPage={20}
                        page={page}
                        onPageChange={handleChangePage}
                    />
                </Paper>
            </Container>
        </>
    )
}

export default Home
