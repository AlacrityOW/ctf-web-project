import { Group, Button, Container, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <Container size="lg" py="md">
      <Group justify="space-between">
        <Text
          size="xl"
          fw={700}
          component={Link}
          to="/"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          CTF Academy
        </Text>
        <Group>
          <Button variant="subtle" component={Link} to="/login">Log In</Button>
          <Button component={Link} to="/register">Sign Up</Button>
        </Group>
      </Group>
    </Container>
  );
}