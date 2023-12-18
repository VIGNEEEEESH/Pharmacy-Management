import React, { useState, useEffect, useMemo } from "react";
import { Typography } from 'antd';

import {
  Table,
  Space,
  Button,
  notification,
  Modal,
  InputNumber,
  message,
  Spin,
} from "antd";

import {
  ShoppingCartOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import "./Cart.css";
import { useNavigate, useParams } from "react-router-dom";




const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [cartId, setCartId] = useState(null);
  const { name } = useParams();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [medicinePrices, setMedicinePrices] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [allMedicines, setAllMedicines] = useState([]);
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { Text } = Typography;
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://pharmacy-management.onrender.com/api/cart/get/${name}`
        );
        const jsonData = await response.json();
        const cartMedicines = jsonData.cart.medicines;
        setCartData(cartMedicines);
        setCartId(jsonData.cart._id);

        const cartMedicinePrices = {};
        cartMedicines.forEach((cartItem) => {
          cartMedicinePrices[cartItem.medicineName] = cartItem.price;
        });

        setMedicinePrices(cartMedicinePrices);

        const allMedicinesResponse = await fetch(
          "https://pharmacy-management.onrender.com/api/medicine/allmedicines"
        );
        const allMedicinesData = await allMedicinesResponse.json();
        const allMedicines = allMedicinesData.medicines;
        setAllMedicines(allMedicines);

        const updatedCartData = cartMedicines.map((cartItem) => {
          const matchingMedicine = allMedicines.find(
            (medicine) => medicine.medicineName === cartItem.medicineName
          );
          if (matchingMedicine && cartItem.quantity > matchingMedicine.quantity) {
            cartItem.quantity = matchingMedicine.quantity;
          }
          return cartItem;
        });

        setCartData(updatedCartData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching cart data:", error);
        notification.warning({
          message: "Warning",
          description: "Please add medicines to the cart",
        });
      }
    };

    fetchData();
  }, [name]);
  const columns = [
    {
      title: "Medicine Name",
      dataIndex: "medicineName",
      key: "medicineName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(record, value)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveFromCart(record)}
          >
            Remove
          </Button>
        </Space>
      ),
    },
  ];
  const showDeleteConfirm = (item) => {
    setItemToDelete(item);
    setIsDeleteModalVisible(true);
  };
  
  const memoizedTotalPrice = useMemo(() => {
    return cartData.reduce((total, cartItem) => {
      const price = medicinePrices[cartItem.medicineName] || 0;
      return total + price * cartItem.quantity;
    }, 0);
  }, [cartData, medicinePrices]);

  useEffect(() => {
    setTotalPrice(memoizedTotalPrice);
  }, [memoizedTotalPrice]);

  const handleQuantityChange = (item, value) => {
    const updatedCartData = cartData.map((cartItem) => {
      if (cartItem._id === item._id) {
        return { ...cartItem, quantity: value };
      }
      return cartItem;
    });

    setCartData(updatedCartData);

    const exceedsAvailableQuantity = updatedCartData.some((cartItem) => {
      const matchingMedicine = allMedicines.find(
        (medicine) => medicine.medicineName === cartItem.medicineName
      );
      return matchingMedicine && cartItem.quantity > matchingMedicine.quantity;
      
    });
    
    setIsCheckoutDisabled(exceedsAvailableQuantity);
    
    

    const updatedTotalPrice = memoizedTotalPrice;
    setTotalPrice(updatedTotalPrice);
  };

  const handleRemoveFromCart = (item) => {
    showDeleteConfirm(item);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `https://pharmacy-management.onrender.com/api/cart/delete/${cartId}/${itemToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const updatedCartData = cartData.filter(
          (cartItem) =>
            cartItem._id !== itemToDelete._id ||
            cartItem.medicineName !== itemToDelete.medicineName
        );

        setCartData(updatedCartData);

        const updatedMedicinePrices = { ...medicinePrices };
        delete updatedMedicinePrices[itemToDelete.medicineName];
        setMedicinePrices(updatedMedicinePrices);

        notification.success({
          message: "Medicine removed",
          description: "The medicine was successfully removed from the cart.",
        });
      } else {
        notification.error({
          message: "Error",
          description: "Failed to remove the medicine from the cart.",
        });
      }
    } catch (err) {
      console.error("Error removing medicine from cart:", err);
      notification.error({
        message: "Error",
        description:
          "An error occurred while removing the medicine from the cart.",
      });
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const invalidCartItem = cartData.find((cartItem) => {
        const matchingMedicine = allMedicines.find(
          (medicine) => medicine.medicineName === cartItem.medicineName
        );
        return (
          matchingMedicine && cartItem.quantity > matchingMedicine.quantity
        );
      });

      if (invalidCartItem) {
        notification.error({
          message: "Error",
          description: `Quantity for ${invalidCartItem.medicineName} exceeds available quantity (${invalidCartItem.quantity}).`,
        });
        return;
      }

      for (const cartItem of cartData) {
        const response = await fetch(
          `https://pharmacy-management.onrender.com/api/medicine/buy/${cartItem.medicineName}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: cartItem.quantity }),
          }
        );

        if (response.status !== 200) {
          console.error(
            `Error updating quantity for medicine: ${cartItem._id}`
          );
        }
      }

      const response = await fetch(
        `https://pharmacy-management.onrender.com/api/cart/deleteCart/${cartId}`,
        { method: "DELETE" }
      );

      notification.success({
        message: "Checkout Successful",
        description: "Medicines have been successfully purchased.",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error during checkout:", error);

      message.error({
        message: "Error",
        description: "An error occurred during checkout. Please try again.",
      });
    }
  };

  return (
    <div className="cart-page">
      <h1>
        <ShoppingCartOutlined /> Your Cart
      </h1>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <>
          <Table dataSource={cartData} columns={columns} pagination={false} />
          <div className="cart-summary">
            {cartData.length > 0 && allMedicines.length > 0 && (
              <p>Total: Rs.{totalPrice.toFixed(2)}</p>
            )}
            <Button
              type="primary"
              size="large"
              disabled={isCheckoutDisabled}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
            
          </div>
      <center>  <h3>  <Text keyboard mark>&nbsp;Caution : Please remove the duplicate medicines as they won't be considered&nbsp;</Text> </h3></center>
        </>
      )}
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      >
        Are you sure you want to remove this medicine from the cart?
      </Modal>
    </div>
  );
};

export default Cart;
