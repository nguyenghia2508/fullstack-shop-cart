import { useState } from "react";
import { Link } from "react-router-dom";
import { Button,Modal } from "antd";
import { DownloadOutlined } from "@mui/icons-material";
import adminApi from "../../../api/admin/adminApi";
import Loading from "../../common/Loading";
import "./styles.scss"

const ModalExport = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [transaction, setTransaction] = useState("")
  const showModal = async () => {
    setIsModalOpen(true);
    try {
        setLoading(true)
        const res = await adminApi.exportTransaction()
        if (res.state === 'success') {
            setLoading(false)
            setTransaction(res.data.toString())
        }
    } catch (err) {
        console.log(err)
    } 
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  // Custom footer không bao gồm nút bạn muốn ẩn
  const modalFooter = [
    // <Button key="cancel" onClick={handleCancel}>
    //   Cancel
    // </Button>,
    // <Button key="ok" type="primary" onClick={handleOk}>
    //   OK
    // </Button>
  ];

  const handleDownload = () => {
    // Tạo nội dung của tệp tin từ biến transaction
    const fileContent = transaction.replace(/,/g, '\n');
    // Tạo Blob từ nội dung tệp tin
    const blob = new Blob([fileContent], { type: 'text/plain' });

    // Tạo URL từ Blob
    const url = window.URL.createObjectURL(blob);

    // Tạo một thẻ <a> để tải xuống tệp tin
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transaction_data.txt');
    document.body.appendChild(link);

    // Simulate click để tải xuống tệp tin
    link.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <>
        <Link
            onClick={showModal}
        >
        <button type="button" className="btn btn-info add-new"><i className="fa fa-plus"></i> Export</button>
        </Link>
        <Modal title="Basic Modal" open={isModalOpen} footer={modalFooter} onCancel={handleCancel}>
            {loading ? 
            <Loading/> 
            : 
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
                Download
            </Button>
            }
        </Modal>
    </>
  );
};

export default ModalExport;