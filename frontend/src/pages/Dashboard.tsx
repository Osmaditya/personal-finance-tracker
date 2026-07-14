import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../api/axiosInstance';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface Summary {
  total_income: string;
  total_expense: string;
  net_savings: string;
}

const CHART_COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#10B981', // Emerald
  '#3B82F6', // Blue
];

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const [summaryRes, trendsRes, breakdownRes] = await Promise.all([
          api.get(`/dashboard/summary/?month=${month}&year=${year}`),
          api.get(`/dashboard/trends/?year=${year}`),
          api.get(`/dashboard/category-breakdown/?month=${month}&year=${year}&type=expense`)
        ]);

        setSummary(summaryRes.data);
        
        const rawTrends = trendsRes.data || [];
        
        // Pad to ensure we show at least 6 months, ending at current month
        const mappedTrends = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(year, month - 1 - i);
          const m = d.getMonth() + 1;
          const y = d.getFullYear();
          const existing = rawTrends.find((t: any) => t.month === m && t.year === y);
          
          mappedTrends.push({
            name: d.toLocaleString('default', { month: 'short' }),
            Income: existing ? parseFloat(existing.income) : 0,
            Expense: existing ? parseFloat(existing.expense) : 0
          });
        }
        setTrends(mappedTrends);

        // Map breakdown for pie chart
        const mappedBreakdown = (breakdownRes.data || []).map((b: any, index: number) => {
          const isDefaultColor = !b.color || b.color.toUpperCase() === '#6366F1';
          return {
            name: b.category_name,
            value: parseFloat(b.total),
            color: isDefaultColor ? CHART_COLORS[index % CHART_COLORS.length] : b.color
          };
        });
        setBreakdown(mappedBreakdown);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Overview</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <TrendingUpIcon color="secondary" />
                <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Total Income</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                ₹{summary ? parseFloat(summary.total_income).toLocaleString() : '0'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <TrendingDownIcon color="error" />
                <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Total Expense</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                ₹{summary ? parseFloat(summary.total_expense).toLocaleString() : '0'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <AccountBalanceIcon color="primary" />
                <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Net Savings</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                ₹{summary ? parseFloat(summary.net_savings).toLocaleString() : '0'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Income vs Expense Trends</Typography>
              <Box sx={{ height: 350, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                    <Legend verticalAlign="top" height={36}/>
                    <Area type="monotone" dataKey="Income" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="Expense" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Expense Breakdown</Typography>
              {breakdown.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: "center", mt: 10 }}>No expenses this month</Typography>
              ) : (
                <Box sx={{ height: 350, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={breakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        isAnimationActive={true}
                        stroke="none"
                      >
                        {breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
