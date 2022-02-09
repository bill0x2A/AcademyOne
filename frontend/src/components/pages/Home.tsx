import * as React from 'react';
import { useContract } from 'src/context/Contract';
import { useAddress } from 'src/context/Address';

const Home: React.FC = () => {
    const contract = useContract();
    const address = useAddress();
    console.dir(contract);
    return <div>Address: {address}</div>;
};

export default Home;
