import { useEffect, useState } from 'react';
import { Text, Button , TextInput, Modal, Stack, Select, NumberInput, FileInput, Progress} from '@mantine/core'
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import { Container, Title } from '@mantine/core';


export default function AdminChallengePage() {
    const [form, setForm] = useState({ title: '', category: '', difficulty: '', points: 0, flag: ''});
    const [file, setFile] = useState(null);
    const [opened, setOpened] = useState(false);
    const [progress, setProgress] = useState(0);

    
    const [challenge, setChallenge] = useState([])
    const [loading, setLoading] = useState(true)
    const {id} = useParams();
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [answer, setAnswer] = useState('')
    const EXTENSION_MAP = {
        'application/pdf': '.pdf',
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'application/zip': '.zip',
        'text/csv': '.csv',
    };

    useEffect(()=>{
        const getPage = async()=>{
            try {
                const resp = await api.get(`/api/ctf-challenges/${id}`)
                // console.log(resp)
                if(resp.data.success){
                    setChallenge(resp.data.chall)
                    setLoading(false)
                }
            } catch (error) {
                console.log(error.response.data)
            }
        }
        console.log('useeffect')
        getPage();
    },[refreshTrigger])
    const handleDelete = async () =>{
        try {
            const res = await api.patch(`/api/ctf-challenges/remove-challenge/${id}`)
            console.log(res.data.msg)
        } catch (error) {
            console.log(error.response.data)
        }
    }
    const handleUpdate = async() =>{
        try {
            setForm({ title: '', category: '', difficulty: '', points: 0 ,flag : ''});
  
            const formData = new FormData();
            formData.append('file', file);
            formData.append('data',JSON.stringify(form));
            const res = await api.patch(`/api/ctf-challenges/edit-challenge/${id}`,formData,{
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
                console.log(res.data.msg)
                setRefreshTrigger(prev => !prev)
                setFile(null)
                setTimeout(()=>{
                setProgress(0)
                },500)
                setTimeout(()=>{
                setOpened(false);
                },1000)
            }
        } catch (error) {
            console.log(error)
            setFile(null)
            setProgress(0)
        }
    }
    const ansCheck = async() =>{
        try {
            console.log("Ans :",challenge.flag)
            if(answer === challenge.flag){
                console.log("Correct Flag")
                const res = await api.patch(`/api/ctf-challenges/${id}/check-ans`,{answer:answer})
                // console.log(res.data.msg)
            }else{
                console.log("Wrong Flag")
            }
        } catch (error) {
            console.log(error.response.data)
        }
    }
    const getFile = async() =>{
        try {
            const res = await api.get(`/api/ctf-challenges/${id}/download`,{
                responseType: 'blob'
            })
            const conType = res.headers['content-type']
            const cDis = res.headers['content-disposition']

            const fblob = new Blob([res.data], { type: conType});
            const blobUrl = window.URL.createObjectURL(fblob);
            
            let fileName = cDis?.match(/filename="?([^"]+)"?/)?.[1] || challenge.title
            const exten = EXTENSION_MAP[conType] || ''
            if(exten && !fileName.endsWith(exten)){
                fileName += exten
            }

            const tempLink = document.createElement('a');
            tempLink.href = blobUrl;
            
            tempLink.setAttribute('download', fileName); 
            
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.log(error)
        }
    }

    if(loading) return <div>Loading . .</div>
    if(!challenge) return <div>No Data</div>
    return (
        <Container size="lg" py={60}>
            <Modal opened={opened} onClose={() => setOpened(false)} title="Update Challenge">
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
                          min={0}
                          max={100}
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
                          label="Upload File"
                          placeholder="Pick file"
                          value={file}
                          onChange={setFile}
                          accept="*"
                          clearable
                        />
                        <Progress value={progress}/>
                        <Button onClick={handleUpdate} mt="sm">Add</Button>
                      </Stack>
            </Modal>
            <Button mr={20} onClick={handleDelete}>Delete</Button>
            <Button onClick={() => setOpened(true)}>Update</Button>
            <Title mb="xs">{challenge.title}</Title>
            <Text size="lg" c="dimmed" mb="md">{challenge.category}</Text>
            <Text>{challenge.difficulty}</Text>
            <TextInput mb={20} value={answer} onChange={(e)=>setAnswer(e.target.value)}></TextInput>
            <Button mb={20} onClick={ansCheck} disabled={answer.trim()===''}>Submit</Button>
            <Button variant="light" onClick={getFile} fullWidth component='a'>Download</Button>
        </Container>
    );
}