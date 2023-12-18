import React, { useState, useEffect } from "react";
import { Button, Form, Input, InputNumber, message } from "antd";
import "./Medicines.css";
import { useParams } from "react-router-dom";

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

const EditMedicine = () => {
  const [medicine, setMedicine] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://pharmacy-management.onrender.com/api/medicine/get/${id}`);
        const jsonData = await response.json();
        setMedicine(jsonData.medicine[0]);
        
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await fetch(`https://pharmacy-management.onrender.com/api/medicine/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values.medicine),
      });

      if (response.status === 200) {
        message.success("Medicine updated Successfully");
      } else {
        message.error("Could not update the medicine, please check and try again");
      }
    } catch (err) {
      console.log(err);
      message.error("Could not update the medicine, please check and try again");
    }
  };

  return (
    <div className="Medicines">
      {medicine && (
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          initialValues={{
            medicine: {
              medicineName: medicine.medicineName || "",
              power: medicine.power || 0,
              quantity: medicine.quantity || 0,
              generic: medicine.generic || "",
              price: medicine.price || 0,
              description: medicine.description || "",
            },
          }}
          style={{
            maxWidth: 600,
          }}
          validateMessages={validateMessages}
        >
          <center>
            <h1>Edit Medicine</h1>
          </center>
 <Form.Item
        name={["medicine", "medicineName"]}
        label="Medicine Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["medicine", "power"]}
        label="Power / Strength"
        rules={[
          {
            type: "number",
            required: true,
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name={["medicine", "quantity"]}
        label="Quantity"
        rules={[
          {
            type: "number",
            min: 0,
            max: 99,
            required: true,
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item name={["medicine", "generic"]} rules={[
          {
            required: true,
          },
        ]} label="Generic">
        <Input />
      </Form.Item>
      <Form.Item name={["medicine", "price"]} rules={[
          {
            required: true,
          },
        ]} label="Price">
        <InputNumber />
      </Form.Item>
      <Form.Item name={["medicine", "description"]} rules={[
          {
            required: true,
          },
        ]} label="Description">
        <Input.TextArea />
      </Form.Item>
          <Form.Item
            wrapperCol={{
              ...layout.wrapperCol,
              offset: 8,
            }}
          >
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default EditMedicine;
