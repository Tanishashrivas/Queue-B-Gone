"use client";

import { useToast } from "@/components/toast/use-toast";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Admin {
  id: string;
  name: string;
  shopName: string;
}

interface PrintOption {
  type: "B/W" | "Color";
  cost: number;
}

const AdminDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [admin, setAdmin] = useState<Admin | null>(null);

  const navigate = useNavigate();
  const { addToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [printType, setPrintType] = useState<"B/W" | "Color">("B/W");
  const [totalCost, setTotalCost] = useState<number>(0);
  const token = localStorage.getItem('token');

  const printOptions: PrintOption[] = [
    { type: "B/W", cost: 0.1 },
    { type: "Color", cost: 0.5 },
  ];

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      calculateTotalCost(selectedFile, printType);
    }
  };

  const handlePrintTypeChange = (value: "B/W" | "Color") => {
    setPrintType(value);
    if (file) {
      calculateTotalCost(file, value);
    }
  };

  const calculateTotalCost = (file: File, type: "B/W" | "Color") => {
    const option = printOptions.find((opt) => opt.type === type);
    if (option) {
      const pages = Math.ceil(file.size / 1000); // Assuming 1 page per 1000 bytes
      setTotalCost(pages * option.cost);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) {
      addToast(
        "File Missing",
        "Please select a file to upload before proceeding.",
        "destructive"
      );
      return;
    }

    if (!admin) {
      addToast(
        "Admin Information Missing",
        "Unable to retrieve admin information. Please try again.",
        "destructive"
      );
      return;
    }

    addToast(
      "Processing...",
      "We are uploading your file and processing the payment.",
      "info"
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    addToast(
      "Payment Successful",
      `Your payment of $${totalCost.toFixed(
        2
      )} has been processed. Enjoy your print!`,
      "success"
    );

    navigate(
      `/payment-successful?adminId=${admin.id}&fileName=${
        file.name
      }&cost=${totalCost.toFixed(2)}`
    );
  };

  if (!admin) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="bg-red-600 text-white">
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-red-100">
            Admin information is missing
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p>Unable to load admin details. Please go back and try again.</p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => navigate(-1)}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    );
  }

  useEffect(() => {
    if (!id) return;  
    
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setAdmin(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        addToast("Error fetching admin data", "Error", "destructive");
      }
    };
    
    fetchAdminData();
  }, [id, token]);   

  console.log("admin details", admin)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle>{admin.name}</CardTitle>
        <CardDescription className="text-blue-100">
          {admin.shopName}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label htmlFor="file-upload">Upload File</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Print Type</Label>
            <RadioGroup
              value={printType}
              onValueChange={handlePrintTypeChange}
              className="flex space-x-4 mt-1"
            >
              {printOptions.map((option) => (
                <div key={option.type} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.type} id={option.type} />
                  <Label htmlFor={option.type}>
                    {option.type} (${option.cost.toFixed(2)}/page)
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          {file && (
            <div>
              <Label>Total Cost</Label>
              <p className="text-2xl font-bold text-green-600">
                ${totalCost.toFixed(2)}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Pay Now
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AdminDetails;
