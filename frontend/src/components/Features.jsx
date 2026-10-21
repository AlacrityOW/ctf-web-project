import { Link } from 'react-router-dom';
import { Container, SimpleGrid, Card, Title, Text } from '@mantine/core';

const features = [
  {
    title: 'Challenges',
    description: 'Bite-sized security problems organized by topic and difficulty. Find the flag, learn the concept.',
    link: '/challenges',
  },
  {
    title: 'Leaderboard',
    description: 'See how you rank against other students and schools as you solve challenges.',
    link: '/leaderboard',
  },
  {
    title: 'For Schools',
    description: 'Register with your school or university and compete as part of your institution.',
    link: null,
  },
];

export default function Features() {
  return (
    <Container size="lg" py={60}>
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
        {features.map((f) => (
          <Card
            key={f.title}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            {...(f.link
              ? {
                  component: Link,
                  to: f.link,
                  style: { textDecoration: 'none', color: 'inherit', cursor: 'pointer' },
                  className: 'hover-card',
                }
              : {})}
          >
            <Title order={3} size="h4" mb="xs">{f.title}</Title>
            <Text c="dimmed" size="sm">{f.description}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}