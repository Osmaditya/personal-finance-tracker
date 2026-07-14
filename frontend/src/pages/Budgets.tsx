import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, LinearProgress, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import api from '../api/axiosInstance';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const budgetSchema = z.object({
  category: z.number().min(1, 'Category is required'),
  monthly_limit: z.string().min(1, 'Monthly limit is required'),
  month: z.number().min(1).max(12),
  year: z.number().min(2000)
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: { month: currentMonth, year: currentYear }
  });

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/budgets/?month=${currentMonth}&year=${currentYear}`);
      const data = response.data;
      setBudgets(data.results || data || []);
    } catch (error) {
      console.error('Failed to fetch budgets', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/');
      const data = response.data;
      setCategories(data.results || (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const handleOpenModal = (budget?: any) => {
    if (budget) {
      setEditingId(budget.id);
      setValue('category', budget.category);
      setValue('monthly_limit', budget.monthly_limit);
      setValue('month', budget.month);
      setValue('year', budget.year);
    } else {
      setEditingId(null);
      reset({ month: currentMonth, year: currentYear });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    reset();
  };

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      const payload = {
        ...data,
        month: data.month || currentMonth,
        year: data.year || currentYear
      };
      
      if (editingId) {
        await api.put(`/budgets/${editingId}/`, payload);
      } else {
        await api.post('/budgets/', payload);
      }
      handleCloseModal();
      fetchBudgets();
    } catch (error: any) {
      console.error('Failed to save budget', error);
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      alert(`Failed to save budget: ${errorMsg}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await api.delete(`/budgets/${id}/`);
        fetchBudgets();
      } catch (error) {
        console.error('Failed to delete budget', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Budgets</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Create Budget
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : budgets.length === 0 ? (
        <Typography color="text.secondary">No budgets set for this month.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {budgets.map((budget) => {
            const limit = parseFloat(budget.monthly_limit);
            const spent = budget.spent;
            const percentage = Math.min((spent / limit) * 100, 100);
            
            let progressColor = 'primary';
            if (budget.status === 'warning') progressColor = 'warning';
            if (budget.status === 'over') progressColor = 'error';

            return (
              <Card key={budget.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{budget.category_name}</Typography>
                    <Box>
                      <IconButton size="small" color="primary" onClick={() => handleOpenModal(budget)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(budget.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Spent: ₹{spent.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Limit: ₹{limit.toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={percentage} 
                    color={progressColor as any}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" color={budget.status === 'over' ? 'error' : 'text.secondary'}>
                      {budget.status === 'over' ? `Over budget by ₹${Math.abs(budget.remaining).toLocaleString()}` : `${percentage.toFixed(0)}% used`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Remaining: ₹{Math.max(budget.remaining, 0).toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Budget' : 'Create Budget'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Category"
              margin="normal"
              {...register('category', { valueAsNumber: true })}
              defaultValue=""
              error={!!errors.category}
              helperText={errors.category?.message}
            >
              {categories.filter(c => c.type === 'expense').map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Monthly Limit"
              type="number"
              slotProps={{ htmlInput: { step: "0.01" } }}
              margin="normal"
              {...register('monthly_limit')}
              error={!!errors.monthly_limit}
              helperText={errors.monthly_limit?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Budgets;
