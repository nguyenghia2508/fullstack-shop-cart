import { Link, useNavigate, useParams } from "react-router-dom"
import { useState,useEffect } from "react"
import { Controller, useForm } from "react-hook-form";
import AdminLayout from "../../../../components/layout/admin/AdminLayout";
import adminApi from "../../../../api/admin/adminApi";
import { yupResolver } from "@hookform/resolvers/yup";
import {schema} from './data';
import Loading from "../../../../components/common/Loading";
import { toast } from "react-toastify";
import '../detail/detail-style.scss'
import '../add/add-style.scss'

const EditProduct = () => {
    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
        setValue,
        clearErrors,
        watch,
        register,
        submit
    } = useForm({
        mode: 'all',
        resolver: yupResolver(schema()),
    });

    const navigate = useNavigate()
    const product = useParams()
    
    const [title, setTitle] = useState(null)
    const [currPage, setCurrPage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [infoProduct, setinfoProduct] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const getDetailProduct= async () => {
            try {
                const data = await adminApi.getEditProduct(product.id)
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                const result = fileReader.result;
                setImagePreview(result);
            };
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('number', data.number);
            formData.append('price', data.price);
            formData.append('dom', data.dom);
            formData.append('type', data.type);
            formData.append('desc', data.desc);
            formData.append('detail', data.detail);

            if (data.myImageEdit && data.myImageEdit.length > 0) {
                for (let i = 0; i < data.myImageEdit.length; i++) {
                    formData.append('myImageEdit', data.myImageEdit[i]);
                }
            }
            setLoading(true)
            const res = await adminApi.editProduct({id:product.id,data:formData})
            if (res.state === 'success') {
                setLoading(false)
                navigate('/admin/list-product')
                toast.success(res.message, {
                    position: 'top-left',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#fff' },
                });
            }
        } catch (err) {
            setLoading(false)
            const errors = err.data.msg
            toast.error(errors, {
                position: 'top-left',
                autoClose: 3000,
                style: { color: '$color-default', backgroundColor: '#fff' },
            });
        }
    }

    return (
        <AdminLayout 
        title={title}
        currPage={currPage}
        add={
            <div className="addPage">
                 <div className="formbold-main-wrapper">
                    {loading ? <Loading/> :
                        infoProduct && infoProduct.length !== 0 
                        ? 
                        infoProduct.map((item,index) => (
                            <div className="formbold-form-wrapper" key={index} >
                                <div className="file-image myImage-edit">
                                    {imagePreview ? (
                                        <img
                                            id="uploadImage-view"
                                            src={imagePreview}
                                            alt="Preview"
                                        />
                                    ) : (
                                        <img
                                            id="uploadImage-view"
                                            src={`${item.image.path}`}
                                            alt=""
                                        />
                                    )}
                                </div>
                                <form encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="formbold-input-wrapp formbold-mb-3">
                                        <label htmlFor="name" className="formbold-form-label"> Name </label>
                                        <div>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={`${item.name}`}
                                            id="name"
                                            placeholder="Product name"
                                            className="formbold-form-input"
                                            {...register("name")}
                                        />
                                        </div>
                                    </div>
                                    <div className="error-notice">
                                    {errors.name && (
                                            <div id="error-file" className="layout-content-group error-form">
                                                {errors.name.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="formbold-mb-3">
                                        <label htmlFor="number" className="formbold-form-label"> Number </label>
                                        <input
                                        type="number"
                                        name="number"
                                        id="number"
                                        defaultValue={`${item.number}`}
                                        placeholder="0"
                                        className="formbold-form-input number"
                                        {...register("number")}
                                        />
                                    </div>
                                    <div className="error-notice">
                                    {errors.number && (
                                            <div id="error-file" className="layout-content-group error-form">
                                                {errors.number.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="formbold-mb-3">
                                        <label htmlFor="price" className="formbold-form-label"> Price </label>
                                        <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        defaultValue={`${item.price}`}
                                        placeholder="0"
                                        className="formbold-form-input"
                                        {...register("price")}
                                        />
                                    </div>
                                    <div className="error-notice">
                                    {errors.price && (
                                            <div id="error-file" className="layout-content-group error-form">
                                                {errors.price.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="formbold-mb-3">
                                        <label htmlFor="dom" className="formbold-form-label"> Date of manufacture </label>
                                        <input type="datetime-local" name="dom" id="dom" className="formbold-form-input" 
                                        defaultValue={`${item.date}`}
                                        {...register("dom")}
                                        />
                                    </div>
                                    <div className="error-notice">
                                    {errors.dom && (
                                            <div id="error-file" className="layout-content-group error-form">
                                                {errors.dom.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="formbold-mb-3">
                                        <label className="formbold-form-label" htmlFor="type">Categories</label>
                                        <select
                                            className="formbold-form-input type"
                                            name="type"
                                            id="type"
                                            defaultValue={item.type}
                                            {...register("type")}
                                        >
                                            {item.type === "Laptop" ? (
                                                <>
                                                    <option value="Laptop">Laptop</option>
                                                    <option value="Smartphone">Smartphone</option>
                                                    <option value="Camera">Camera</option>
                                                </>
                                            ) : item.type === "Smartphone" ? (
                                                <>
                                                    <option value="Laptop">Laptop</option>
                                                    <option value="Smartphone">Smartphone</option>
                                                    <option value="Camera">Camera</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="Laptop">Laptop</option>
                                                    <option value="Smartphone">Smartphone</option>
                                                    <option value="Camera">Camera</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                    <div className="error-notice">
                                    {errors.type && (
                                            <div id="error-file" className="layout-content-group error-form">
                                                {errors.type.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="formbold-input">
                                        <div>
                                            <label htmlFor="detail" className="formbold-form-label"> Details </label>
                                            <textarea rows="4" cols="10" name="detail" id = "detail" 
                                            className="formbold-form-input" 
                                            defaultValue={`${item.detail}`}
                                            {...register("detail")}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="error-notice">
                                    {errors.detail && (
                                            <div id="error-file" className="layout-content-group error-form">
                                                {errors.detail.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="formbold-input">
                                        <div>
                                            <label htmlFor="desc" className="formbold-form-label"> Description </label>
                                            <textarea rows="4" cols="10" name="desc" id = "desc" 
                                            className="formbold-form-input" 
                                            defaultValue={`${item.desc}`}
                                            {...register("desc")}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="error-notice">
                                    {errors.desc && (
                                            <div id="error-file" className="layout-content-group error-form">
                                                {errors.desc.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="formbold-mb-3">
                                        <label htmlFor="uploadImage-edit" id="uploadImage-edit-label"className="formbold-form-label">
                                        Upload image
                                        </label>
                                        <input type="file" name="myImageEdit" id="uploadImage-edit" 
                                        className="formbold-form-input formbold-form-file"
                                        {...register("myImageEdit")}
                                        onChange={handleImageChange}
                                        />
                                    </div>
                                    <div className="error-notice">
                                    {errors.myImageEdit && (
                                        <div id="error-file" className="layout-content-group error-form">
                                            {errors.myImageEdit.message}
                                        </div>
                                    )}
                                    </div>
                                    <div className="formbold-mb-3">
                                        <button id="submit-button" type="submit" className="formbold-btn">Submit</button>
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

export default EditProduct;