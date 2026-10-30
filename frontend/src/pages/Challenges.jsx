import { Container, Stack, Title, Text, SimpleGrid, Card, Badge, Group, Button, Pagination, NumberInput } from '@mantine/core';
import { useState,useEffect } from 'react';

import api from '../api/axios'
import { useSearchParams } from 'react-router-dom';

const difficultyColor = {
  Easy: 'green',
  Medium: 'yellow',
  Hard: 'red',
};

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [totalPages, setTotalPages] = useState(1)
  
  // const [page, setPage] = useState(1)
  const [searchParams, setSearchParams]=useSearchParams()
  const maxLimit = 15
  const size = parseInt(searchParams.get("size")) || 10
  const page = parseInt(searchParams.get('page')) || 1

  useEffect(() => {
    const getChallenges = async (page,viewSize) => {
      try {
        const response = await api.get("/api/ctf-challenges",{
          params:{
            page:page,
            viewSize:viewSize
          }
        });
        
        if(response.data.success){
          setTotalPages(response.data.totalPages)
          setChallenges(response.data.data);
        }
        
      } catch (error) {
        console.log(error)
      }
    };
    
    setSearchParams({page:page,size:size})
    getChallenges(page, size);
  }, [page,size]);

  const handleSize = (num) =>{
      const val = Number(num)
      setSearchParams((prev)=>{
        if(!val || val<=0){
          prev.delete('size')
        }else{
          prev.set('size',String(val))
        }
        prev.set('page',1)
        return prev
      })
  }
  
  const handlePage = (num) =>{
      const val = Number(num)
      setSearchParams((prev)=>{
        prev.set('page', String(val))
        return prev
      })
  }

  return (
    <Container size="lg" py={60}>
        
      <Stack mih="calc(100vh - 120px)">
      <Title order={2} mb="xs">Challenges</Title>
      <Text c="dimmed" mb="xl">Pick a challenge and find the flag.</Text>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {challenges.map((c) => (
          <Card key={c.title} withBorder padding="lg" radius="md">
            <Group justify="space-between" mb="xs">
              <Badge color={difficultyColor[c.difficulty]} variant="light">
                {c.difficulty}
              </Badge>
              <Text size="sm" fw={700}>{c.points} pts</Text>
            </Group>
            <Title order={4} mb={4}>{c.title}</Title>
            <Text size="sm" c="dimmed" mb="md">{c.category}</Text>
            <Button variant="light" fullWidth component='a' href={`/challenges/${c._id}`}>
              Open Challenge
            </Button>
          </Card>
        ))}
      </SimpleGrid>
      <Pagination mx="auto"mt="auto" total={totalPages} value={page} onChange={handlePage} />
      <NumberInput mx="auto" w={100} min={1} max={maxLimit} onChange={handleSize} value={size}></NumberInput> 
      </Stack>
      
    </Container>
  );
}