import { Container, Title, Text, Group, Button, Stack } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <Container size="md" py={80}>
      <Stack align="center" ta="center" gap="md">
        <Title order={1} size={42}>
          Cybersecurity practice map.
        </Title>
        <Text size="lg" c="dimmed" maw={600}>
          Practice Capture the Flag challenges built for high school students.
          No experience needed.
        </Text>
        <Group mt="md">
          <Button size="md" component={Link} to="/register">Sign Up Free</Button>
          <Button size="md" variant="outline">Explore Challenges</Button>
        </Group>
      </Stack>
    </Container>
  );
}