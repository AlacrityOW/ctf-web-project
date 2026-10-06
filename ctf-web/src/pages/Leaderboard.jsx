import { Container, Title, Text, Table, Badge, Group, Avatar } from '@mantine/core';

const players = [
  { rank: 1, name: 'Warner Brother', school: 'berklee film school', points: 1250 },
  { rank: 2, name: 'John Airline', school: 'Stoke on Trent Airline Highschool', points: 1180 },
  { rank: 3, name: 'Lady Math', school: 'Oxford math department', points: 1050 },
  { rank: 4, name: 'John Pork', school: 'SMA Negeri 5', points: 980 },
  { rank: 5, name: 'Sugaraagcha Byambasuren', school: 'Ulaan Bataar School for athletes', points: 875 },
  { rank: 6, name: 'Vsundhara Kripalani', school: 'New Dehli Middle School 1', points: 810 },
];

export default function Leaderboard() {
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
          {players.map((p) => (
            <Table.Tr key={p.rank}>
              <Table.Td>
                {p.rank <= 3 ? (
                  <Badge color={p.rank === 1 ? 'yellow' : p.rank === 2 ? 'gray' : 'orange'}>
                    #{p.rank}
                  </Badge>
                ) : (
                  <Text>#{p.rank}</Text>
                )}
              </Table.Td>
              <Table.Td>
                <Group gap="sm">
                  <Avatar radius="xl" size="sm" />
                  <Text fw={500}>{p.name}</Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Text c="dimmed" size="sm">{p.school}</Text>
              </Table.Td>
              <Table.Td>
                <Text fw={700}>{p.points}</Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  );
}