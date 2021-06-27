
import './App.css';
import { Home } from './Pages/Home';
import { NewRoom } from './Pages/NewRoom';
import './styles/global.scss';
import {Route, BrowserRouter, Switch} from 'react-router-dom';
import { AdminRoom } from './Pages/AdminRoom';
import {AuthContextProvider} from './Contexts/AuthContexts';
import { Room } from './Pages/Room';



function App() {

  
  return (
    <BrowserRouter> 
      <AuthContextProvider>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/rooms/new" component={NewRoom}/>
          <Route exact path="/rooms/:id" component={Room}/>
          <Route exact path="/rooms/Admin/Room/:id" component={AdminRoom}/>
        </Switch>     
      </AuthContextProvider>
    </BrowserRouter>
    
  );
}

export default App;
