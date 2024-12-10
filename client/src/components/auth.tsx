"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [mobileNumber, setMobileNumber] = useState("");
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateMobile = (mobile: string) => {
    return /^\d{10}$/.test(mobile);  // Check if the mobile number has 10 digits
  };

  const validatePassword = (password: string) => {
    return password.length >= 6; // Check if password is at least 6 characters long
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
    setIsAdmin(value === "admin");
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      alert("Please enter a valid email.");
      return;
    }

    if (!validateMobile(mobileNumber)) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
        role,
        mobileNumber,
        shopName,
        address,
      });
      const { token, user } = response.data;
      localStorage.setItem("token", token);

      if (user.role === "student") {
        navigate("/student");
      } else if (user.role === "admin") {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);

      if (user.role === "student") {
        navigate("/student");
      } else if (user.role === "admin") {
        navigate("/admin");
      }
    } catch (error) {
      setLoginError("Login failed. Please check your credentials.");
      console.error("Login failed", error);
    }
  };

  return (
    <div style={{
      backgroundImage: "url('/Hero2.jpeg')",

      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }} className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {loginError && (
                  <p className="text-red-500 text-sm">{loginError}</p>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Choose a password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-role">Role</Label>
                  <Select onValueChange={handleRoleChange} value={role}>
                    <SelectTrigger id="register-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-mobile">Mobile Number</Label>
                  <Input
                    id="register-mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
                {isAdmin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="register-shop-name">Shop Name</Label>
                      <Input
                        id="register-shop-name"
                        placeholder="Enter your shop name"
                        required
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-address">Address</Label>
                      <Input
                        id="register-address"
                        placeholder="Enter your address"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
