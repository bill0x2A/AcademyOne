import * as React from 'react';
import { useSigner } from '../../../context/Signer';
import {
    Container,
    Heading,
    Textarea,
    Input,
    FormLabel,
    FormControl,
    FormHelperText,
} from '@chakra-ui/react';
import FileUpload from './FileUpload';
import { useNavigate } from 'react-router';

const Create: React.FC = () => {

    const [title, setTitle] = React.useState<string>();
    const [desc, setDesc] = React.useState<string>();

    const navigate = useNavigate();
    const signer = useSigner();

    React.useEffect(() => {
        if (!signer) {
            navigate('/');
        }
    }, [signer, navigate]);

    const handleChange = (
        setter: React.Dispatch<React.SetStateAction<string | undefined>>,
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setter(event.target.value);
    }

    return <Container maxW={'1280px'} pb={20}>
        <Heading my={6}>Create a new course</Heading>
        <br/>
        <FormControl my={8}>
            <FormLabel htmlFor={'name'}>Course name</FormLabel>
            <Input
                id={'name'}
                background={'white'}
                color={'black'}
                placeholder={'Course name'}
                value={title}
                onChange={(e) => handleChange(setTitle, e)}/>
                <FormHelperText>Make it good, this is the first thing everyone will see!</FormHelperText>
        </FormControl>
        <FormControl my={8}>
            <FormLabel htmlFor={'description'}>Description</FormLabel>
            <Textarea
                background={'white'}
                color={'black'}
                placeholder={'Course description'}
                value={desc}
                onChange={(e) => handleChange(setDesc, e)}/>
                <FormHelperText>Add a short description of this course so students know what they're getting into!</FormHelperText>
        </FormControl>
        <FileUpload/>
    </Container>
}

export default Create;