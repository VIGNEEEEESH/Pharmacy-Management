import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, message, Select, Typography } from "antd";
import "./Buy.css";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const Buy = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState({});
  const [enteredQuantity, setEnteredQuantity] = useState(1);
  const [selectedMedicinesList, setSelectedMedicinesList] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch(
          "https://pharmacy-management.onrender.com/api/medicine/allmedicines"
        );
        const jsonData = await response.json();
        setMedicines(jsonData.medicines);
      } catch (err) {
        message.error("Something went wrong");
        console.log(err);
      }
    };
    fetchMedicines();
  }, []);

  const addMedicineToCart = () => {
    if (selectedMedicine && enteredQuantity > 0) {
      setSelectedMedicinesList([
        ...selectedMedicinesList,
        {
          medicineName: selectedMedicine.medicineName,
          quantity: enteredQuantity,
          price: selectedMedicine.price,
        },
      ]);
    }
  };

  const removeMedicine = (index) => {
    const updatedMedicinesList = [...selectedMedicinesList];
    updatedMedicinesList.splice(index, 1);
    setSelectedMedicinesList(updatedMedicinesList);
  };

  const onFinish = async (values) => {
    try {
      const response = await fetch("https://pharmacy-management.onrender.com/api/cart/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.medicine.name,
          medicines: selectedMedicinesList, // Use the selected medicines list here
        }),
      });
      if (response.status === 200) {
        message.success("Medicine created Successfully");
      } else {
        message.error(
          "Could not add the medicine, the medicine might already be added to your cart, please check your cart and try again"
        );
      }
    } catch (err) {
      console.log(err);
      message.error(
        "Could not create the medicine, please check and try again"
      );
    }
  };

  return (
    <div className="Buy">
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
        validateMessages={validateMessages}
      >
        <center>
          <h1>Buy</h1>
        </center>
        <Form.Item
          name={["medicine", "name"]}
          label="Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["medicine", "medicineName"]}
          label="Medicine"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a medicine"
            filterOption={true}
            onSearch={(value) => setSearchValue(value)}
            onChange={(value) => {
              const selectedMedicine = medicines.find(
                (medicine) => medicine.medicineName === value
              );
              setSelectedMedicine(selectedMedicine || {});
            }}
            value={selectedMedicine.medicineName}
          >
            {medicines.map((option) => (
              <Select.Option key={option._id} value={option.medicineName}>
                {option.medicineName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {selectedMedicine && (
          <Form.Item
            name={["medicine", "quantity"]}
            label="Quantity"
            rules={[
              {
                type: "number",
                min: 1,
                required: true,
              },
            ]}
          >
            <InputNumber
              onChange={(value) => {
                setEnteredQuantity(value);
                if (selectedMedicine.quantity === 0) {
                  message.error(
                    `${selectedMedicine.medicineName} is out of stock, It will be available soon`
                  );
                } else if (value > selectedMedicine.quantity) {
                  message.error(
                    `Please select the quantity between 1 and ${selectedMedicine.quantity}`
                  );
                }
              }}
            />
          </Form.Item>
        )}
        {selectedMedicine && (
          <Form.Item name={["medicine", "price"]} label="Price">
            <Typography.Text style={{ color: "green", fontWeight: "bold" }}>
              Rs.{selectedMedicine.price} (For Each)
            </Typography.Text>
          </Form.Item>
        )}
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 8,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            disabled={enteredQuantity > selectedMedicine.quantity}
          >
            Add to cart
          </Button>
        </Form.Item>
      </Form>

      <div className="SelectedMedicinesList">
  <h2>Selected Medicines</h2>
  <table style={{ borderCollapse: 'collapse', width: '100%' }}>
    <thead>
      <tr style={{ borderBottom: '1px solid #ddd' }}>
        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Medicine Name</th>
        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Quantity</th>
        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Action</th>
      </tr>
    </thead>
    <tbody>
      {selectedMedicinesList.map((medicine, index) => (
        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{medicine.medicineName}</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{medicine.quantity}</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
            <Button type="link" onClick={() => removeMedicine(index)}>
              Delete
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



      <div className="AddMedicineButton">
        <Button type="primary" onClick={addMedicineToCart}>
          Add Medicine
        </Button>
      </div>
    </div>
  );
};

export default Buy;
