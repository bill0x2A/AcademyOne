import * as React from 'react';
import { useSigner } from '../../../context/Signer';
import {
    Container,
    Heading,
    Button,
} from '@chakra-ui/react';
import GeneralInformation from './GeneralInformation';
import AddModules from './AddModules';
import { useNavigate } from 'react-router';

const Create: React.FC = () => {

    const [title, setTitle] = React.useState<string>();
    const [description, setDescription] = React.useState<string>();
    const [imageURL, setImageURL] = React.useState<string>();
    const [stage, setStage] = React.useState<number>(0);

    const shouldAllowNavigationToStage2 = stage === 0 && !!description && !!title // && !!imageURL;
    const shouldShowBackButton = stage > 0;

    const navigate = useNavigate();
    const signer = useSigner();

    // If there is no signer the user has not connected their wallet
    // Redirect them to the homepage if this is the case
    React.useEffect(() => {
        if (!signer) {
            navigate('/');
        }
    }, [signer, navigate]);

    const handleSetTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }

    const handleSetDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }

    let subpage;

    switch(stage) {
        case 0:
            subpage = <GeneralInformation
                title={title}
                description={description}
                imageURL={imageURL}
                handleSetTitle={handleSetTitle}
                handleSetDescription={handleSetDescription}
                handleSetImageURL={setImageURL}/>;
            break;
        case 1:
            subpage = <AddModules/>
            break;
    }

    return <Container maxW={'1280px'} pb={20}>
            <Heading my={6}>Create a new course</Heading>
            <br/>
            {subpage}
            <br/>
            {shouldAllowNavigationToStage2 && <Button
                colorScheme={'purple'}
                onClick={() => setStage(1)}>
                Next</Button>}
            {shouldShowBackButton && <Button
                colorScheme={'red'}
                onClick={() => setStage((stage) => stage - 1)}>
                Back</Button>}
    </Container>

}

export default Create;