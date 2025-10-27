import React, {useState} from 'react';
import axios from 'axios';
const Backend_URL = 'http://localhost:5000/api/auth';
const Auth = ({ setToken, setIsLoggedIn }) => {
    const [isRegister , setIsRegister ]=useState(false);
    const [credentials, setCrendentials] = useState({ email: ",password:"});
    const [message, setMessage] = useState('');
    const handleChange = (e) =>{
        setCrendentials({...credentials, [e.target.name]: e.target.value});
    };
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const endpoint = isRegister ? 'register' : 'login';
        try{
            const res = await axios.post(`${BACKEND_URL}/${endpoint}`, credentials);
            setMessage(res.data.msg || 'Success!');
            if(!isRegister && res.data.token){
                localStorage.setItem('token',res.data.token);
                setToken(res.data.token);
                setIsLoggedIn(true);
            }
        } catch (err){
            const errorMsg = err.response?.data?.msg || 'An error occurred';
            setMessage(errorMsg);
        }
        };
        return(
            <div className="auth-container">
                <h2>{isRegister ? 'Sign up' : 'Log In'}</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                         type="email"
                         name="email"
                         placeholder="Email"
                         onChange={handleChange}
                         required
                         />
                         <input
                           type="password"
                           name="password"
                           placeholder="Password"
                           onChange={handleChange}
                           required
                           />
                           <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
                           </form> 
                           <p>{message}</p>
                           <button onClick={() => setIsRegister(!isRegister)}>
                            {isRegister ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
                            </button> 
                             </div>
        );
    };
    export default Auth;

