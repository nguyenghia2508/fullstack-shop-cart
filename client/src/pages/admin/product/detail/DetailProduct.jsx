import { Link, useNavigate, useParams } from "react-router-dom"
import { useState,useEffect } from "react"
import AdminLayout from "../../../../components/layout/admin/AdminLayout";
import adminApi from "../../../../api/admin/adminApi";
import { toast } from "react-toastify";
import './detail-style.scss'
import '../add/add-style.scss'

const DetailProduct = () => {

    const product = useParams()
    const [title, setTitle] = useState(null)
    const [currPage, setCurrPage] = useState(null)
    const [infoProduct, setinfoProduct] = useState([]);

    useEffect(() => {
        const getDetailProduct= async () => {
            try {
                const data = await adminApi.detailProduct(product.id)
                setTitle(data.title)
                setCurrPage(data.currPage)
                setinfoProduct(data.result)
            } catch (err) {
                const errors = err.data.msg
                toast.error(errors, {
                    position: 'top-left',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#fff' },
                });
            }
        }
        getDetailProduct();
    }, []);

    return (
        <AdminLayout 
        title={title}
        currPage={currPage}
        add={
            <div className="addPage">
                 <div className="formbold-main-wrapper">
                    {infoProduct && infoProduct.length !== 0 
                    ? 
                    infoProduct.map((item,index) => (
                        <div className="formbold-form-wrapper" key={index}>
                            <div className="file-image myImage-detail">
                                <img src={`${item.image.path}`} alt=""></img>
                            </div>
                            <form>
                            <div className="formbold-input-wrapp formbold-mb-3">
                                <label htmlFor="firstname" className="formbold-form-label"> Name </label>
                                <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={`${item.name}`}
                                    id="name"
                                    placeholder="Product name"
                                    className="formbold-form-input"
                                    disabled
                                />
                                </div>
                            </div>
                            <div className="formbold-mb-3">
                                <label htmlFor="number" className="formbold-form-label"> Number </label>
                                <input
                                type="number"
                                name="number"
                                id="number"
                                value={`${item.number}`}
                                placeholder="0"
                                className="formbold-form-input number-detail"
                                disabled
                                />
                            </div>

                            <div className="formbold-mb-3">
                                <label htmlFor="dom" className="formbold-form-label"> Date of manufacture </label>
                                <input type="datetime-local" name="dom" id="dom" className="formbold-form-input" value={`${item.date}`} disabled/>
                            </div>
                            <div className="formbold-mb-3">
                                <label className="formbold-form-label" htmlFor="type">Categories</label>
                                <select className="formbold-form-input type" name="type" id="type" disabled>
                                    <option value={`${item.type}`}>{item.type}</option>
                                </select>
                            </div>
                            <div className="formbold-input">
                                <div>
                                    <label htmlFor="desc" className="formbold-form-label"> Details </label>
                                    <textarea rows="4" cols="10" name="detail" id = "detail" className="formbold-form-input" value={`${item.detail}`} disabled/>
                                </div>
                            </div>
                            <div className="formbold-input">
                                <div>
                                    <label htmlFor="detail" className="formbold-form-label"> Description </label>
                                    <textarea rows="4" cols="10" name="desc" id = "desc" className="formbold-form-input" value={`${item.desc}`} disabled/>
                                </div>
                            </div>
                            </form>
                        </div>
                    ))
                    : null
                    }
                </div>
            </div>
        }
        />
    )
};

export default DetailProduct;