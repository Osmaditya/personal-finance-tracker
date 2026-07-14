import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, TextField, CircularProgress, Divider } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import api from '../api/axiosInstance';
import { format } from 'date-fns';

const Reports: React.FC = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const fetchMonthlyReport = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/reports/monthly/?month=${month}&year=${year}`);
      setReportData(response.data);
    } catch (error) {
      console.error('Failed to fetch report', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: 'csv' | 'excel' | 'pdf') => {
    try {
      const response = await api.get(`/reports/export/${type}/?month=${month}&year=${year}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      
      let extension: string = type;
      if (type === 'excel') extension = 'xlsx';
      
      link.setAttribute("download", `report_${month}_${year}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Failed to export ${type}`, error);
      alert(`Failed to export ${type.toUpperCase()}. Check if backend supports it.`);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Reports</Typography>
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <TextField
                fullWidth
                label="Month"
                type="number"
                slotProps={{ htmlInput: { min: 1, max: 12 } }}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                slotProps={{ htmlInput: { min: 2000 } }}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <Button 
                variant="contained" 
                fullWidth 
                size="large" 
                onClick={fetchMonthlyReport}
                disabled={loading}
                sx={{ height: 56 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate'}
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => handleExport('pdf')}>PDF</Button>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => handleExport('csv')}>CSV</Button>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => handleExport('excel')}>Excel</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : reportData && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Monthly Summary: {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 2, bgcolor: 'rgba(34, 197, 94, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">Total Income</Typography>
                  <Typography variant="h5" color="success.main" sx={{ fontWeight: 700 }}>
                    ₹{parseFloat(reportData.total_income).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">Total Expense</Typography>
                  <Typography variant="h5" color="error.main" sx={{ fontWeight: 700 }}>
                    ₹{parseFloat(reportData.total_expense).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 2, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">Net Savings</Typography>
                  <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                    ₹{parseFloat(reportData.net_savings).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Transactions</Typography>
            {reportData.transactions?.length === 0 ? (
              <Typography color="text.secondary">No transactions in this period.</Typography>
            ) : (
              <Box>
                {reportData.transactions?.map((tx: any, index: number) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{tx.description}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(tx.date), 'MMM dd, yyyy')} • {tx.category__name}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ fontWeight: 600 }} 
                      color={tx.type === 'income' ? 'success.main' : 'error.main'}
                    >
                      {tx.type === 'income' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Reports;
