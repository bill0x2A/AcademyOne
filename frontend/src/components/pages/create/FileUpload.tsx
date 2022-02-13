import { useState } from 'react';
import {
    Button,
    Box,
    Text,
    Image,
    Flex,
} from '@chakra-ui/react';
import StorageClient from '../../web3/StorageClient';

const DropArea: React.FC = () => {
    const [data, setData] = useState<ArrayBuffer | string | null | undefined>(null);
    const [err, setErr] = useState<string | boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [imageURI, setImageURI] = useState<string | null>(null);

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const {
            dataTransfer: { files }
        } = e;
        const { length } = files;
        const reader = new FileReader();
        if (length === 0) {
            return false;
        }
        const fileTypes = ["image/jpeg", "image/jpg", "image/png"];
        const { size, type } = files[0];
        setData(null);
        // Limit to either image/jpeg, image/jpg or image/png file
        if (!fileTypes.includes(type)) {
            setErr("File format must be either png or jpg");
            return false;
        }
        // Check file size to ensure it is less than 8MB.
        if (size / 1024 / 1024 > 8) {
            setErr("File size exceeded the limit of 8MB");
            return false;
        }
        setErr(false);

        reader.readAsDataURL(files[0]);
        setFile(files[0])
        reader.onload = loadEvt => {
            setData(loadEvt.target?.result);
        };
    }

    const uploadImage = async () => {
        const newImageURI = await new StorageClient().storeFiles(file);
        console.log(newImageURI);
        setImageURI(newImageURI);
    }

    return (
        <>
            <Box 
                onDragOver={e=> e.preventDefault()}
                onDrop={e => onDrop(e)}>
                    {data !== null && <Image src={data?.toString()}/>}
                    {data === null && (
                        <Text>Drag and drop image</Text>
                    )}
            </Box> 
            {err && <Text>Unable to upload image</Text>}
            {data!==null && (
                <Flex>
                    <Button onClick={()=>setData(null)}>Remove Image</Button>
                    <Button onClick={uploadImage}>Upload Image</Button>
                </Flex>
            )}
        </>
    )
}

export default DropArea;
