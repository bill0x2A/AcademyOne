import { useState } from 'react';
import {
    Button,
    Center,
    Text,
    Image,
    Flex,
} from '@chakra-ui/react';
import { usePrevious } from '../../../hooks';
import StorageClient from '../../web3/StorageClient';
import { create } from 'ipfs-http-client'

const client = create({url: 'https://ipfs.infura.io:5001/api/v0'});

interface ImageUploaderProps {
    setImageURL: (imageURL: string) => void;
    imageURL: string | undefined;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    setImageURL,
    imageURL,
}: ImageUploaderProps) => {
    const [data, setData] = useState<ArrayBuffer | string | null | undefined>(null);
    const [err, setErr] = useState<string | boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploadingToIPFS, setIsUploadingToIPFS] = useState<boolean>(false);
    const wasUploadingToIPFS = usePrevious(isUploadingToIPFS);
    const successfullyUploadedToIPFS = wasUploadingToIPFS && !!imageURL;

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
        setIsUploadingToIPFS(true);
        try {
            if(!file) return;
            const added = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            console.log(url);
            setImageURL(url)
          } catch (error) {
            console.log('Error uploading file: ', error)
          } 
        setIsUploadingToIPFS(false);
    }

    return (
        <>
            <Center
                border={'2px dashed'}
                py={100}
                onDragOver={e=> e.preventDefault()}
                onDrop={e => onDrop(e)}>
                    {(imageURL || data !== null) && <Image src={imageURL || data?.toString()}/>}
                    {( data === null && !imageURL )&& (
                        <Text>Drag and drop cover image</Text>
                    )}
            </Center> 
            {err && <Text>Unable to upload image</Text>}
            {data!==null && !successfullyUploadedToIPFS && (
                <Flex>
                    <Button onClick={()=>setData(null)}>Remove Image</Button>
                    <Button isLoading={isUploadingToIPFS} onClick={uploadImage}>Upload Image</Button>
                </Flex>
            )}
            {successfullyUploadedToIPFS && <Text>Successfully uploaded to IPFS!</Text>}
        </>
    )
}

export default ImageUploader;
