import { useState } from "react"
import { useLanguage } from "../../../organizer/components/LanguageContext"

import {
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileDown,
  FileText,
  HelpCircle,
  Shield
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../components/ui/accordion"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/dialog"
import { ScrollArea } from "../../../../components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"


export default function Policy() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  console.log(setSearchQuery)
  const [selectedPdf, setSelectedPdf] = useState({
    title: "",
    url: "",
  })
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false)
  const [selectedTermId, setSelectedTermId] = useState("1")

  const policyPdfs = {
    "1": {
      icon: <FileText className="h-4 w-4" />,
      pdfUrl: "http://res.cloudinary.com/dxypmsqdo/image/upload/v1743221521/mv6nhedkijdwgy2qwdsy.pdf",
    },
    "2": {
      icon: <Shield className="h-4 w-4" />,
      pdfUrl: "https://res.cloudinary.com/dxypmsqdo/image/upload/v1743223294/namphan/rcquujnhji0zkfnb2bga.pdf",
    },
    "3": {
      icon: <HelpCircle className="h-4 w-4" />,
      pdfUrl: "https://res.cloudinary.com/dxypmsqdo/image/upload/v1743223292/namphan/lrlrg7dhxzwph2bq62x7.pdf",
    },
  }

  const filteredTerms = t.terms.items.filter(
    (term) =>
      term.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewPdf = (pdfUrl: string, title: string) => {
    setSelectedPdf({
      url: pdfUrl,
      title: title,
    })
    setIsPdfDialogOpen(true)
  }

  const selectedTerm = t.terms.items.find((term) => term.id === selectedTermId) || t.terms.items[0]

  const selectedPdfInfo = policyPdfs[selectedTermId as keyof typeof policyPdfs] || policyPdfs["1"]

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="bg-gradient-to-b from-[#1E1E1E] to-[#121212] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.nav.terms}</h1>
          <div className="mb-8 flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>{t.language === "en" ? "Last updated: March 15, 2025" : "Cập nhật lần cuối: 15/03/2025"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="bg-[#1E1E1E] border-b border-gray-800 w-full justify-start overflow-x-auto mb-6">
            {/* <TabsTrigger value="content" className="data-[state=active]:bg-[#ff8a00] data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              {t.language === "en" ? "Content" : "Nội dung"}
            </TabsTrigger> */}
            <TabsTrigger value="documents" className="data-[state=active]:bg-[#ff8a00] data-[state=active]:text-white">
              <FileDown className="h-4 w-4 mr-2" />
              {t.language === "en" ? "Documents" : "Tài liệu"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="grid grid-cols-1 gap-6">
              <div className="md:col-span-3">
                <Accordion type="multiple" className="bg-[#1E1E1E] rounded-lg">
                  {filteredTerms.map((term, index) => (
                    <AccordionItem
                      key={term.id}
                      value={term.id}
                      id={term.id}
                      className="border-b border-gray-800 last:border-0 px-4"
                    >
                      <AccordionTrigger className="py-4 text-white hover:text-[#ff8a00] hover:no-underline">
                        <div className="flex items-center text-left">
                          <span className="text-[#ff8a00] mr-3 font-medium">{index + 1}.</span>
                          <span>{term.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400 pb-6 pt-2 pl-8">
                        <div className="prose prose-invert max-w-none">
                          <div className="mb-4">{term.content}</div>
                          <div className="flex justify-end mt-6">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-800 text-gray-400 hover:text-white"
                              onClick={() => handleViewPdf(selectedPdfInfo.pdfUrl, selectedTerm.title)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              {t.language === "en" ? "View as PDF" : "Xem dạng PDF"}
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredTerms.length === 0 && (
                  <div className="bg-[#1E1E1E] rounded-lg p-8 text-center">
                    <p className="text-gray-400">
                      {t.language === "en" ? "No matching content found." : "Không tìm thấy nội dung phù hợp."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-[#1E1E1E] border-gray-800 h-fit">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    {t.language === "en" ? "Table of Contents" : "Mục lục"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[300px]">
                    <ul className="py-2">
                      {t.terms.items.map((term, index) => (
                        <li
                          key={term.id}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            selectedTermId === term.id
                              ? "bg-[#ff8a00]/10 border-l-2 border-[#ff8a00]"
                              : "hover:bg-gray-800/50"
                          }`}
                          onClick={() => setSelectedTermId(term.id)}
                        >
                          <div className="text-gray-400 hover:text-white flex items-center text-sm">
                            <span className={`w-6 ${selectedTermId === term.id ? "text-[#ff8a00]" : "text-gray-500"}`}>
                              {index + 1}.
                            </span>
                            <span className={selectedTermId === term.id ? "text-white" : ""}>{term.title}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* PDF Preview Card */}
              <div className="md:col-span-3">
                <Card className="bg-[#1E1E1E] border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      {selectedPdfInfo.icon}
                      <CardTitle className="text-white text-lg">{selectedTerm.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="aspect-[16/9] bg-gray-900 rounded-md flex items-center justify-center mb-4 relative group cursor-pointer overflow-hidden w-full"
                      onClick={() => handleViewPdf(selectedPdfInfo.pdfUrl, selectedTerm.title)}
                    >
                      <img
                        src={selectedPdfInfo.pdfUrl || "/placeholder.svg"}
                        alt={selectedTerm.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-white text-sm font-medium">{selectedTerm.title}</p>
                        <p className="text-gray-400 text-xs">
                          PDF • {t.language === "en" ? "Last updated: March 15, 2025" : "Cập nhật: 15/03/2025"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 pt-0">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-800 text-gray-400 hover:text-white"
                      onClick={() => handleViewPdf(selectedPdfInfo.pdfUrl, selectedTerm.title)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {t.language === "en" ? "View" : "Xem"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-800 text-gray-400 hover:text-white"
                      onClick={() => window.open(selectedPdfInfo.pdfUrl, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t.language === "en" ? "Download" : "Tải về"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-12 bg-[#1E1E1E] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {t.language === "en" ? "Need more help?" : "Bạn cần hỗ trợ thêm?"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {t.language === "en"
                ? "If you have any questions about our policies, please contact our support team."
                : "Nếu bạn có bất kỳ câu hỏi nào về chính sách của chúng tôi, vui lòng liên hệ với đội ngũ hỗ trợ."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Button className="bg-pse-green hover:bg-[#00B14F]/90 flex-1">
                {t.language === "en" ? "Contact Support" : "Liên hệ hỗ trợ"}
              </Button>
              <Button variant="outline" className="border-gray-800 text-gray-400 hover:text-black flex-1">
                {t.language === "en" ? "FAQ" : "Câu hỏi thường gặp"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
        <DialogContent className="bg-[#1E1E1E] text-white border-gray-800 max-w-5xl h-[80vh] p-0">
          <DialogHeader className="p-4 border-b border-gray-800 flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white">{selectedPdf?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-full p-4 overflow-auto">
            <div className="bg-white rounded-md h-full w-full overflow-hidden">
              <iframe src={selectedPdf?.url} className="w-full h-full" title={selectedPdf?.title} />
            </div>
          </div>
          <div className="p-4 border-t border-gray-800 flex justify-between">
            <Button
              variant="outline"
              className="border-gray-800 text-gray-400 hover:text-white"
              onClick={() => setIsPdfDialogOpen(false)}
            >
              {t.language === "en" ? "Close" : "Đóng"}
            </Button>
            <Button
              className="bg-pse-green hover:bg-[#00B14F]/90"
              onClick={() => window.open(selectedPdf?.url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {t.language === "en" ? "Open in new tab" : "Mở trong tab mới"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


