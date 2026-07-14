import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Pagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../api/axiosInstance';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

const transactionSchema = z.object({
  category: z.number().min(1, 'Category is required'),
  type: z.enum(['income', 'expense']),
  amount: z.string().min(1, 'Amount is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'expense', date: format(new Date(), 'yyyy-MM-dd') }
  });

  const selectedType = watch('type');

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [page]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/transactions/?page=${page}`);
      const data = response.data;
      setTransactions(data.results || data || []);
      setTotalPages(Math.ceil((data.count || (data.results || data || []).length) / 20));
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/');
      // API returns paginated categories
      const data = response.data;
      setCategories(data.results || (Array.isArray(data) ? data : [])); 
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const handleOpenModal = (transaction?: any) => {
    if (transaction) {
      setEditingId(transaction.id);
      reset({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description || '',
        date: transaction.date
      });
    } else {
      setEditingId(null);
      reset({ type: 'expense', date: format(new Date(), 'yyyy-MM-dd'), amount: '', description: '' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    reset();
  };

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      if (editingId) {
        await api.put(`/transactions/${editingId}/`, data);
      } else {
        await api.post('/transactions/', data);
      }
      handleCloseModal();
      fetchTransactions();
    } catch (error) {
      console.error('Failed to save transaction', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}/`);
        fetchTransactions();
      } catch (error) {
        console.error('Failed to delete transaction', error);
      }
    }
  };

  // Filter categories based on selected type
  const filteredCategories = categories.filter(c => c.type === selectedType);

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Transactions</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Add Transaction
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{format(new Date(tx.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell>{tx.category_name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={tx.type.toUpperCase()} 
                        size="small"
                        color={tx.type === 'income' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: tx.type === 'income' ? 'success.main' : 'error.main' }}>
                      {tx.type === 'income' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleOpenModal(tx)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(tx.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
            </Box>
          )}
        </Card>
      )}

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Type"
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('type')}
              defaultValue="expense"
              error={!!errors.type}
              helperText={errors.type?.message}
            >
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="income">Income</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Category"
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('category', { valueAsNumber: true })}
              defaultValue=""
              error={!!errors.category}
              helperText={errors.category?.message}
            >
              {filteredCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              margin="normal"
              slotProps={{ 
                htmlInput: { step: "0.01" },
                inputLabel: { shrink: true } 
              }}
              {...register('amount')}
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <TextField
              fullWidth
              label="Date"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              margin="normal"
              {...register('date')}
              error={!!errors.date}
              helperText={errors.date?.message}
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

export default Transactions;
