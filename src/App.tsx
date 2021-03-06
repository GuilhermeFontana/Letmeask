import { BrowserRouter, Route, Switch } from  'react-router-dom'

import { AuthContextProvider } from './contexts/AuthContexts';

import { AdminRoom } from './pages/AdminRoom';
import { Home } from "./pages/Home";
import { AdminHome } from "./pages/AdminHome";
import { Room } from './pages/Room';

function App() {

  return (
      <BrowserRouter forceRefresh>
        <AuthContextProvider>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/rooms/:id" component={Room}></Route>
            
            <Route path="/admin/rooms" exact component={AdminHome} />
            <Route path="/admin/rooms/:id" component={AdminRoom}></Route>
          </Switch>
        </AuthContextProvider>
      </BrowserRouter>
  );
}

export default App;