import { useEffect, useState } from 'react';
import { Text, Button, TextInput } from '@mantine/core'
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import { Container, Title } from '@mantine/core';

// 2. The Page Component simply consumes the data
export default function challengePage() {
    const [challenge, setChallenge] = useState([])
    const [loading, setLoading] = useState(true)
    const {id} = useParams();
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
            const resp = await api.get(`/api/ctf-challenges/${id}`)
            setChallenge(resp.data)
            setLoading(false)
        }
        getPage();
    },[])

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
            console.log(res)
            const conType = res.headers['content-type']
            const cDis = res.headers['content-disposition']

            const fblob = new Blob([res.data], { type: conType});
            const blobUrl = window.URL.createObjectURL(fblob);
            
            let fileName = cDis?.match(/filename="?([^"]+)"?/)?.[1] || challenge.title
            const exten = EXTENSION_MAP[conType] || ''
            if(exten && !fileName.endsWith(exten)){
                fileName += exten
            }

            // 3. Create a hidden HTML link element in memory
            const tempLink = document.createElement('a');
            tempLink.href = blobUrl;
            
            // 4. Force the filename you want the browser to show
            tempLink.setAttribute('download', fileName); 
            
            // 5. Append it, simulate a user clicking it, and immediately delete it
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            
            // 6. Free up browser memory by revoking the temporary URL
            window.URL.revokeObjectURL(blobUrl);
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    if(loading) return <div>Loading . .</div>
    if(!challenge) return <div>No Data</div>
    return (
        <Container size="lg" py={60}>
            <Title mb="xs">{challenge.title}</Title>
            <Text size="lg" c="dimmed" mb="md">{challenge.category}</Text>
            <Text>{challenge.difficulty}</Text>
            <TextInput mb={20} value={answer} onChange={(e)=>setAnswer(e.target.value)}></TextInput>
            <Button mb={20} onClick={ansCheck} disabled={answer.trim()===''}>Submit</Button>
            <Button variant="light" onClick={getFile} fullWidth component='a'>Download</Button>
            {/* {console.log(answer)} */}
        </Container>
    );
}