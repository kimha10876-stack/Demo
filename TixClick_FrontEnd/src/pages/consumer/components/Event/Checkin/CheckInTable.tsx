import EmptyList from "../../../../../components/EmptyList/EmptyList";
import { Badge } from "../../../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import { TicketCheckin } from "../../../../../interface/ticket/Ticket";
import { formatMoney } from "../../../../../lib/utils";

interface TicketTableProps {
  data: TicketCheckin[];
}

export default function TicketTable({ data }: TicketTableProps) {
  return (
    <Card className="w-full bg-background h-auto text-foreground shadow-md rounded-2xl border">
      <CardHeader>
        <CardTitle>Chi tiết vé</CardTitle>
      </CardHeader>
      {data.length > 0 ? (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại vé</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Đã check-in</TableHead>
                <TableHead>Tỉ lệ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((ticket, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{ticket.ticketType}</TableCell>
                    <TableCell>{formatMoney(ticket.price)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {ticket.checkedIn}/{ticket.totalTicket}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="default"
                        className={
                          parseFloat(ticket.percentage.toString()) >= 80
                            ? "bg-green-500"
                            : parseFloat(ticket.percentage.toString()) >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }
                      >
                        {ticket.percentage}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      ) : (
        <div className="pb-20">
          <EmptyList label="Vui lòng chọn hoạt động" />
        </div>
      )}
    </Card>
  );
}
