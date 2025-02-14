
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AccessLog {
  id: string;
  accessed_at: string;
  accessed_by_user_id: string;
  student_id: string;
  access_type: string;
  access_reason: string;
}

interface AccessLogsTableProps {
  logs: AccessLog[];
}

export const AccessLogsTable = ({ logs }: AccessLogsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Logs</CardTitle>
        <CardDescription>View recent access to student data</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Access Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Student ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.accessed_at).toLocaleString()}
                </TableCell>
                <TableCell>{log.access_type}</TableCell>
                <TableCell>{log.access_reason}</TableCell>
                <TableCell>{log.student_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
