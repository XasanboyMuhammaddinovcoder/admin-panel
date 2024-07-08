import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Input, Space } from "antd";
import { MdModeEditOutline } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc as deleteDocument,
  updateDoc as updateDocument,
  doc as getDocument,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import type { ColumnsType } from 'antd/es/table';

interface Product {
  id: string;
  name: string;
  price: number;
}

const TopProducts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form] = Form.useForm();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const columns: ColumnsType<Product> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (_text: string, _record: Product, index: number) => index + 1,
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_text: string, record: Product) => (
        <Space size="middle">
          <Button title="Edit" type="primary" onClick={() => handleEdit(record)}><MdModeEditOutline /></Button>
          <Button title="Delete" onClick={() => handleDelete(record.id)}><FaRegTrashCan className="text-[red]" /></Button>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
    setSelectedProductId(null);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await handleFirebaseOperation(values);
    } catch (error) {
      alert("Error: " + (error as Error).message);
    }
  };

  const handleFirebaseOperation = async (values: { name: string; price: number }) => {
    try {
      setLoading(true);

      if (selectedProductId) {
        const productRef = getDocument(db, `topProducts/${selectedProductId}`);
        await updateDocument(productRef, { ...values });
      } else {
        await addDoc(collection(db, "topProducts"), { ...values });
      }

      handleCancel();
      setLoading(false);
      fetchProducts();
    } catch (error) {
      alert("Error: " + (error as Error).message);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "topProducts"));
    const productsList: Product[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    setProducts(productsList);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await deleteDocument(getDocument(db, "topProducts", productId));
        fetchProducts();
      } catch (error) {
        alert("Error: " + (error as Error).message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (product: Product) => {
    form.setFieldsValue({
      name: product.name,
      price: product.price,
    });
    setSelectedProductId(product.id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100 p-4">
      <h1 className="text-center text-[40px] uppercase mb-6">top selling</h1>
      <Table className="w-full" columns={columns} dataSource={products} rowKey="id" />

      <Modal
        title={selectedProductId ? "Edit Product" : "Add Product"}
        visible={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter price!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
      <div className="mb-6 fixed bottom-[30px] right-[30px]">
        <Button title="Add Product" type="primary" onClick={showModal}>+</Button>
      </div>
    </div>
  );
};

export default TopProducts;
