import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessful() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const adminId = searchParams.get("adminId");
  const fileName = searchParams.get("fileName");
  const cost = searchParams.get("cost");

  useEffect(() => {
    if (adminId && fileName && cost) {
      // Simulate payment verification process
      console.log("Payment verified for:", { adminId, fileName, cost });
    } else {
      console.error("Missing search parameters");
    }
  }, [adminId, fileName, cost]);

  const handleBackToDashboard = () => {
    navigate("/student-dashboard");
  };

  return (
    <div className="container mx-auto p-4 h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="bg-green-500 text-white">
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription className="text-green-100">
            Your document has been uploaded
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p>
            <strong>File Name:</strong> {fileName}
          </p>
          <p>
            <strong>Total Cost:</strong> ${cost}
          </p>
          <Button
            onClick={handleBackToDashboard}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
