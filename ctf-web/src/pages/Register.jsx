import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Title, TextInput, PasswordInput, Select, Button, Stack,
} from '@mantine/core';
import { useAuth } from '../context/AuthContext';
// import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    school: '',
    username: '',
    password: '',
    email: '',
    gender: '',
    ageGroup: '',
    region: '',
    playerType: '',
  });

  const update = (field) => (value) => {
    const val = value && value.target ? value.target.value : value;
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(form);
    console.log(success)
    navigate('/login');
  };

  return (
    <Container size={460} py={60}>
      <Title order={2} ta="center" mb="lg">Create your account</Title>
      <Paper withBorder shadow="sm" p="lg" radius="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="sm">
            <TextInput
              label="School / University Name"
              placeholder="e.g. SMA Negeri 1"
              required
              value={form.school}
              onChange={update('school')}
            />
            <TextInput
              label="Username"
              required
              value={form.username}
              onChange={update('username')}
            />
            <TextInput
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={update('email')}
            />
            <PasswordInput
              label="Password"
              required
              value={form.password}
              onChange={update('password')}
            />
            <Select
              label="Gender"
              placeholder="Select one"
              required
              data={['Male', 'Female', 'Prefer not to say']}
              value={form.gender}
              onChange={update('gender')}
            />
            <Select
              label="Age Group"
              placeholder="Select one"
              required
              data={['13-15', '16-18', '19+']}
              value={form.ageGroup}
              onChange={update('ageGroup')}
            />
            <TextInput
              label="Region"
              placeholder="e.g. Jakarta"
              required
              value={form.region}
              onChange={update('region')}
            />
            <Select
              label="I am a..."
              placeholder="Select one"
              required
              data={['High School Student', 'University Student', 'Instructor / Teacher']}
              value={form.playerType}
              onChange={update('playerType')}
            />
            <Button type="submit" fullWidth mt="md">
              Sign Up
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}