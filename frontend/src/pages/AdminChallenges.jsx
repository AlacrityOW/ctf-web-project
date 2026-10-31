import { useState, useEffect } from 'react';
import {
  Container, Title, Text, Table, Button, Modal, TextInput, Select, NumberInput, Stack, Group, Badge, Progress, FileInput, Pagination,
} from '@mantine/core';
import api from '../api/axios'
import { useNavigate, useSearchParams } from 'react-router-dom';

const difficultyColor = { Easy: 'green', Medium: 'yellow', Hard: 'red' };

export default function AdminChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [progress, setProgress] = useState(0);
  const [opened, setOpened] = useState(false);
  // const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', difficulty: '', points: 50, flag: ''});
  const navigate = useNavigate();

  const [totalPages, setTotalPages] = useState(1)
  const [searchParams, setSearchParams]=useSearchParams()
  const size = parseInt(searchParams.get("size")) || 10
  const page = parseInt(searchParams.get('page')) || 1
  const maxLimit = 15
  
  useEffect(() => {
    const getChallenges = async (page,viewSize) => {
      try {
        const response = await api.get("/api/ctf-challenges",{
          params:{
            page:page,
            viewSize:viewSize
          }
        });
        
        if(response.data.success){
          setTotalPages(response.data.totalPages)
          setChallenges(response.data.data);
        }
        
      } catch (error) {
        console.log(error)
      }
    };
    
    setSearchParams({page:page,size:size})
    getChallenges(page, size);
  }, [refreshTrigger, page, size]);

  const handleAdd = async (event) => {
    try {
      setForm({ title: '', category: '', difficulty: '', points: 50 ,flag : ''});
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('data',JSON.stringify(form));
  
      // setIsUploading(true);
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
      console.log(error.response.data)
      setFile(null)
      setProgress(0)
    }
  };
  const undoDelete = async (e) =>{
    try {
        const res = await api.patch(`/api/ctf-challenges/restore-challenge/${e}`)
        if(res.data.success){
          console.log(res.data.msg)
        }
        setRefreshTrigger(prev => !prev)
    } catch (error) {
        console.log(error.response.data)
    }
  }
  const handleDelete = async (e) =>{
        try {
            const res = await api.patch(`/api/ctf-challenges/remove-challenge/${e}`)
            if(res.data.success){
              console.log(res.data.msg)
            }
            setRefreshTrigger(prev => !prev)
        } catch (error) {
            console.log(error.response.data)
        }
    }
  const handleSize = (num) =>{
      const val = Number(num)
      setSearchParams((prev)=>{
        if(!val || val<=0){
          prev.delete('size')
        }else{
          prev.set('size',String(val))
        }
        prev.set('page',1)
        return prev
      })
  }
  
  const handlePage = (num) =>{
      const val = Number(num)
      setSearchParams((prev)=>{
        prev.set('page', String(val))
        return prev
      })
  }
  return (
    
    <Container  size="lg" py={60} >
      <Stack mih="calc(100vh - 120px)" > 
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
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {challenges.map((c, i) => (
              <Table.Tr key={i} >
                <Table.Td onClick={()=>navigate(`/admin/challenges/${c._id}`)}>{c.title}</Table.Td>
                <Table.Td>{c.category}</Table.Td>
                <Table.Td>
                  <Badge color={difficultyColor[c.difficulty]} variant="light">{c.difficulty}</Badge>
                </Table.Td>
                <Table.Td>{c.points}</Table.Td>
                <Table.Td>
                  <Button onClick={c.isDeleted ? ()=>undoDelete(c._id) : ()=>handleDelete(c._id)}>{c.isDeleted ? 'Restore' : 'Delete'}</Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Modal opened={opened} onClose={() => setOpened(false)} title="Add Challenge">
          <Stack>
            <TextInput
              required
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextInput
              required
              label="Category"
              placeholder="e.g. Web Exploitation"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Select
              required
              label="Difficulty"
              data={['Easy', 'Medium', 'Hard']}
              value={form.difficulty}
              onChange={(val) => setForm({ ...form, difficulty: val })}
            />
            <NumberInput
              required
              label="Points"
              min={0}
              max={100}
              value={form.points}
              onChange={(val) => setForm({ ...form, points: val })}
            />
            
            <TextInput
              required
              label="Flag"
              placeholder="Put Flag Here"
              value={form.flag}
              onChange={(e) => setForm({ ...form, flag: e.target.value })}
            />
            <FileInput
              required
              label="Upload File"
              placeholder="Pick file"
              value={file}
              onChange={setFile}
              accept="*"
              clearable
            />
            <Progress value={progress}/>
            <Button onClick={handleAdd} mt="sm">Add</Button>
          </Stack>
        </Modal>
        <Pagination mx="auto"mt="auto" total={totalPages} value={page} onChange={handlePage} />
        <NumberInput mx="auto" w={100} min={1} max={maxLimit} onChange={handleSize} value={size}></NumberInput> 
        
      </Stack>
    </Container>
  );
}