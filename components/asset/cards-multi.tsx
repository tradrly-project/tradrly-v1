'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

// Dummy Data (replace with real data via props or hooks)
const chartData = [
    { day: 1, profit: 120 },
    { day: 5, profit: 300 },
    { day: 10, profit: 600 },
    { day: 15, profit: 800 },
    { day: 20, profit: 400 },
    { day: 25, profit: 900 },
    { day: 30, profit: 700 },
]

export function PerformanceCard() {
    const winrate = 93.3
    const totalTrade = 18
    const totalWin = 15
    const totalLoss = 3

    return (
        <Card className="bg-background text-white rounded-3xl p-5 w-[300px] h-[215px]">
            {/* Header */}
            <div>
                <p className="text-md font-semibold text-white">Performance</p>
                <p className="text-xs text-gray-400">Bulan ini</p>
            </div>

            {/* Wrapper Flex untuk layout horizontal */}
            <div className="relative w-full -mt-3">
                {/* === WRAPPER UTAMA KIRI (bg-blue-900) === */}
                <div className="flex items-center bg-blue- w-full pr-36 rounded-xl">
                    {/* === BAGIAN KIRI === */}
                    <div className="">
                        <div className="flex flex-col">
                            {/* Total Trade */}
                            <div className="bg-foreground/7 rounded-lg py-1.5 pl-2.5 pr-4 w-fit mb-1.5">
                                <p className="text-xs font-bold text-gray-400 mb-2">Total Trade</p>
                                <div className="flex items-baseline space-x-8 ml-3">
                                    <p className="text-sm font-bold text-white">{totalTrade}</p>
                                    <span className="text-xs text-white">Trade</span>
                                </div>
                            </div>

                            {/* Profit / Loss */}
                            <div className="flex space-x-14 bg-foreground/7 py-1.5 px-3 rounded-lg w-fit">
                                <div className="text-green-400 text-center text-xs font-bold">
                                    <p>Profit</p>
                                    <p className="text-white text-sm font-bold mt-2">{totalWin}</p>
                                </div>
                                <div className="text-red-400 text-center text-xs font-bold">
                                    <p>Loss</p>
                                    <p className="text-white text-sm font-bold mt-2">{totalLoss}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === BAGIAN WINRATE (DI LUAR DIV BIRU, DI SISI KANAN CARD) === */}
                <div className="absolute -right-1 top-1/2 -translate-y-17">
                    <div className="w-20 h-20 md:h-26 md:w-26">
                        <CircularProgressbarWithChildren
                            value={winrate}
                            styles={buildStyles({
                                pathColor: "#00C2FF",
                                trailColor: "#000000",
                            })}
                        >
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-md font-bold text-white">
                                    {winrate.toFixed(1)}%
                                </div>
                                <p className="text-sm text-gray-400 mt-0.5">Winrate</p>
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
        <Card className="bg-background text-white rounded-3xl p-5 w-[190px] h-[215px]">
            {/* Header */}
            <div>
                <p className="text-md font-semibold text-white">Profit and Loss</p>
                <p className="text-xs text-gray-400">Bulan ini</p>
            </div>

            {/* Content */}
            <div className="-mt-3">
                <span className="text-emerald-400 font-bold">Profit</span>
                <p>$ 1.000.000</p>
            </div>
        </Card>
    )
}

export function PositionSummaryCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Position Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between">
                    <div>
                        <p>LONG</p>
                        <p className="text-green-500">80%</p>
                    </div>
                    <div>
                        <p>SHORT</p>
                        <p className="text-red-500">20%</p>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div>
                        <p>Avg. WIN</p>
                        <p className="text-green-500">80%</p>
                    </div>
                    <div>
                        <p>Avg. LOSS</p>
                        <p className="text-red-500">40%</p>
                    </div>
                </div>
                <div>
                    <p>Risk : Ratio</p>
                    <p className="text-blue-400 text-lg font-bold">1 : 2</p>
                </div>
            </CardContent>
        </Card>
    )
}

export function CalendarCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Kalender - Mei 2025</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Integrasi dengan kalender dan data harian profit/loss</p>
                {/* Placeholder atau integrasi dengan kalender seperti react-calendar */}
            </CardContent>
        </Card>
    )
}

export function ProfitLossChartCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Total Profit/Loss</CardTitle>
            </CardHeader>
            <CardContent className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export function TradeHistoryCard() {
    const trades = [
        { date: "14-Mei-2025", pair: "XAUUSD", pos: "LONG", status: "CLOSED", entry: 1.3, exit: 1.36, pnl: 64.46 },
        { date: "14-Mei-2025", pair: "US100", pos: "LONG", status: "CLOSED", entry: 1.3, exit: 1.36, pnl: 64.46 },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>History Trade</CardTitle>
            </CardHeader>
            <CardContent>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left border-b">
                            <th>Tanggal</th><th>Pair</th><th>Posisi</th><th>Status</th><th>P/L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map((t, i) => (
                            <tr key={i} className="border-b last:border-none">
                                <td>{t.date}</td>
                                <td>{t.pair}</td>
                                <td>{t.pos}</td>
                                <td>{t.status}</td>
                                <td className={t.pnl >= 0 ? "text-green-500" : "text-red-500"}>${t.pnl.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
        <Card>
            <CardHeader>
                <CardTitle>Top 5 Gainer</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="text-sm space-y-1">
                    {gainers.map((item, i) => (
                        <li key={i} className="flex justify-between">
                            <span>{i + 1}. {item.pair}</span>
                            <span className="text-green-500">${item.gain}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
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
        <Card>
            <CardHeader>
                <CardTitle>Top 5 Loser</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="text-sm space-y-1">
                    {losers.map((item, i) => (
                        <li key={i} className="flex justify-between">
                            <span>{i + 1}. {item.pair}</span>
                            <span className="text-red-500">${item.loss}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
