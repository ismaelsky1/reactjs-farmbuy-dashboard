import Routes from './routes';
import {AuthProvider} from './contexts/auth';

import 'antd/dist/antd.css';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
