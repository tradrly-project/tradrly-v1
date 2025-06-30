import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

export const PairSettingsForm = () => {

    return (
        <div className="w-[40%]">
            <Card className="bg-background shadow-md rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-foreground text-lg font-semibold tracking-tight">Pengaturan Pair</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Pair</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total Trade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableCell>BTCUSD</TableCell>
                            <TableCell>Aktif</TableCell>
                            <TableCell>4</TableCell>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
