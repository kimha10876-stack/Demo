import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, Toaster } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { AdminAccount, ManagerAccount } from "../../interface/admin/Account"
import adminApi from "../../services/admin/AdminApi"


export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(null);
  const [countAdmin, setCountAdmin] = useState<number>(0);
  const [countManager, setCountManager] = useState<number>(0)
  

  // const filteredAccounts = accounts.filter(
  //   (account) =>
  //     (account.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       account.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
  //     (filterRole === "all"),
  // )

  const handleAddAccount = (newAccount: ManagerAccount) => {
    const requestBody = {
      email: newAccount.email,
      username: newAccount.username, 
      role: "MANAGER" 
    };

    console.log("request:", requestBody)
  
    adminApi.createManager(requestBody)
      .then(response => {
        const createdAccount = response.data.result;
        console.log("Account created:", createdAccount);
    
        setAccounts([...accounts, createdAccount]);
        
        toast.success(
          "Account Created", {
          description: "New manager account has been successfully created.",
        });
      })
      .catch(error => {
        console.error("Error creating account:", error);
        toast.error("Failed to create account");
      });
  }

  const handleEditAccount = (updatedAccount:any) => {
    setAccounts(
      accounts.map((account) => (account.accountId === updatedAccount.id ? { ...account, ...updatedAccount } : account)),
    )
    setEditingAccount(null)
    toast.success(
      "Account Updated",{
      description: "The account has been successfully updated.",
    })
  }

  const handleDeleteAccount = (id:any) => {
    setAccounts(accounts.filter((account) => account.accountId !== id))
    toast.success(
      "Account Deleted",{
      description: "The account has been successfully deleted."
    })
  }

  const fetchCountAll = async () => {
      try {
        const res: any = await adminApi.countAll()
        console.log("CountAll:", res.data.result)
        setCountAdmin(res.data.result)


        const response : any = await adminApi.countManager()
        console.log("CountManager:", response.data.result)
        setCountManager(response.data.result)

      } catch (error) {
        console.error("Error fetching:", error)
        toast.error("Failed to fetch")
      }
    }
    
    const fetchAccountList = async () => {
      try {
        const res: any = await adminApi.getAllAccount()
        console.log("Account List:", res.data.result)
        if (res.data.result && res.data.result.length > 0) {
          setAccounts(res.data.result)
        }
      } catch (error) {
        console.error("Error fetching account:", error)
        toast.error("Failed to fetch account")
      }
    }
  

  
    useEffect(() => {
      const initUseEffect = async () => {
        await fetchCountAll()
        await fetchAccountList()
      }
      initUseEffect()
    }, [])
  
  return (
    <div className="p-6 bg-[#1E1E1E] text-white min-h-screen">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Account Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#00B14F] hover:bg-[#00963F]">
              <Plus className="mr-2 h-4 w-4" /> Add New Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#2A2A2A] text-white">
          <DialogHeader>
      <DialogTitle>Add New Manager Account</DialogTitle>
      <DialogDescription>Create a new account for a manager. Fill in the details below.</DialogDescription>
    </DialogHeader>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        
        // Create a properly typed ManagerAccount object
        const newAccount: ManagerAccount = {
          email: formData.get('email') as string,
          username: formData.get('name') as string,
          role: "MANAGER"
        };
        
        handleAddAccount(newAccount);
      }}
    >
      <div className="grid gap-4 py-4 text-white">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Username
          </Label>
          <Input
            id="name"
            name="name"
            className="col-span-3 bg-[#3A3A3A] border-[#4A4A4A] text-white"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            className="col-span-3 bg-[#3A3A3A] border-[#4A4A4A] text-white"
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-[#00B14F] hover:bg-[#00963F]">
          Add Manager
        </Button>
      </DialogFooter>
    </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#2A2A2A] border-[#3A3A3A] mb-6 text-white">
        <CardHeader>
          <CardTitle className="text-white">Account Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Total Accounts</span>
            <span className="text-2xl font-bold">{countAdmin + countManager}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Admins</span>
            <span className="text-2xl font-bold">{countAdmin}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Managers</span>
            <span className="text-2xl font-bold">{countManager}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#3A3A3A] border-[#4A4A4A] text-white"
        />
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-[#4A4A4A] text-white">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-white">
                <TableHead className="text-white">Username</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Role</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-white">
            {accounts.map((account) => (
              <TableRow key={account.accountId}>
                <TableCell className="font-medium">{account.userName}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      account.roleId === 1
                        ? "bg-purple-500/20 text-purple-500"
                        : account.roleId === 4
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-gray-500/20 text-gray-500"
                    }`}
                  >
                    {account.roleId === 1 ? "Admin" : account.roleId === 4 ? "Manager" : "User"}
                  </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>

                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => setEditingAccount(account)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#2A2A2A] text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the account and remove the
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-600 text-white hover:bg-gray-700">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => handleDeleteAccount(account.accountId)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingAccount} onOpenChange={() => setEditingAccount(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>Make changes to the account here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {editingAccount && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const updatedAccount = Object.fromEntries(formData)
                handleEditAccount({ ...editingAccount, ...updatedAccount })
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="edit-username"
                    name="name"
                    type="name"
                    defaultValue={editingAccount.lastName}
                    className="col-span-3 bg-[#3A3A3A] border-[#4A4A4A] text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={editingAccount.email}
                    className="col-span-3 bg-[#3A3A3A] border-[#4A4A4A] text-white"
                  />
                </div>
                {editingAccount.roleId === 4 && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-role" className="text-right">
                      Role
                    </Label>
                    <Select name="role" defaultValue={editingAccount.lastName}>
                      <SelectTrigger className="col-span-3 bg-[#3A3A3A] border-[#4A4A4A] text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#00B14F] hover:bg-[#00963F]">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

