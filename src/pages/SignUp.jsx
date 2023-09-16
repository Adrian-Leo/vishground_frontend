import React, { useState } from "react";
import { Link, redirect } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter, Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import axios from "axios";

const SignUp = () => {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSignUp = async () => {
    console.log("Sign-up user:", user);
    try {
      const { data } = await axios.post("http://localhost:3333/auth/signup", {
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        pass: user.password,
      });

      console.log("Sign-up response:", data);
      if (data.success) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <>
      <img src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80" className="absolute inset-0 z-0 h-full w-full object-cover" />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader variant="gradient" className="mb-4 grid h-28 place-items-center bg-purple-light">
            <Typography variant="h3" color="white">
              Sign Up
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input type="text" label="Name" size="lg" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
            <Input type="text" label="Username" size="lg" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
            <Input type="email" label="Email" size="lg" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
            <Input type="password" label="Password" size="lg" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
            <div className="-ml-2.5">
              <Checkbox label="I agree the Terms and Conditions" />
            </div>
          </CardBody>
          <CardFooter className="flex flex-col pt-0 items-center">
            <div className="items-center w-full">
              <Button className="w-full bg-purple-dark text-white text-md" onClick={handleSignUp}>
                Sign Up
              </Button>
            </div>
            <div className="block">
              <Typography variant="small" className="mt-6 flex justify-center">
                Already have an account?
                <Link to="/">
                  <Typography as="span" variant="small" className="ml-1 font-bold">
                    Sign in
                  </Typography>
                </Link>
              </Typography>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default SignUp;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Card, CardHeader, CardBody, CardFooter, Input, Checkbox, Button, Typography } from "@material-tailwind/react";
// import axios from "axios";

// const SignUp = () => {
//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const handleGoogleLoginSuccess = async (response) => {
//     console.log("Google login response:", response);
//     try {
//       const { data } = await axios.post("http://localhost:3333/auth/google", { token: response.accessToken });

//       console.log("Backend response:", data);
//     } catch (error) {
//       console.error("Error sending Google login response to the backend:", error);
//     }
//   };

//   const handleSignUp = async () => {
//     try {
//       const { data } = await axios.post("/signup", user);

//       console.log("Sign-up response:", data);
//     } catch (error) {
//       console.error("Error signing up:", error);
//     }
//   };

//   const handleGoogleLoginClick = () => {};

//   return (
//     <>
//       <img src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80" className="absolute inset-0 z-0 h-full w-full object-cover" />
//       <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
//       <div className="container mx-auto p-4">
//         <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
//           <CardHeader variant="gradient" className="mb-4 grid h-28 place-items-center bg-purple-light">
//             <Typography variant="h3" color="white">
//               Sign Up
//             </Typography>
//           </CardHeader>
//           <CardBody className="flex flex-col gap-4">
//             <Input label="Name" size="lg" />
//             <Input type="text" label="Username" size="lg" />
//             <Input type="email" label="Email" size="lg" />
//             <Input type="password" label="Password" size="lg" />
//             <div className="-ml-2.5">
//               <Checkbox label="I agree the Terms and Conditions" />
//             </div>

//             <Button className="bg-blue-500 hover:bg-blue-700 text-white" onClick={handleGoogleLoginSuccess}>
//               Login with Google
//             </Button>
//           </CardBody>
//           <CardFooter className="flex flex-col pt-0 items-center">
//             <div className="items-center w-full">
//               <Button className="w-full bg-purple-dark text-white text-md" onClick={handleSignUp}>
//                 Sign Up
//               </Button>
//             </div>
//             <div className="block">
//               <Typography variant="small" className="mt-6 flex justify-center">
//                 Already have an account?
//                 <Link to="/">
//                   <Typography as="span" variant="small" className="ml-1 font-bold">
//                     Sign in
//                   </Typography>
//                 </Link>
//               </Typography>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </>
//   );
// };

// export default SignUp;
