"use client";

import { Card } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function ExerciseChart({ exercise, data }) {
    const chartData = data.map((d) => {
        const totalVolume = d.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
        const setsCount = d.sets.length;
        const highestWeight = d.sets.reduce((max, s) => Math.max(max, s.weight), 0);
        const avgWeight = setsCount > 0 ? d.sets.reduce((sum, s) => sum + s.weight, 0) / setsCount : 0;

        return {
            date: d.date,
            highestWeight,
            avgWeight,
            setsCount,
            totalVolume
        };
    });

    const totalVolumeAll = chartData.reduce((sum, d) => sum + d.totalVolume, 0);
    const maxVolume = Math.max(...chartData.map(d => d.totalVolume));
    const maxWeightEver = Math.max(...chartData.map(d => d.highestWeight));
    const avgWeightOverall = chartData.length > 0 ? chartData.reduce((sum, d) => sum + d.avgWeight, 0) / chartData.length : 0;

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>{exercise}</Card.Title>
                <div className="mt-2 mb-3">
                    <p>Total Lifted: {totalVolumeAll} kg</p>
                    <p>Max Daily lifted: {maxVolume} kg</p>
                    <p>Highest Weight Lifted: {maxWeightEver} kg</p>
                    <p>Average Weight per Set: {avgWeightOverall.toFixed(1)} kg</p>
                </div>

                { }
                <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            { }
                            <Line type="monotone" dataKey="highestWeight" stroke="#82ca9d" name="Max Weight" />
                            <Line type="monotone" dataKey="avgWeight" stroke="#ffc658" name="Avg Weight" />
                            <Line type="monotone" dataKey="setsCount" stroke="#ff7300" name="Sets" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card.Body>
        </Card>
    );
}
