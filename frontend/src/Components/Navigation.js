import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, ShopOutlined,PlusCircleOutlined,EditOutlined,ShoppingCartOutlined } from '@ant-design/icons';

const Navigation = () => {
  return (
    <Menu theme="dark" mode="horizontal" selectedKeys={[]}>
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <NavLink to="/">Home</NavLink>
      </Menu.Item>
      <Menu.Item key="medicines" icon={<PlusCircleOutlined />}>
        <NavLink to="/medicines">Add Medicines</NavLink>
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        <NavLink to="/edit">Edit / Delete Medicines</NavLink>
      </Menu.Item>
      <Menu.Item key="buy" icon={<ShopOutlined />}>
        <NavLink to="/buy">Buy</NavLink>
      </Menu.Item>
      <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
        <NavLink to="/cart/vignesh">Cart</NavLink>
      </Menu.Item>
    </Menu>
  );
};

export default Navigation;
