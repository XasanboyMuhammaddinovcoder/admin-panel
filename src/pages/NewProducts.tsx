// import React, { useState, useEffect } from "react";
// import { Button, Table, Modal, Form, Input, Select, Space } from "antd";
// import { MdModeEditOutline } from "react-icons/md";
// import { FaRegTrashCan } from "react-icons/fa6";
// import {
//   addDoc,
//   collection,
//   getDocs,
//   deleteDoc as deleteDocument,
//   updateDoc as updateDocument,
//   doc as getDocument,
// } from "firebase/firestore";
// import { db } from "../../firebase/config";
// import { ColumnsType } from "antd/es/table";

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   category: string;
// }

// const dataCategory = ['All', 'XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'];

// const NewProducts: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [form] = Form.useForm();
//   const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");

//   const columns: ColumnsType<Product> = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       key: "id",
//       render: (_text: string, _record: Product, index: number) => index + 1,
//       width: 100,
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Price",
//       dataIndex: "price",
//       key: "price",
//       align: "right",
//     },
//     {
//       title: "Category",
//       dataIndex: "category",
//       key: "category",
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       align: "center",
//       render: (_text: string, record: Product) => (
//         <Space size="middle">
//           <Button title="Edit" type="primary" onClick={() => handleEdit(record)}><MdModeEditOutline /></Button>
//           <Button title="Delete" onClick={() => handleDelete(record.id)}><FaRegTrashCan className="text-[red]" /></Button>
//         </Space>
//       ),
//     },
//   ];

//   const showModal = () => {
//     setIsModalOpen(true);
//     setSelectedProductId(null);
//     form.resetFields();
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//     form.resetFields();
//   };

//   const handleOk = async () => {
//     try {
//       const values = await form.validateFields();
//       setLoading(true);
//       await handleFirebaseOperation(values);
//     } catch (error) {
//       alert("Error: " + (error as Error).message);
//     }
//   };

//   const handleFirebaseOperation = async (values: { name: string; price: number; category: string }) => {
//     try {
//       setLoading(true);

//       if (selectedProductId) {
//         const productRef = getDocument(db, `products/${selectedProductId}`);
//         await updateDocument(productRef, { ...values });
//       } else {
//         await addDoc(collection(db, "products"), { ...values });
//       }

//       handleCancel();
//       setLoading(false);
//       fetchProducts();
//     } catch (error) {
//       alert("Error: " + (error as Error).message);
//       setLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     const querySnapshot = await getDocs(collection(db, "products"));
//     const productsList: Product[] = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     })) as Product[];
//     setProducts(productsList);
//     setFilteredProducts(productsList);
//   };

//   const handleDelete = async (productId: string) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         setLoading(true);
//         await deleteDocument(getDocument(db, "products", productId));
//         fetchProducts();
//       } catch (error) {
//         alert("Error: " + (error as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleEdit = (product: Product) => {
//     form.setFieldsValue({
//       name: product.name,
//       price: product.price,
//       category: product.category,
//     });
//     setSelectedProductId(product.id);
//     setIsModalOpen(true);
//   };

//   const handleSearch = (value: string) => {
//     setSearchTerm(value);
//     filterProducts(value, selectedCategory);
//   };

//   const handleCategoryChange = (value: string) => {
//     setSelectedCategory(value);
//     filterProducts(searchTerm, value);
//   };

