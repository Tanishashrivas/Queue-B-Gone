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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileUpload from "./file-upload";
import PaymentProcessing from "./payment-loading";
import PaymentPage from "./payment-page";

// Set the worker source
GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

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
  const [showPayment, setShowPayment] = useState(false);
  const token = localStorage.getItem("token");

  const printOptions: PrintOption[] = [
    { type: "B/W", cost: 5 },
    { type: "Color", cost: 10 },
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

  const calculateTotalCost = async (file: File, type: "B/W" | "Color") => {
    const option = printOptions.find((opt) => opt.type === type);

    if (option) {
      try {
        const pdf = await getDocument(URL.createObjectURL(file)).promise;
        const pages = pdf.numPages;
        setTotalCost(pages * option.cost);
        console.log("file data", pages, file.size);
      } catch (error) {
        console.error("Error reading PDF file:", error);
      }
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

    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    console.log("payment success debug log");

    if (admin && admin.id) {
      const formData = new FormData();
      formData.append("file", file!);
      formData.append("adminId", admin.id);
      formData.append("printType", printType);

      try {
        const response = await axios.post(
          `http://localhost:5000/api/document/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(response.data);
        // ?adminId=${admin.id}&fileName=${
        //   file!.name
        // }&cost=${totalCost.toFixed(2)}

        addToast(
          "Upload Successful",
          `Your file has been uploaded and payment of Rs ${totalCost.toFixed(
            2
          )} has been processed.`,
          "success"
        );

        navigate(`/payment-page`);
      } catch (error) {
        console.error("Error uploading file:", error);
        addToast("Error uploading file", "Please try again.", "destructive");
      }
    } else {
      addToast(
        "Admin ID Missing",
        "Unable to proceed with the upload as the admin ID is missing.",
        "destructive"
      );
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/admin/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAdmin(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        addToast("Error fetching admin data", "Error", "destructive");
      }
    };

    fetchAdminData();
  }, [id, token]);

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

  if (showPayment) {
    return (
      // <PaymentPage
      //   adminId={admin.id}
      //   fileName={file!.name}
      //   totalCost={totalCost}
      //   onPaymentSuccess={handlePaymentSuccess}
      //   onPaymentCancel={handlePaymentCancel}
      // />
      // <PaymentProcessing onComplete={handlePaymentSuccess} />
      <PaymentPage adminId={id || ""} fileName={file?.name || ""} totalCost={totalCost} />
    );
  }

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
            <Label>Upload File</Label>
            <FileUpload
              onFileSelect={(file) => {
                setFile(file);
                calculateTotalCost(file, printType);
              }}
            />
            {file && (
              <p className="mt-2 text-gray-600">
                <strong>Uploaded file:</strong> {file.name}
              </p>
            )}
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
                    {option.type} (Rs {option.cost.toFixed(2)}/page)
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          {file && (
            <div>
              <Label>Total Cost</Label>
              <p className="text-2xl font-bold text-green-600">
                Rs {totalCost.toFixed(2)}
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
