import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AdminDetails from './admin-details'
import axios from 'axios'

type Admin = {
  _id: string;
  name: string;
  shopName: string;
}

type Document = {
  id: string;
  fileName: string;
  price: number;
  tokenNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminId: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate()
  
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [admins, setAdmins] = useState<Admin[]>([]) 
  const token = localStorage.getItem('token');
  // const [documents, setDocuments] = useState<Document[]>([]) 

  // const [admins] = useState<Admin[]>([
  //   { id: '1', name: 'John Doe', shopName: "John's Shop" },
  //   { id: '2', name: 'Jane Smith', shopName: "Jane's Store" },
  //   { id: '3', name: 'Alice Johnson', shopName: "Alice's Boutique" },
  // ])

  const [documents] = useState<Document[]>([
    { id: '1', fileName: 'BDH_Assignment.pdf', price: 10, tokenNumber: 'TOK001', status: 'Pending', adminId: '1' },
    { id: '2', fileName: 'Virtual_Reality_File.pdf', price: 15, tokenNumber: 'TOK002', status: 'Approved', adminId: '2' },
    { id: '3', fileName: 'Document1.pdf', price: 20, tokenNumber: 'TOK003', status: 'Rejected', adminId: '3' },
  ])

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin", {
          headers: {
            'Authorization': `Bearer ${token}`, 
          }
        }) 

        const data = await response.data;
        setAdmins(data)  
      } catch (error) {
        console.error("Error fetching admins:", error)
      }
    }

    fetchAdmins()
  }, [])

  // useEffect(() => {
  //   const fetchDocuments = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:5000/api/") 
  //       const data = await response.data;
  //       setDocuments(data)  
  //     } catch (error) {
  //       console.error("Error fetching documents:", error)
  //     }
  //   }

  //   fetchDocuments()
  // }, [])

  if (!admins || admins.length === 0) {
    return <div className="container mx-auto p-4">No admins available at the moment.</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100'
      case 'Approved': return 'text-green-600 bg-green-100'
      case 'Rejected': return 'text-red-600 bg-red-100'
      default: return ''
    }
  }

  const handleAdminClick = (admin: Admin) => {
    setSelectedAdmin(admin)
    navigate(`/admin-details/${admin._id}`) 
  }

  if (selectedAdmin) {
    return <AdminDetails />
  }

  return (
    <div className="container mx-auto p-4 space-y-8 bg-gray-50 min-h-screen">
      <Card className="shadow-md">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle>Available Admins</CardTitle>
          <CardDescription className="text-blue-100">Click on an admin to upload a document</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {admins.map((admin) => (
              <Card key={admin._id} className="cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => handleAdminClick(admin)}>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">{admin.name}</CardTitle>
                  <CardDescription>{admin.shopName}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="bg-green-600 text-white">
          <CardTitle>Your Documents</CardTitle>
          <CardDescription className="text-green-100">Manage your uploaded documents</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Token Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.fileName}</TableCell>
                  <TableCell>${doc.price}</TableCell>
                  <TableCell>{doc.tokenNumber}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </TableCell>
                  <TableCell>{admins.find(admin => admin._id === doc.adminId)?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentDashboard
