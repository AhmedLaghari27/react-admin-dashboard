import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthenticationTitle } from '../Frontend/src/pages/Login'; // adjust path as needed
import { ForgotPassword } from '../Frontend/src/pages/ForgotPassword'; // adjust path as needed
import { CreateAccount } from '../Frontend/src/pages/Signin'; // adjust path as needed
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthenticationTitle />} />
        <Route path="/login" element={<AuthenticationTitle />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<CreateAccount />} />
        {/* Add signup route when you create it */}
        {/* <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;