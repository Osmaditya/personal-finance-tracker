import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Pagination, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/axiosInstance';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['income', 'expense']),
  color: z.string().min(1, 'Color is required'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { type: 'expense', color: '#6366F1' }
  });

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/categories/?page=${page}`);
      const data = response.data;
      const fetchedCategories = data.results || data || [];
      setCategories(fetchedCategories);
      setTotalPages(Math.ceil((data.count || fetchedCategories.length) / 20));
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: any) => {
    if (category) {
      if (category.is_default) {
        alert('Default categories cannot be edited.');
        return;
      }
      setEditingId(category.id);
      reset({
        name: category.name,
        type: category.type,
        color: category.color || '#6366F1',
      });
    } else {
      setEditingId(null);
      reset({ name: '', type: 'expense', color: '#6366F1' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    reset();
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (editingId) {
        await api.patch(`/categories/${editingId}/`, data);
      } else {
        await api.post('/categories/', data);
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category', error);
    }
  };

  const handleDelete = async (category: any) => {
    if (category.is_default) {
      alert('Default categories cannot be deleted.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${category.id}/`);
        fetchCategories();
      } catch (error) {
        console.error('Failed to delete category', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Categories</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Add Category
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
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell align="center">Is Default</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{cat.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={cat.type.toUpperCase()} 
                        size="small"
                        color={cat.type === 'income' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: cat.color }} />
                        <Typography variant="body2">{cat.color}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {cat.is_default ? (
                        <Chip label="Yes" size="small" color="default" variant="outlined" />
                      ) : (
                        <Chip label="No" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleOpenModal(cat)} disabled={cat.is_default}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(cat)} disabled={cat.is_default}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      No categories found.
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
        <DialogTitle>{editingId ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
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
              fullWidth
              label="Color (Hex)"
              type="color"
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('color')}
              error={!!errors.color}
              helperText={errors.color?.message}
              sx={{ '& input': { height: 40, cursor: 'pointer' } }}
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

export default Categories;