//   const filterProducts = (term: string, category: string) => {
//     const filtered = products.filter(product => {
//       const matchesTerm = product.name.toLowerCase().includes(term.toLowerCase());
//       const matchesCategory = category === "All" || product.category === category;
//       return matchesTerm && matchesCategory;
//     });
//     setFilteredProducts(filtered);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <div className="flex flex-col items-center h-screen bg-gray-100 p-4">
//       <h1 className="text-center text-[40px] mb-6">NEW ARRIVALS</h1>
//       <header className="flex items-center justify-between w-full mb-6">
//         <Input
//           placeholder="Search products"
//           value={searchTerm}
//           onChange={e => handleSearch(e.target.value)}
//           className="w-[250px]"
//         />
//         <Select
//           placeholder="Select category"
//           className="w-[250px]"
//           onChange={handleCategoryChange}
//           value={selectedCategory}
//           allowClear
//         >
//           {dataCategory.map((category, index) => (
//             <Select.Option key={index} value={category}>
//               {category}
//             </Select.Option>
//           ))}
//         </Select>
//       </header>
//       <Table
//         className="w-full"
//         columns={columns}
//         dataSource={filteredProducts}
//         rowKey="id"
//       />
//       <Modal
//         title={selectedProductId ? "Edit Product" : "Add Product"}
//         visible={isModalOpen}
//         onCancel={handleCancel}
//         onOk={handleOk}
//         confirmLoading={loading}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="name"
//             label="Product Name"
//             rules={[{ required: true, message: "Please enter product name!" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="price"
//             label="Price"
//             rules={[{ required: true, message: "Please enter price!" }]}
//           >
//             <Input type="number" />
//           </Form.Item>
//           <Form.Item
//             name="category"
//             label="Category"
//             rules={[{ required: true, message: "Please select category!" }]}
//           >
//             <Select>
//               {dataCategory.slice(1).map((category, index) => (
//                 <Select.Option key={index} value={category}>
//                   {category}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>
//       <div className="mb-6 fixed bottom-[30px] right-[30px]">
//         <Button title="Add Product" type="primary" onClick={showModal}>+</Button>
//       </div>
//     </div>
//   );
// };

// export default NewProducts;


import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Input, Select, Space } from "antd";
import { MdModeEditOutline } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc as deleteDocument,
  updateDoc as updateDocument,
  doc as getDocument,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { ColumnsType } from "antd/es/table";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

const dataCategory = ['All', 'XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'];

const NewProducts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [form] = Form.useForm();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

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
      title: "Category",
      dataIndex: "category",
      key: "category",
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

  const handleFirebaseOperation = async (values: { name: string; price: number; category: string }) => {
    try {
      setLoading(true);

      if (selectedProductId) {
        const productRef = getDocument(db, `products/${selectedProductId}`);
        await updateDocument(productRef, { ...values });
      } else {
        await addDoc(collection(db, "products"), { ...values });
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
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsList: Product[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    setProducts(productsList);
    setFilteredProducts(productsList);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await deleteDocument(getDocument(db, "products", productId));
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
      category: product.category,
    });
    setSelectedProductId(product.id);
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterProducts(value, selectedCategory);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    filterProducts(searchTerm, value);
  };

  const filterProducts = (term: string, category: string) => {
    const filtered = products.filter(product => {
      const matchesTerm = product.name.toLowerCase().includes(term.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      return matchesTerm && matchesCategory;
    });
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100 p-4">
      <h1 className="text-center text-[40px] mb-6">NEW ARRIVALS</h1>
      <header className="flex items-center justify-between w-full mb-6">
        <Input
          placeholder="Search products"
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
          className="w-[250px]"
        />
        <Select
          placeholder="Select category"
          className="w-[250px]"
          onChange={handleCategoryChange}
          value={selectedCategory}
          allowClear
        >
          {dataCategory.map((category, index) => (
            <Select.Option key={index} value={category}>
              {category}
            </Select.Option>
          ))}
        </Select>
      </header>
      <Table
        className="w-full"
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
      />
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
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select category!" }]}
          >
            <Select>
              {dataCategory.slice(1).map((category, index) => (
                <Select.Option key={index} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div>
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
      </div>
        </Form>
      </Modal>
      <div className="mb-6 fixed bottom-[30px] right-[30px]">
        <Button title="Add Product" type="primary" onClick={showModal}>+</Button>
      </div>
     
    </div>
  );
};

export default NewProducts;


