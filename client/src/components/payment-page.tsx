'use client'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/toast/use-toast"
import axios from 'axios'

interface PaymentPageProps {
  adminId: string
  fileName: string
  totalCost: number
  onPaymentSuccess: () => void
  onPaymentCancel: () => void
}

const PaymentPage: React.FC<PaymentPageProps> = ({ adminId, fileName, totalCost, onPaymentSuccess, onPaymentCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking' | 'card'>('upi')
  const [upiId, setUpiId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In a real application, you would make an API call to your backend here
      // const response = await axios.post('/api/process-payment', {
      //   adminId,
      //   fileName,
      //   totalCost,
      //   paymentMethod,
      //   upiId: paymentMethod === 'upi' ? upiId : undefined
      // })

      addToast("Payment Successful", `Your payment of Rs ${totalCost.toFixed(2)} has been processed.`, "success")
      onPaymentSuccess()
      navigate(`/payment-successful?adminId=${adminId}&fileName=${fileName}&cost=${totalCost.toFixed(2)}`)
    } catch (error) {
      console.error('Payment processing error:', error)
      addToast("Payment Failed", "There was an error processing your payment. Please try again.", "destructive")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle>Payment Details</CardTitle>
        <CardDescription className="text-blue-100">Choose your payment method</CardDescription>
      </CardHeader>
      <form onSubmit={handlePayment}>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value: 'upi' | 'netbanking' | 'card') => setPaymentMethod(value)} className="flex flex-col space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi">UPI</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="netbanking" id="netbanking" />
                <Label htmlFor="netbanking">Net Banking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Credit/Debit Card</Label>
              </div>
            </RadioGroup>
          </div>
          {paymentMethod === 'upi' && (
            <div className="space-y-2">
              <Label htmlFor="upi-id">UPI ID</Label>
              <Input 
                id="upi-id" 
                type="text" 
                placeholder="Enter your UPI ID" 
                value={upiId} 
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <Label>Total Amount</Label>
            <p className="text-2xl font-bold text-green-600">Rs {totalCost.toFixed(2)}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPaymentCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default PaymentPage