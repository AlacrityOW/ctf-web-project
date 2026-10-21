import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Paper, Title, TextInput, PasswordInput, Button, Stack, Text, Anchor,
} from '@mantine/core';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Login attempt:', { username, password });
    const success = await login(username,password);
    console.log(success)
    if(success){
      navigate('/dashboard');
    }
    
  };

  return (
    <Container size={420} py={80}>
      <Title order={2} ta="center" mb="lg">Welcome back</Title>
      <Paper withBorder shadow="sm" p="lg" radius="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="sm">
            <TextInput
              label="Username or Email"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <PasswordInput
              label="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth mt="md">
              Log In
            </Button>
          </Stack>
        </form>
        <Text ta="center" size="sm" mt="md">
          Don't have an account?{' '}
          <Anchor component={Link} to="/register">Sign up</Anchor>
        </Text>
      </Paper>
    </Container>
  );
}