import {
  CalendarOutlined,
  // AppstoreOutlined,
  // LinkOutlined,
  MailOutlined,
  // SettingOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import type { GetProp, MenuProps } from 'antd';
import { NavLink } from 'react-router-dom';
// import Dashboard from '../pages/Dashboard';



type MenuItem = GetProp<MenuProps, 'items'>[number];

const items: MenuItem[] = [
  {
    key: '1',
    icon: <MailOutlined />,
    label: <NavLink to={'/'}>Dashboard</NavLink>,
  },
  {
    key: '2',
    icon: <CalendarOutlined />,
    label: <NavLink to={'/dashboard'}>Products</NavLink>,
    children: [
      { key: '3', label: <NavLink to={'/dashboard/new'}>New Products</NavLink> },
      { key: '4', label: <NavLink to={'/dashboard/top'}>Top Products</NavLink>},
      { key: '5', label: <NavLink to={'/dashboard/might'}>You might Products</NavLink>},
    ],
  },


];

export default function Sidebar() {

  return (
    <>

      <Menu
        style={{ width: 350, minHeight: "100vh", padding: "20px" }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        theme='dark'

        items={items}
      />
    </>
  );
}
