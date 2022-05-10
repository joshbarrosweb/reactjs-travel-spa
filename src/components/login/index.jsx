import { useState, useRef } from "react";

import RoomIcon from "@mui/icons-material/Room";
import CancelIcon from "@mui/icons-material/Cancel";

import "./styles.css";
import axios from "axios";

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
  const [failure, setFailure] = useState(false);

  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const response = await axios.post("/users/login", user);
      myStorage.setItem("user", response.data.username);
      setCurrentUser(response.data.username);
      setShowLogin(false);
      setFailure(false);
    } catch (error) {
      setFailure(true);
    }
  };

  return (
    <>
      <div className="loginContainer">
        <div className="logo">
          <RoomIcon />
          JoshMap
        </div>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="username" ref={usernameRef} />
          <input type="password" placeholder="password" ref={passwordRef} />
          <button className="loginButton">Login</button>
          {failure && (
            <span className="failure">Failed. Something went wrong...</span>
          )}
        </form>
        <CancelIcon
          className="loginCancel"
          onClick={() => setShowLogin(false)}
        />
      </div>
    </>
  );
};

export default Login;
