import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Input, Button, Modal, message } from "antd";
import "./Home.css";
import { Navigate, useNavigate } from "react-router-dom";
const { Search } = Input;
const EditDisplay = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); // State to store fetched data
  const [filteredData, setFilteredData] = useState([]);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const columns = [
    {
      title: "Medicine Name",
      dataIndex: "medicineName",
      key: "medicineName",
    },
    {
      title: "Power",
      dataIndex: "power",
      key: "power",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Generic",
      dataIndex: "generic",
      key: "generic",
      render: (generic) => (
        <Tag color={generic === "true" ? "green" : "volcano"}>
          {generic.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Edit / Delete",
      dataIndex: "Edit / Delete",
      key: "Edit / Delete",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="danger" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch(
          "https://pharmacy-management.onrender.com/api/medicine/allmedicines"
        );
        const jsonData = await response.json();
        setData(jsonData.medicines); // Set the fetched data in the state
        setFilteredData(jsonData.medicines);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMedicines(); // Don't forget to invoke the function
  }, []);
  const handleEdit = (record) => {
    navigate(`/editMedicine/${record._id}`);
  };

  const handleDelete = async (record) => {
    setRecordToDelete(record);
    console.log(record._id);
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    if (recordToDelete) {
      try {
        console.log(recordToDelete._id);
        const response = await fetch(
          `https://pharmacy-management.onrender.com/api/medicine/delete/${recordToDelete._id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          const updatedData = data.filter(
            (item) => item._id !== recordToDelete._id
          );
          setData(updatedData);
          setFilteredData(updatedData);
          message.success("Medicine successfully deleted");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          console.log("Failed to delete");
          message.error("Failed to delete medicine");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }

    // Reset state variables
    setRecordToDelete(null);
    setIsModalVisible(false);
  };

  const resetRecordToDelete = () => {
    setRecordToDelete(null);
    setIsModalVisible(false);
  };

  const handleSearch = (value) => {
    // Filter data based on search value
    const filtered = data.filter((medicine) =>
      medicine.medicineName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };
  const paginationConfig = {
    pageSize: 10, // Number of items per page
    // You can customize additional pagination options here if needed
  };

  return (
    <div className="Home">
      <React.Fragment>
        <Search
          placeholder="Search medicine"
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={paginationConfig}
        />{" "}
        <Modal
          title="Confirm Delete"
          visible={isModalVisible}
          onOk={confirmDelete}
          onCancel={resetRecordToDelete}
          okText="Delete"
          cancelText="Cancel"
        >
          {recordToDelete &&
            `Are you sure you want to delete ${recordToDelete.medicineName}?`}
        </Modal>
      </React.Fragment>
    </div>
  );
};

export default EditDisplay;
