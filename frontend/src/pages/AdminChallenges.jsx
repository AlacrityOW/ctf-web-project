import { useState, useEffect } from 'react';
import {
  Container, Title, Text, Table, Button, Modal, TextInput, Select, NumberInput, Stack, Group, Badge, Progress, FileInput
} from '@mantine/core';
import api from '../api/axios'
import { useNavigate } from 'react-router-dom';

const difficultyColor = { Easy: 'green', Medium: 'yellow', Hard: 'red' };

export default function AdminChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [progress, setProgress] = useState(0);
  const [opened, setOpened] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', difficulty: '', points: 50, flag: ''});
  const navigate = useNavigate();

  useEffect(() => {
    const getChallenges = async () => {
      const response = await api.get("/api/ctf-challenges");
      setChallenges(response.data);
    };

    getChallenges();
  }, [refreshTrigger]);

  const handleAdd = async (event) => {
    try {
      setForm({ title: '', category: '', difficulty: '', points: 50 ,flag : ''});
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('data',JSON.stringify(form));
  
      setIsUploading(true);
      // setProgress(0);
      console.log(form)
      const res = await api.post("/api/ctf-challenges/create",formData,{
        onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            if (total) {
              // Calculate the percentage
              const percentage = Math.round((loaded * 100) / total);
              setProgress(percentage);
            }
          }
      })
      if(res.data.success){
        setRefreshTrigger(prev => !prev)
        setFile(null)
        setTimeout(()=>{
          setProgress(0)
        },500)
        setTimeout(()=>{
          setOpened(false);
        },1000)
        // alert('Successfully added')
      }
    } catch (error) {
      console.log(error)
      setFile(null)
      setProgress(0)
    }
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
            <Table.Tr key={i} onClick={()=>navigate(`/admin/challenges/${c._id}`)}>
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
          
          <TextInput
            label="Flag"
            placeholder="Put Flag Here"
            value={form.flag}
            onChange={(e) => setForm({ ...form, flag: e.target.value })}
          />
          <FileInput
            label="Upload resume"
            placeholder="Pick file"
            value={file}
            onChange={setFile}
            accept="application/pdf"
            clearable
          />
          <Progress value={progress}/>
          <Button onClick={handleAdd} mt="sm">Add</Button>
        </Stack>
      </Modal>
    </Container>
  );
}