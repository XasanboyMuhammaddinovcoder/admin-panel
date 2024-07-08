import React, { useState } from "react";
import { Button, Input, Form } from "antd";
import { signInWithEmailAndPassword  } from "firebase/auth";
import {auth} from '../../firebase/config' 
// import 'antd/dist/antd.css';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      
      await signInWithEmailAndPassword(auth, values.email, values.password);
      alert("Ma'lumotlar yuborildi");
    } catch (error) {
      alert("Xatolik yuz berdi: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Emailni kiriting!" },
              { type: "email", message: "Iltimos, to'g'ri email kiriting!" }
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Parolni kiriting!" },
              { min: 8, message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak!" },
              { max: 20, message: "Parol 20 ta belgidan ko'p bo'lmasligi kerak!" }
            ]}
          >
            <Input.Password placeholder="Parol" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
