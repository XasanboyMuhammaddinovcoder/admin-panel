import { useState, useEffect } from "react";
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
import {
  db,
  storage,
} from "../../firebase/config";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ColumnsType } from "antd/es/table";



const MightProducts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form] = Form.useForm();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  interface Product {
    id: string;
    name: string;
    price: number;
    img: string;
  }
  
  const columns: ColumnsType<Product> = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
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
          <Button title="Delete"  onClick={() => handleDelete(record.id)}><FaRegTrashCan className="text-[red]"/></Button>
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
      const file = values.img?.[0]?.originFileObj;

      setLoading(true);

      if (file) {
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            setLoading(false);
            alert("Error: " + error.message);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            handleFirebaseOperation({ ...values, img: downloadURL });
          }
        );
      } else {
        handleFirebaseOperation(values);
      }
    } catch (error) {
      alert("Error: " + (error as Error).message);
    }
  };

  const handleFirebaseOperation = async (values: string[] | number[] ) => {
    try {
      setLoading(true);

      if (selectedProductId) {
        const productRef = getDocument(db, `MightProducts/${selectedProductId}`);
        await updateDocument(productRef, { ...values });
        // alert("Product updated");
      } else {
        await addDoc(collection(db, "mightProducts"), { ...values });
        // alert("Product added");
      }

      handleCancel();
      setLoading(false);
      fetchProducts();
    } catch (error) {
    //   alert("Error: " + (error as Error).message);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "mightProducts"));
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
        await deleteDocument(getDocument(db, "mightProducts", productId));
        // alert("Product deleted");
        fetchProducts(); // Update the product list after deletion
      } catch (error) {
        // alert("Error: " + (error as Error).message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (product: Product) => {
    form.setFieldsValue({
      name: product.name,
      price: product.price,
      // img: product.img // Uncomment this if you want to edit the image
    });
    setSelectedProductId(product.id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100 p-4">
   
        <h1 className="text-center text-[40px] uppercase mb-6">You might also like</h1>
      <Table className="w-full " columns={columns} dataSource={products.map((product, index) => ({ ...product, index }))} rowKey="id" />

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
          {/* Uncomment this section if you want to allow editing of the image */}
          {/* <Form.Item
            name="img"
            label="Upload Image"
            rules={[{ required: true, message: "Please upload image!" }]}
            valuePropName="fileList"
            getValueFromEvent={(e) => e && e.fileList}
          >
            <Upload beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item> */}
        </Form>
        
      </Modal>
      <div className="mb-6 fixed bottom-[30px] right-[30px]">
        <Button title="Add Product" type="primary" onClick={showModal}>+</Button>
      </div>
    </div>
  );
};

export default MightProducts;
