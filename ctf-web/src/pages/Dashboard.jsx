import { Link, useNavigate } from 'react-router-dom';
import { Container, Title, Text, SimpleGrid, Card, Group, Button } from '@mantine/core';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js'
import { useEffect, useState } from 'react';

const stats = [
  { label: 'Challenges Solved', value: '0' },
  { label: 'Points', value: '0' },
  { label: 'Rank', value: '—' },
];

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  useEffect(()=>{
    const profRes = async ()=>{
      try {
        const response = await api.get("/api/auth/personal-data")
        // console.log(response)
        setUserData(response.data)
      } catch (error) {
        console.log(error)
      }
      
    }
    profRes()
  },[])
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    // Backend will replace this with real session/token clearing later
    logout();
    navigate('/login');
  };

  return (
    <Container size="lg" py={60}>
      <Group justify="space-between" mb="xs">
        {userData ? <Title order={2}>Welcome back, {userData.username}</Title> :<Title order={2}>Welcome back, </Title>}
        
        <Button variant="subtle" color="red" onClick={handleLogout}>
          Log Out
        </Button>
      </Group>
      <Text c="dimmed" mb="xl">Here's where you're at.</Text>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
        {stats.map((s) => (
          <Card key={s.label} withBorder padding="lg" radius="md">
            <Text size="sm" c="dimmed">{s.label}</Text>
            <Text size="xl" fw={700}>{s.value}</Text>
          </Card>
        ))}
      </SimpleGrid>

      <Group grow align="stretch">
        <Card
          component={Link}
          to="/challenges"
          withBorder
          padding="lg"
          radius="md"
          style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          className="hover-card"
        >
          <Title order={4} mb="xs">Challenges</Title>
          <Text c="dimmed" size="sm">Browse all challenges →</Text>
        </Card>
        <Card
          component={Link}
          to="/leaderboard"
          withBorder
          padding="lg"
          radius="md"
          style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          className="hover-card"
        >
          <Title order={4} mb="xs">Leaderboard</Title>
          <Text c="dimmed" size="sm">See top players →</Text>
        </Card>
      </Group>
    </Container>
  );
}