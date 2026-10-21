import { Container, Title, Text, SimpleGrid, Card, Badge, Group, Button } from '@mantine/core';
import { useState,useEffect } from 'react';

import api from '../api/axios'

const difficultyColor = {
  Easy: 'green',
  Medium: 'yellow',
  Hard: 'red',
};


// const challenges = [
//   { title: 'Baby\'s First Web', category: 'Web Exploitation', difficulty: 'Easy', points: 50 },
//   { title: 'Caesar\'s Secret', category: 'Cryptography', difficulty: 'Easy', points: 50 },
//   { title: 'Hidden in Plain Sight', category: 'Forensics', difficulty: 'Medium', points: 100 },
//   { title: 'Stack Smash 101', category: 'Binary Exploitation', difficulty: 'Hard', points: 200 },
//   { title: 'Packet Inspector', category: 'Networking', difficulty: 'Medium', points: 100 },
//   { title: 'The Cipher Vault', category: 'Cryptography', difficulty: 'Hard', points: 200 },
// ];

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const getChallenges = async () => {
      const response = await api.get("/api/ctf-challenges");
      setChallenges(response.data);
    };

    getChallenges();
  }, []);
  return (
    <Container size="lg" py={60}>
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
    </Container>
  );
}