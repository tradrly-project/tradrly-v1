'use client'

import { Card, CardContent } from "@/components/ui/card"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    TooltipProps,
} from "recharts";

import {
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { Calendar } from "../ui/calendar"
import { format } from "date-fns";
import { max, min } from "d3-array";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "../ui/table";

export function PerformanceCard() {
    const winrate = 93.3
    const totalTrade = 18
    const totalWin = 15
    const totalLoss = 3

    return (
        <Card className="bg-foreground/5 text-white rounded-3xl px-6 py-5 h-[180px] border-none">
            <div className="flex w-full h-full relative">
                {/* Kiri: Header + Total Trade */}
                <div className="flex flex-col justify-start w-[40%] bg-blue-">
                    {/* Header */}
                    <div className="mb-5.5">
                        <p className="text-md font-semibold text-white">Performance</p>
                        <p className="text-xs text-gray-400">Bulan ini</p>
                    </div>

                    {/* Total Trade */}
                    <div className="flex flex-col justify-start">
                        <p className="text-[14px] font-bold text-gray-400 mb-1">Total Trade</p>
                        <p className="text-[20px] font-bold text-white">{totalTrade}</p>
                        <span className="text-[16px] font-semibold text-white">Trade</span>
                    </div>
                </div>

                {/* Tengah: Profit & Loss (sama tinggi dengan kiri) */}
                <div className="flex flex-col justify-between w-[30%] px-2 space-y-4">
                    <div className="bg-foreground/6 rounded-md py-1 px-3 text-left">
                        <p className="text-[16px] text-sky-400 font-bold mb-2">Profit</p>
                        <p className="text-white text-md font-semibold">{totalWin}</p>
                    </div>
                    <div className="bg-foreground/6 rounded-md py-1 px-3 text-left">
                        <p className="text-[16px] text-red-500 font-bold mb-2">Loss</p>
                        <p className="text-white text-md font-semibold">{totalLoss}</p>
                    </div>
                </div>

                {/* Kanan: Grafik Winrate (tinggi sama seperti tengah) */}
                <div className="flex items-center ml-6 bg-yellow- h-full">
                    <div className="w-32 h-32">
                        <CircularProgressbarWithChildren
                            value={winrate}
                            styles={buildStyles({
                                pathColor: "#00C2FF",
                                trailColor: "#000000",
                            })}
                        >
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-lg font-bold text-white">
                                    {winrate.toFixed(1)}%
                                </div>
                                <p className="text-[14px] text-gray-400 mt-0.5">Winrate</p>
                            </div>
                        </CircularProgressbarWithChildren>
                    </div>
                </div>
            </div>
        </Card>

    )
}

export function ProfitLossCard() {
    return (
        <Card className="bg-foreground/5 text-white rounded-3xl p-4 h-[180px] border-none">
            {/* Header */}
            <div>
                <p className="text-md font-semibold text-white">Profit and Loss</p>
                <p className="text-xs text-gray-400">Bulan ini</p>
            </div>

            {/* Content */}
            <div className="-mt-4.5">
                <span className="text-sky-400 font-bold text-sm">Profit</span>
                <p className="text-sm font-semibold">$ 1,293.00</p>
            </div>
            <div className="-mt-4.5">
                <span className="text-red-500 font-bold text-sm">Loss</span>
                <p className="text-sm font-semibold">-$ 293.00</p>
            </div>
        </Card>
    )
}

export function PositionSummaryCard() {
    const riskRatio = 78.5;
    const longPosition = 65;    // misalnya persen
    const shortPosition = 35;
    const avgWin = 58;
    const avgLoss = 42;

    return (
        <Card className="bg-foreground/5 text-white rounded-3xl px-6 py-2 h-[180px] border-none">
            <div className="flex w-full h-full">
                {/* Kiri: Risk Ratio */}
                <div className="flex flex-col justify-start w-[40%] bg-red- py-3">
                    {/* Header */}
                    <div className="mb-1.5">
                        <p className="text-md font-semibold text-white">Histori Posisi</p>
                        <p className="text-xs text-gray-400">Bulan ini</p>
                    </div>

                    {/* Grafik Risk Ratio */}
                    <div className="w-24 h-24 ml-8">
                        <CircularProgressbarWithChildren
                            value={riskRatio}
                            styles={buildStyles({
                                pathColor: "#00C2FF",
                                trailColor: "#000000",
                            })}
                        >
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-md font-bold text-white">
                                    {riskRatio.toFixed(1)}%
                                </div>
                                <p className="text-[12px] text-gray-400 mt-0.5">Risk Ratio</p>
                            </div>
                        </CircularProgressbarWithChildren>
                    </div>
                </div>

                {/* Tengah: Long & Avg Win */}
                <div className="flex flex-col items-center justify-between w-[30%] space-y-2 bg-yellow- py-1">
                    {/* Long */}
                    <div className="w-18 h-18">
                        <CircularProgressbarWithChildren
                            value={longPosition}
                            styles={buildStyles({
                                pathColor: "#4ade80",
                                trailColor: "#111827",
                            })}
                        >
                            <div className="text-xs font-semibold text-white">{longPosition}%</div>
                            <p className="text-[10px] text-gray-400 mt-0.5">Long</p>
                        </CircularProgressbarWithChildren>
                    </div>

                    {/* Avg Win */}
                    <div className="w-18 h-18">
                        <CircularProgressbarWithChildren
                            value={avgWin}
                            styles={buildStyles({
                                pathColor: "#4ade80",
                                trailColor: "#111827",
                            })}
                        >
                            <div className="text-xs font-semibold text-white">{avgWin}%</div>
                            <p className="text-[10px] text-gray-400 mt-0.5">Avg Win</p>
                        </CircularProgressbarWithChildren>
                    </div>
                </div>

                {/* Kanan: Short & Avg Loss */}
                <div className="flex flex-col items-center justify-between w-[30%] space-y-1.5 bg-blue- py-1">
                    {/* Short */}
                    <div className="w-18 h-18">
                        <CircularProgressbarWithChildren
                            value={shortPosition}
                            styles={buildStyles({
                                pathColor: "#ef4444",
                                trailColor: "#111827",
                            })}
                        >
                            <div className="text-xs font-semibold text-white">{shortPosition}%</div>
                            <p className="text-[10px] text-gray-400 mt-0.5">Short</p>
                        </CircularProgressbarWithChildren>
                    </div>

                    {/* Avg Loss */}
                    <div className="w-18 h-18">
                        <CircularProgressbarWithChildren
                            value={avgLoss}
                            styles={buildStyles({
                                pathColor: "#ef4444",
                                trailColor: "#111827",
                            })}
                        >
                            <div className="text-xs font-semibold text-white">{avgLoss}%</div>
                            <p className="text-[10px] text-gray-400 mt-0.5">Avg Loss</p>
                        </CircularProgressbarWithChildren>
                    </div>
                </div>
            </div>
        </Card>
    );
}

const profits: { [date: string]: number } = {
    "01-05-2025": 12.5,
    "02-05-2025": -48.45,
    "03-05-2025": 79.65,
    "04-05-2025": 84.12,
    "07-05-2025": 0,

};


function CustomDayContent({ day }: { day: Date }) {
    const dateStr = format(day, "dd-MM-yyyy");
    const profit = profits[dateStr];

    return (
        <div className="flex flex-col items-center justify-between w-full h-full mt-1">
            <span className="text-[16px]">{day.getDate()}</span>
            {profit !== undefined && (
                <span
                    className={`text-[11px] font-semibold mb-1.5 ${profit > 0
                        ? "text-emerald-400"
                        : profit < 0
                            ? "text-red-500"
                            : "text-zinc-400"
                        }`}
                >
                    {profit === 0 ? "$ --" : `$${Math.abs(profit).toFixed(2)}`}
                </span>
            )}
        </div>
    );
}

export function CalendarCard() {
    return (
        <Card className="bg-foreground/5 text-white rounded-3xl border-none h-[400px] flex flex-col">
            <Calendar
                month={new Date(2025, 4, 1)}
                components={{
                    DayContent: (props) => <CustomDayContent day={props.date} />,
                }}
                className="h-full text-white bg-transparent"
                classNames={{
                    month: "w-full h-full",
                    table: "w-full h-full table-fixed",
                    head_row: "",
                    head_cell:
                        "text-foreground text-lg font-semibold text-center pt-1 pb-4",
                    row: "",
                    cell: "h-[52px] w-[52px] text-center align-top",
                    day:
                        "w-full h-full text-[16px] rounded-md cursor-pointer flex flex-col items-center justify-center hover:bg-foreground/10",
                    day_selected: "bg-white text-black",
                    caption_label: "text-lg font-bold text-center",
                    caption: "flex relative justify-center -mt-4 mb-6",
                    nav_button_previous: "absolute left-4",
                    nav_button_next: "absolute right-4",
                }}
            />
        </Card>

    );
}

const chartData = [
    { day: 1, profit: 0 },
    { day: 5, profit: 320 },
    { day: 10, profit: 450 },
    { day: 15, profit: -800 },
    { day: 20, profit: 1000 },
    { day: 22, profit: 889.59 },
    { day: 25, profit: 0 },
    { day: 30, profit: -300 },
];

const CustomTooltip = ({
    active,
    payload,
    label,
}: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        const value = payload[0].value?.toFixed(2);
        return (
            <div className="bg-black text-white p-4 rounded-lg shadow-md text-sm">
                <div className="text-muted-foreground mb-1">Bulan Ini</div>
                <div className="text-lg font-semibold">${value}</div>
                <div className="text-xs mt-1">{label} Mei 2025</div>
            </div>
        );
    }
    return null;
};

