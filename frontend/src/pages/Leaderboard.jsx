import { Container, Title, Text, Table, Badge, Group, Avatar } from '@mantine/core';
import { useEffect,useState } from 'react';
import api from '../api/axios'

// const players = [
//   { rank: 1, name: 'Warner Brother', school: 'berklee film school', points: 1250 },
//   { rank: 2, name: 'John Airline', school: 'Stoke on Trent Airline Highschool', points: 1180 },
//   { rank: 3, name: 'Lady Math', school: 'Oxford math department', points: 1050 },
//   { rank: 4, name: 'John Pork', school: 'SMA Negeri 5', points: 980 },
//   { rank: 5, name: 'Sugaraagcha Byambasuren', school: 'Ulaan Bataar School for athletes', points: 875 },
//   { rank: 6, name: 'Vsundhara Kripalani', school: 'New Dehli Middle School 1', points: 810 },
// ];

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(()=>{
    const getPlayer = async () =>{
      const response = await api.get("/api/auth/user-list")
      const sorted = [...response.data].sort((a,b)=>b.totalPoints - a.totalPoints)
      setPlayers(sorted)
    }
    getPlayer()
  },[])

  return (
    <Container size="md" py={60}>
      <Title order={2} mb="xs">Leaderboard</Title>
      <Text c="dimmed" mb="xl">Top players across all schools.</Text>

      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Rank</Table.Th>
            <Table.Th>Player</Table.Th>
            <Table.Th>School</Table.Th>
            <Table.Th>Points</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {players.map((p,index) => (
            <Table.Tr key={index+1}>
              <Table.Td>
                {index+1 <= 3 ? (
                  <Badge color={index+1 === 1 ? 'yellow' : index+1 === 2 ? 'gray' : 'orange'}>
                    #{index+1}
                  </Badge>
                ) : (
                  <Text>#{index+1}</Text>
                )}
              </Table.Td>
              <Table.Td>
                <Group gap="sm">
                  <Avatar radius="xl" size="sm" />
                  <Text fw={500}>{p.username}</Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Text c="dimmed" size="sm">{p.school}</Text>
              </Table.Td>
              <Table.Td>
                <Text fw={700}>{p.totalPoints}</Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  );
}