import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Input } from "antd";
import "./Home.css";
const { Search } = Input;
const Home = () => {
  const [data, setData] = useState([]); // State to store fetched data
  const [filteredData, setFilteredData] = useState([]);
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
    </div>
  );
};

export default Home;
