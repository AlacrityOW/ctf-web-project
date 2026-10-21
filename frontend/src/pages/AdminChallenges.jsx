import { useState } from 'react';
import {
  Container, Title, Text, Table, Button, Modal, TextInput, Select, NumberInput, Stack, Group, Badge,
} from '@mantine/core';

const initialChallenges = [
  { title: "Baby's First Web", category: 'Web Exploitation', difficulty: 'Easy', points: 50 },
  { title: "Caesar's Secret", category: 'Cryptography', difficulty: 'Easy', points: 50 },
];

const difficultyColor = { Easy: 'green', Medium: 'yellow', Hard: 'red' };

export default function AdminChallenges() {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [opened, setOpened] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', difficulty: '', points: 50 });

  const handleAdd = () => {
    setChallenges((prev) => [...prev, form]);
    setForm({ title: '', category: '', difficulty: '', points: 50 });
    setOpened(false);
  };

  return (
    <Container size="lg" py={60}>
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Manage Challenges</Title>
          <Text c="dimmed">Add or review challenge metadata.</Text>
        </div>
        <Button onClick={() => setOpened(true)}>Add Challenge</Button>
      </Group>

      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Difficulty</Table.Th>
            <Table.Th>Points</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {challenges.map((c, i) => (
            <Table.Tr key={i}>
              <Table.Td>{c.title}</Table.Td>
              <Table.Td>{c.category}</Table.Td>
              <Table.Td>
                <Badge color={difficultyColor[c.difficulty]} variant="light">{c.difficulty}</Badge>
              </Table.Td>
              <Table.Td>{c.points}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Add Challenge">
        <Stack>
          <TextInput
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextInput
            label="Category"
            placeholder="e.g. Web Exploitation"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <Select
            label="Difficulty"
            data={['Easy', 'Medium', 'Hard']}
            value={form.difficulty}
            onChange={(val) => setForm({ ...form, difficulty: val })}
          />
          <NumberInput
            label="Points"
            value={form.points}
            onChange={(val) => setForm({ ...form, points: val })}
          />
          <Button onClick={handleAdd} mt="sm">Add</Button>
        </Stack>
      </Modal>
    </Container>
  );
}