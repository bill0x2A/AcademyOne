import * as React from 'react';
import {
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    Textarea,
} from '@chakra-ui/react';
import ImageUploader from './ImageUploader';

interface GeneralInformationProps {
    title: string | undefined;
    description: string | undefined;
    imageURL: string | undefined;
    handleSetTitle: React.ChangeEventHandler<HTMLInputElement>
    handleSetDescription: React.ChangeEventHandler<HTMLTextAreaElement>
    handleSetImageURL: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const GeneralInformation: React.FC<GeneralInformationProps> = ({
    title,
    description,
    imageURL,
    handleSetImageURL,
    handleSetTitle,
    handleSetDescription,
}: GeneralInformationProps) => (<>
    <FormControl my={8}>
            <FormLabel htmlFor={'name'}>Course name</FormLabel>
            <Input
                id={'name'}
                background={'white'}
                color={'black'}
                placeholder={'Course name'}
                value={title}
                onChange={handleSetTitle}/>
                <FormHelperText>Make it good, this is the first thing everyone will see!</FormHelperText>
        </FormControl>
        <FormControl my={8}>
            <FormLabel htmlFor={'description'}>Description</FormLabel>
            <Textarea
                id={'description'}
                background={'white'}
                color={'black'}
                placeholder={'Course description'}
                value={description}
                onChange={handleSetDescription}/>
                <FormHelperText>Add a short description of this course so students know what they're getting into!</FormHelperText>
        </FormControl>
        <ImageUploader setImageURL={handleSetImageURL} imageURL={imageURL}/>
    </>
);

export default GeneralInformation;
