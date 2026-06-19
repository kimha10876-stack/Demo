import { CalendarDays, MessageSquare, Star, ThumbsUp, Users } from "lucide-react"
import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../../components/ui/dialog"
import { Input } from "../../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { SidebarContent } from "../../../../components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { EventManagement } from "../../../../interface/manager/EventType"

export default function EventFeedbackPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventManagement | undefined>({
    id: "1",
    name: "Tech Conference 2023",
    date: new Date(2023, 5, 15),
  })

  const events = [
    { id: "1", name: "Tech Conference 2023", date: new Date(2023, 5, 15) },
    { id: "2", name: "Music Festival", date: new Date(2023, 6, 1) },
    { id: "3", name: "Food & Wine Expo", date: new Date(2023, 7, 10) },
  ]

  return (

      <div className="grid min-h-screen w-full ">
        <div className="w-[80px] border-r border-[#333333] bg-[#1E1E1E]">

          <SidebarContent>
          </SidebarContent>
        </div>
        <div className="flex flex-col">
          <main className="flex-1 overflow-y-auto bg-[#1E1E1E] p-6">
            <div className="mb-6">
              <Select onValueChange={(value) => setSelectedEvent(events.find((e) => e.id === value))}>
                <SelectTrigger className="w-[300px] bg-[#2A2A2A] text-white">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedEvent ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-4">{selectedEvent.name} Feedback</h2>
                <FeedbackOverview eventId={selectedEvent.id} />
                <FeedbackTable eventId={selectedEvent.id} />
              </>
            ) : (
              <p className="text-white">Please select an event to view its feedback.</p>
            )}
          </main>
        </div>
      </div>
    
  )
}

function FeedbackOverview({ eventId } :any) {
    console.log(eventId);
  const overviewData = {
    totalFeedback: 234,
    averageRating: 4.5,
    positiveFeedbackPercentage: 89,
    responseRate: 95,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card className="bg-[#2A2A2A] text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          <MessageSquare className="h-4 w-4 text-[#00B14F]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overviewData.totalFeedback}</div>
          <p className="text-xs text-gray-400">+20.1% from last event</p>
        </CardContent>
      </Card>
      <Card className="bg-[#2A2A2A] text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-[#00B14F]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overviewData.averageRating}</div>
          <p className="text-xs text-gray-400">Out of 5 stars</p>
        </CardContent>
      </Card>
      <Card className="bg-[#2A2A2A] text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Positive Feedback</CardTitle>
          <ThumbsUp className="h-4 w-4 text-[#00B14F]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overviewData.positiveFeedbackPercentage}%</div>
          <p className="text-xs text-gray-400">+5% from last event</p>
        </CardContent>
      </Card>
      <Card className="bg-[#2A2A2A] text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          <MessageSquare className="h-4 w-4 text-[#00B14F]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overviewData.responseRate}%</div>
          <p className="text-xs text-gray-400">-2% from last event</p>
        </CardContent>
      </Card>
    </div>
  )
}

function FeedbackTable({ eventId } :any) {
    console.log(eventId);
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openFeedbackDetails = (feedback : any) => {
    setSelectedFeedback(feedback)
    setIsModalOpen(true)
  }

  const closeFeedbackDetails = () => {
    setSelectedFeedback(null)
    setIsModalOpen(false)
  }

  const feedbacks = [
    {
      id: "FB-1001",
      user: "John Doe",
      rating: 5,
      comment: "Great event! Very well organized.",
      date: new Date(2023, 5, 15),
      category: "Organization",
    },
    {
      id: "FB-1002",
      user: "Jane Smith",
      rating: 4,
      comment: "Interesting talks, but the venue was a bit small.",
      date: new Date(2023, 5, 15),
      category: "Venue",
    },
    {
      id: "FB-1003",
      user: "Alice Johnson",
      rating: 5,
      comment: "Excellent networking opportunities.",
      date: new Date(2023, 5, 16),
      category: "Networking",
    },
    {
      id: "FB-1004",
      user: "Bob Williams",
      rating: 3,
      comment: "Some technical issues with the presentations.",
      date: new Date(2023, 5, 16),
      category: "Technical",
    },
    {
      id: "FB-1005",
      user: "Emma Davis",
      rating: 5,
      comment: "The keynote speaker was inspiring!",
      date: new Date(2023, 5, 17),
      category: "Content",
    },
  ]

  return (
    <>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Feedback Details</h3>
          <div className="flex items-center space-x-2">
            <Input placeholder="Search feedback..." className="w-[200px] bg-[#2A2A2A] text-white" />
            <Select>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="venue">Venue</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
              <TableHead className="text-white">Feedback ID</TableHead>
              <TableHead className="text-white">User</TableHead>
              <TableHead className="text-white">Rating</TableHead>
              <TableHead className="text-white">Category</TableHead>
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((feedback, i) => (
              <TableRow key={i} className="border-[#333333] hover:bg-[#2A2A2A]">
                <TableCell className="font-medium text-white">{feedback.id}</TableCell>
                <TableCell className="text-white">{feedback.user}</TableCell>
                <TableCell className="text-white">{feedback.rating} / 5</TableCell>
                <TableCell className="text-white">{feedback.category}</TableCell>
                <TableCell className="text-white">{feedback.date.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 bg-[#00B14F] text-white"
                    onClick={() => openFeedbackDetails(feedback)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <FeedbackDetailModal feedback={selectedFeedback} isOpen={isModalOpen} onClose={closeFeedbackDetails} />
    </>
  )
}

function FeedbackDetailModal({ feedback, isOpen, onClose } :any) {
  if (!feedback) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2A2A2A] text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-[#00B14F]">Feedback Details</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="mt-4 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#00B14F]">Feedback Information</h3>
                <p>
                  <MessageSquare className="inline mr-2 h-4 w-4" /> <strong>Feedback ID:</strong> {feedback.id}
                </p>
                <p>
                  <Users className="inline mr-2 h-4 w-4" /> <strong>User:</strong> {feedback.user}
                </p>
                <p>
                  <Star className="inline mr-2 h-4 w-4" /> <strong>Rating:</strong> {feedback.rating} / 5
                </p>
                <p>
                  <CalendarDays className="inline mr-2 h-4 w-4" /> <strong>Date:</strong>{" "}
                  {feedback.date.toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#00B14F]">Feedback Content</h3>
                <p>{feedback.comment}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#00B14F]">Category</h3>
                <p>
                  <MessageSquare className="inline mr-2 h-4 w-4" /> <strong>Category:</strong> {feedback.category}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#00B14F]">Actions</h3>
                <div className="mt-2 space-x-2">
                  <Button className="bg-[#00B14F] text-white hover:bg-[#00B14F]/80">Mark as Addressed</Button>
                  <Button className="bg-blue-500 text-white hover:bg-blue-600">Send Response</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#00B14F]">Notes</h3>
                <textarea
                  className="w-full h-24 mt-2 p-2 bg-[#1E1E1E] text-white border border-[#333333] rounded"
                  placeholder="Add notes about this feedback..."
                />
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