export function ProfitLossChartCard() {
    const profits = chartData.map((d) => d.profit);
    const dataMin = Math.min(0, min(profits) ?? 0);
    const dataMax = Math.max(0, max(profits) ?? 100);

    // Buat kelipatan adaptif
    const range = dataMax - dataMin;
    const step = range > 5000 ? 1000 : range > 2000 ? 500 : 250;

    // Bulatkan ke bawah & atas agar tidak mepet
    const yMin = Math.floor(dataMin / step) * step;
    const yMax = Math.ceil(dataMax / step) * step;

    return (
        <Card className="py-4 px-6 bg-foreground/5 text-white rounded-3xl border-none h-[400px] flex flex-col">
            {/* Header */}
            <div>
                <p className="text-md font-semibold text-white">Profit and Loss</p>
                <p className="text-xs text-gray-400">Bulan ini</p>
            </div>

            {/* Chart */}
            <div className="flex-1 -mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 30, right: 10, bottom: 30, left: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00C2FF" stopOpacity={0.5} />
                                <stop offset="70%" stopColor="#000000" stopOpacity={0.15} />
                            </linearGradient>
                        </defs>

                        <XAxis
                            dataKey="day"
                            tick={{ fill: "#ccc", fontSize: 14 }}
                            axisLine={false}
                            tickLine={false}
                            padding={{ left: 8, right: 8 }}
                            tickMargin={20}
                        />
                        <YAxis
                            domain={[yMin, yMax]}
                            tick={{ fill: "#ccc", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(val) => `$${val}`}
                            interval="preserveStartEnd"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={0} stroke="#e5e5e5" strokeWidth={1} />
                        <Area
                            type="monotone"
                            dataKey="profit"
                            stroke="#00C2FF"
                            fill="url(#colorProfit)"
                            strokeWidth={3}
                            dot={{ r: 3, stroke: "white", strokeWidth: 1.5 }}
                            activeDot={{ r: 6 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

export function TradeHistoryCard() {
    const trades = [
        { date: "14-Mei-2025", pair: "XAUUSD", pos: "LONG", status: "CLOSED", qty: 0.1, entry: 3.300, exit: 3.350, pnl: 64.46 },
        { date: "14-Mei-2025", pair: "XAUUSD", pos: "LONG", status: "CLOSED", qty: 0.1, entry: 3.300, exit: 3.350, pnl: 64.46 },
        { date: "14-Mei-2025", pair: "XAUUSD", pos: "LONG", status: "CLOSED", qty: 0.1, entry: 3.300, exit: 3.350, pnl: 64.46 },
        { date: "14-Mei-2025", pair: "XAUUSD", pos: "LONG", status: "CLOSED", qty: 0.1, entry: 3.300, exit: 3.350, pnl: 64.46 },
        { date: "14-Mei-2025", pair: "XAUUSD", pos: "LONG", status: "CLOSED", qty: 0.1, entry: 3.300, exit: 3.350, pnl: 64.46 },
        { date: "14-Mei-2025", pair: "XAUUSD", pos: "LONG", status: "CLOSED", qty: 0.1, entry: 3.300, exit: 3.350, pnl: 64.46 },
    ]

    return (
        <Card className="py-4 px-4 bg-foreground/5 text-white rounded-3xl border-none h-[350px] flex flex-col">
            <div className="pl-4 -mb-3 mt-1">
                <p className="text-2xl font-bold text-white">History Trade</p>
            </div>
            <CardContent className="overflow-auto">
                <Table className="w-full table-fixed">
                    {/* Colgroup — semua <col> HARUS tanpa spasi/enter antar elemen */}
                    <colgroup>
                        <col className="w-[18%]" /><col className="w-[14%]" /><col className="w-[14%]" />
                        <col className="w-[8%]" /><col className="w-[12%]" /><col className="w-[12%]" /><col className="w-[12%]" />
                    </colgroup>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-zinc-700">
                            <TableHead className="text-left px-2">Tanggal</TableHead>
                            <TableHead className="text-left px-2">Pair</TableHead>
                            <TableHead className="text-left px-2">Posisi</TableHead>
                            <TableHead className="text-center px-2">Qty</TableHead>
                            <TableHead className="text-right px-2">Entry</TableHead>
                            <TableHead className="text-right px-2">Exit</TableHead>
                            <TableHead className="text-right px-2">PnL</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trades.map((t, i) => (
                            <TableRow key={i} className="hover:bg-white/5 border-0">
                                <TableCell className="text-left px-2">{t.date}</TableCell>
                                <TableCell className="text-left px-2">{t.pair}</TableCell>
                                <TableCell className="text-left px-2">{t.pos}</TableCell>
                                <TableCell className="text-center px-2">{t.qty} Lot</TableCell>
                                <TableCell className="text-right px-2">${t.entry}</TableCell>
                                <TableCell className="text-right px-2">${t.exit}</TableCell>
                                <TableCell className={`${t.pnl >= 0 ? "text-green-500" : "text-red-500"} text-right px-2`}>
                                    ${t.pnl.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>



    )
}

export function TopGainerCard() {
    const gainers = [
        { pair: "XAUUSD", gain: 64.56 },
        { pair: "EURUSD", gain: 54.56 },
        { pair: "US100", gain: 45.32 },
        { pair: "BTCUSD", gain: 32.12 },
        { pair: "AUDJPY", gain: 25.54 },
    ]
    return (
        <Card className="bg-foreground/5 text-white rounded-3xl px-4 py-6 h-[350px] border-none">
            <div className="bg-red- mt-2 pl-1">
                <p className="text-lg font-bold text-white">Top 5 Gainers</p>
            </div>
            <div className="w-full mt-2 pl-1">
                <ul className="text-md font-semibold space-y-6 flex flex-col">
                    {gainers.map((item, i) => (
                        <li key={i} className="flex justify-between">
                            <span>{i + 1}. {item.pair}</span>
                            <span className="text-green-500">${item.gain}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    )
}

export function TopLoserCard() {
    const losers = [
        { pair: "XAUUSD", loss: 64.56 },
        { pair: "EURUSD", loss: 54.56 },
        { pair: "US100", loss: 45.32 },
        { pair: "BTCUSD", loss: 32.12 },
        { pair: "AUDJPY", loss: 25.54 },
    ]
    return (
        <Card className="bg-foreground/5 text-white rounded-3xl px-4 py-6 h-[350px] border-none">
            <div className="bg-red- mt-2 pl-1">
                <p className="text-lg font-bold text-white">Top 5 Lossers</p>
            </div>
            <div className="w-full mt-2 pl-1">
                <ul className="text-md font-semibold space-y-6 flex flex-col ">
                    {losers.map((item, i) => (
                        <li key={i} className="flex justify-between">
                            <span>{i + 1}. {item.pair}</span>
                            <span className="text-red-500">${item.loss}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    )
}
