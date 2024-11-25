'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/toast/use-toast"

interface Document {
  id: string
  fileName: string
  studentName: string
  price: number
  tokenNumber: string
  status: 'Pending' | 'Approved' | 'Rejected'
  printType: 'B/W' | 'Color'
}

const AdminDashboard = () => {
  const { addToast } = useToast();

  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', fileName: 'Assignment1.pdf', studentName: 'Alice Johnson', price: 10, tokenNumber: 'TOK001', status: 'Pending', printType: 'B/W' },
    { id: '2', fileName: 'Thesis.pdf', studentName: 'Bob Smith', price: 25, tokenNumber: 'TOK002', status: 'Pending', printType: 'Color' },
    { id: '3', fileName: 'Report.docx', studentName: 'Charlie Brown', price: 15, tokenNumber: 'TOK003', status: 'Pending', printType: 'B/W' },
  ])

  const handleStatusChange = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === id ? { ...doc, status: newStatus } : doc
      )
    );

    addToast(
      'Status Updated',
      `Document ${id} has been ${newStatus.toLowerCase()}.`,
      newStatus === 'Approved' ? 'success' : 'error'
    );
  };

  const handleUpdateQueue = () => {
    addToast(
      'Queue Updated',
      'The processing queue has been updated successfully.',
      'info'
    );
  };

  const handlePrintTypeChange = (id: string, newPrintType: 'B/W' | 'Color') => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === id ? { ...doc, printType: newPrintType } : doc
      )
    );

    addToast(
      'Print Type Updated',
      `Document ${id} print type has been updated to ${newPrintType}.`,
      'info'
    );
  };

  const getStatusColor = (status: 'Pending' | 'Approved' | 'Rejected') => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100'
      case 'Approved': return 'text-green-600 bg-green-100'
      case 'Rejected': return 'text-red-600 bg-red-100'
      default: return ''
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <Card className="shadow-lg">
        <CardHeader className="bg-purple-600 text-white">
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription className="text-purple-100">Manage document requests and update statuses</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-100">
                <TableHead>File Name</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Token Number</TableHead>
                <TableHead>Print Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-gray-100">
                  <TableCell>{doc.fileName}</TableCell>
                  <TableCell>{doc.studentName}</TableCell>
                  <TableCell>Rs.{doc.price}</TableCell>
                  <TableCell>{doc.tokenNumber}</TableCell>
                  <TableCell>
                    <Select
                      value={doc.printType}
                      onValueChange={(value) => handlePrintTypeChange(doc.id, value as 'B/W' | 'Color')}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Print Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B/W">B/W</SelectItem>
                        <SelectItem value="Color">Color</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={doc.status === 'Approved'}
                        onCheckedChange={(checked) => handleStatusChange(doc.id, checked ? 'Approved' : 'Rejected')}
                      />
                      <span>{doc.status === 'Approved' ? 'Approved' : 'Rejected'}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-gray-100">
          <Button onClick={handleUpdateQueue} className="bg-purple-500 hover:bg-purple-600 text-white">Update Processing Queue</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AdminDashboard;
