import { useState, useRef } from "react";

import RoomIcon from "@mui/icons-material/Room";
import CancelIcon from "@mui/icons-material/Cancel";

import "./styles.css";
import axios from "axios";

const Register = ({ setShowRegister }) => {
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/register", newUser);
      setFailure(false);
      setSuccess(true);
    } catch (error) {
      setFailure(true);
    }
  };

  return (
    <>
      <div className="registerContainer">
        <div className="logo">
          <RoomIcon />
          JoshMap
        </div>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="username" ref={usernameRef} />
          <input type="email" placeholder="email" ref={emailRef} />
          <input type="password" placeholder="password" ref={passwordRef} />
          <button className="registerButton">Register</button>
          {success && (
            <span className="success">Sucessful. You can login now!</span>
          )}
          {failure && (
            <span className="failure">Failed. Something went wrong...</span>
          )}
        </form>
        <CancelIcon
          className="registerCancel"
          onClick={() => setShowRegister(false)}
        />
      </div>
    </>
  );
};

export default Register;
