import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, AppBar, Toolbar, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ProductDetail from './ProductDetail';

function Dashboard({ onLogout }) {
    const [products, setProducts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editOpenDialog, setEditOpenDialog] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', quantity: 0 });
    const [editProduct, setEditProduct] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false); // Modalın açık olup olmadığını saklayan state
    const [selectedProductForModal, setSelectedProductForModal] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);


    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/products', {
                headers: {
                    'auth-token': localStorage.getItem('token'),
                },
            });

            setProducts(response.data);
        } catch (error) {
            console.error('Ürünleri getirirken hata oluştu:', error);
        }
    };

    const handleProductDetail = (product) => {
        setSelectedProductForModal(product);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedProductForModal(null);
        setModalIsOpen(false);
        fetchProducts();
    };

    const handleCreateProduct = async () => {
        if (!newProduct.productCode || !newProduct.name || !newProduct.description) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/products', newProduct, {
                headers: {
                    'auth-token': localStorage.getItem('token'),
                },
            });

            setOpenDialog(false);
            setNewProduct({ productCode: '', name: '', description: '', quantity: 0 });
            fetchProducts();
        } catch (error) {
            console.error('Ürün oluşturulurken hata oluştu:', error);
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setEditOpenDialog(true);
    };

    const handleUpdateProduct = async () => {
        try {
            await axios.put(`http://localhost:3000/api/products/${editProduct._id}`, editProduct, {
                headers: {
                    'auth-token': localStorage.getItem('token'),
                },
            });
            setEditOpenDialog(false);
            setEditProduct(null);
            fetchProducts();
        } catch (error) {
            console.error('Ürün güncellenirken hata oluştu:', error);
        }
    };

    const handleDelete = async (productId) => {
        const confirmDelete = window.confirm("Bu ürünü silmek istediğinizden emin misiniz?");
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/api/products/${productId}`, {
                headers: {
                    'auth-token': localStorage.getItem('token'),
                },
            });

            fetchProducts();
        } catch (error) {
            console.error('Ürün silinirken hata oluştu:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Intl.DateTimeFormat('tr-TR', options).format(new Date(dateString));
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Ürün Yönetimi
                    </Typography>
                    <Button color="inherit" onClick={() => setOpenDialog(true)}>
                        <AddIcon />
                        Yeni Ürün Ekle
                    </Button>
                    <IconButton onClick={onLogout} color="inherit">
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ürün Kodu</TableCell>
                                <TableCell>Ürün Adı</TableCell>
                                <TableCell>Ürün Açıklaması</TableCell>
                                <TableCell>Stok Miktarı</TableCell>
                                <TableCell>Oluşturma Tarihi</TableCell>
                                <TableCell>Güncellenme Tarihi</TableCell>
                                <TableCell>İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>{product.productCode}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>{formatDate(product.createdAt)}</TableCell>
                                    <TableCell>{formatDate(product.updatedAt)}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleProductDetail(product)}>
                                            <VisibilityIcon />
                                        </Button>

                                        <Button onClick={() => handleEdit(product)}>
                                            <EditIcon />
                                        </Button>
                                        <Button onClick={() => handleDelete(product._id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <ProductDetail
                selectedProduct={selectedProductForModal}
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
            />
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Yeni Ürün Ekle</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Ürün Kodu"
                        value={newProduct.productCode}
                        onChange={(e) => setNewProduct({ ...newProduct, productCode: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Ürün Adı"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Ürün Açıklaması"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Stok Miktarı"
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        İptal
                    </Button>
                    <Button onClick={handleCreateProduct} color="primary">
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={editOpenDialog} onClose={() => setEditOpenDialog(false)}>
                <DialogTitle>Ürünü Düzenle</DialogTitle>
                <DialogContent>
                    {/* Düzenleme formu */}
                    <TextField
                        label="Ürün Kodu"
                        value={editProduct?.productCode || ''}
                        onChange={(e) => setEditProduct({ ...editProduct, productCode: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Ürün Adı"
                        value={editProduct?.name || ''}
                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Ürün Açıklaması"
                        value={editProduct?.description || ''}
                        onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Stok Miktarı"
                        type="number"
                        value={editProduct?.quantity || 0}
                        onChange={(e) => setEditProduct({ ...editProduct, quantity: e.target.value })}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpenDialog(false)} color="primary">
                        İptal
                    </Button>
                    <Button onClick={handleUpdateProduct} color="primary">
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Dashboard;
