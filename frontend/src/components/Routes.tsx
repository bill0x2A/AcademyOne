import { Routes as Switch, Route } from 'react-router';
import Home from './pages/Home';

const Routes: React.FC = () => (
    <Switch>
        <Route path={'/'}>
            <Home/>
        </Route>
    </Switch>
);

export default Routes;
