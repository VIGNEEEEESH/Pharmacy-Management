import React from "react";
import { Button, Form, Input, InputNumber, message, Select } from "antd";
import "./Medicines.css";
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

const onFinish = (values) => {
  console.log(values);
};
const Medicines = () => {
  const onFinish = async (values) => {
    try {
      const response = await fetch(
        "https://pharmacy-management.onrender.com/api/medicine/createMedicine",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values.medicine),
        }
      );
      if (response.status == 201) {
        message.success("Medicine created Successfully");
      } else {
        message.error(
          "Could not create the medicine, the medicine may already exist, please check and try again"
        );
      }
    } catch (err) {
      console.log(err);
      message.error(
        "Could not create the medicine, the medicine may already exist, please check and try again"
      );
    }
  };
  return (
    <div className="Medicines">
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
          <h1>Add Medicine </h1>
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
        <Form.Item
          name={["medicine", "generic"]}
          rules={[
            {
              required: true,
            },
          ]}
          label="Generic"
        >
          <Select placeholder="Select a True/False">
            <Select.Option key="true" value="true">
              True
            </Select.Option>
            <Select.Option key="false" value="false">
              False
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name={["medicine", "price"]}
          rules={[
            {
              required: true,
            },
          ]}
          label="Price"
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={["medicine", "description"]}
          rules={[
            {
              required: true,
            },
          ]}
          label="Description"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 8,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Medicines;
