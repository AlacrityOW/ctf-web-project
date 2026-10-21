import { useEffect, useState } from 'react';
import { Text, Button } from '@mantine/core'
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import { Container, Title } from '@mantine/core';

// 2. The Page Component simply consumes the data
export default function challengePage() {
    const [challenge, setChallenge] = useState([])
    const [loading, setLoading] = useState(true)
    const {id} = useParams();
    useEffect(()=>{
        const getPage = async()=>{
            const resp = await api.get(`/api/ctf-challenges/${id}`)
            setChallenge(resp.data)
            setLoading(false)
        }
        getPage();
    },[])
    if(loading) return <div>Loading . .</div>
    if(!challenge) return <div>No Data</div>
    return (
        <Container size="lg" py={60}>
            <Title mb="xs">{challenge.title}</Title>
            <Text size="lg" c="dimmed" mb="md">{challenge.category}</Text>
            <Text>{challenge.difficulty}</Text>
            <Button variant="light" fullWidth component='a'>Download</Button>
        </Container>
    );
}