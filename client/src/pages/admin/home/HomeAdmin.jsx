import AdminLayout from "../../../components/layout/admin/AdminLayout";
import adminApi from "../../../api/admin/adminApi";
import { useEffect } from "react";
const HomeAdmin = () => {
    useEffect(() => {
        const getTestFile= async () => {
            try {
                const data = await adminApi.testFile()
                console.log(data)
            } catch (err) {
                console.log(err)
            }
        }
        getTestFile();
    }, []);

    return (
        <AdminLayout add={
            <div id="app">
                <div className="layout-login-register">
                    <div className="layout-trademark">
                        <div className="layout-trademark-logo">
                            <img src="/img/wallet_logo.png" alt="Image" className="layout-trademark-img-logo"/>
                            <h3 className="layout-trademark-title">Welcome to <br/> Electro Shop</h3>
                        </div>
                        <div className="layout-trademark-img" style={{ backgroundImage: 'url(/img/bg1.svg)' }}></div>
                    </div>
                </div>
            </div>
        }
        />
    )
};

export default HomeAdmin;