import kvlogo from "../../assets/TCP.svg";
import "./login.css";
import { useEffect, useRef, useState } from "react";
import { useLoginMutation } from "../../api_service/auth/login.api";
import { useNavigate } from "react-router";
import getUserIdFromToken from "../../utils/getUserIDfromToken";

function Login() {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const emailError = (email: string) =>
    email && !email.includes("@") ? "Must contain @" : null;
  const pwError = (pw: string) =>
    pw && pw.length < 8 ? "Must be longer than 8 characters" : null;
  const navigate = useNavigate();
  const usernameInputRef = useRef<HTMLInputElement | null>(null);

  const [login, { isLoading }] = useLoginMutation();
  const onLogin = async () => {
    login({ username: username, password: pw }) 
      .unwrap()
      .then((response) => {
        localStorage.clear()
        localStorage.setItem("token", response.access_token);
        const user = getUserIdFromToken(response.access_token);
        if (!user) {
          return "Token decoding failed";
        }
        const { role } = user;
        if (role === "HR") {
          navigate("/hr");
        } else if (role === "Employee") {
          navigate("/employee");
        } else {
          setError("Unknown user role");
        }
      })
      .catch((error) => {
        const serverMessage =
          error?.data?.detail ||
          "An unexpected error occurred. Please try again.";
        console.log(error);
        setError(serverMessage);
      });
  };

  useEffect(() => {
    usernameInputRef.current?.focus();
  }, []);

  return (
    <div className="login-page">
      <div className="form_container">
        <div className="login-card">
          <div className="branding"><img src={kvlogo}></img>
          <span>TalentCycle Pro</span></div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
            className="login-field"
          >
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              ref={usernameInputRef}
            />
            {emailError(username) && <span>{emailError(username)}</span>}
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            {pwError(pw) && <span>{pwError(pw)}</span>}
            <button className="login-button" disabled={isLoading || !!emailError(username)} >Login</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
