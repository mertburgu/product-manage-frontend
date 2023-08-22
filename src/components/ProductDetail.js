import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function ProductDetail({ selectedProduct, modalIsOpen, closeModal }) {
    const [productActivities, setProductActivities] = useState([]);
    const [stockChange, setStockChange] = useState(0);

    useEffect(() => {
        if (selectedProduct) {
            fetchProductActivities(selectedProduct._id);
        }
    }, [selectedProduct]);

    const fetchProductActivities = async (productId) => {
        try {
            const activitiesResponse = await axios.get(`http://localhost:3000/api/products/${productId}/activities`, {
                headers: {
                    'auth-token': localStorage.getItem('token'),
                },
            });

            setProductActivities(activitiesResponse.data);
        } catch (error) {
            console.error('Ürün aktivitelerini getirirken hata oluştu:', error);
        }
    };

    const handleChangeQuantity = async (action) => {
        const activityName = action === 'add' ? 'add' : 'remove';
            debugger
        try {
            const activityData = {
                activity:activityName,
                quantity: stockChange
            };
            debugger


            await axios.post(`http://localhost:3000/api/products/${selectedProduct._id}/activities`, activityData, {
                headers: {
                    'auth-token': localStorage.getItem('token'),
                },
            });

            setStockChange(0);
            closeModal();
            fetchProductActivities(selectedProduct._id);
        } catch (error) {
            console.error('Stok değişikliği yapılırken hata oluştu:', error);
        }
    };

    if (!selectedProduct) {
        return;
    }

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Ürün Detayları"
        >
            <h2>Ürün Detayları</h2>
            <p>Ürün Kodu: {selectedProduct.productCode}</p>
            <p>Ürün Adı: {selectedProduct.name}</p>
            <p>Ürün Açıklaması: {selectedProduct.description}</p>
            <p>Stok Miktarı: {selectedProduct.quantity}</p>

            <h3>Ürün Aktiviteleri</h3>
            <ul>
                {productActivities.map(activity => (
                    <li key={activity._id}>{activity.quantity} adet {activity.activity}</li>
                ))}
            </ul>

            <div>
                <button onClick={() => handleChangeQuantity('add')}>Stok Ekle</button>
                <input
                    type="number"
                    value={stockChange}
                    onChange={(e) => setStockChange(parseInt(e.target.value))}
                />
                <button onClick={() => handleChangeQuantity('remove')}>Stok Çıkar</button>
            </div>

            <button onClick={closeModal}>Kapat</button>
        </Modal>
    );
}

export default ProductDetail;
