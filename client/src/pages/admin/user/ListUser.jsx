import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { useState,useEffect } from "react"
import AdminLayout from "../../../components/layout/admin/AdminLayout";
import adminApi from "../../../api/admin/adminApi";
import FormattedDateTime from '../../../functions/FormattedDateTime'
import PaginationAdmin from '../../../components/admin/PaginationAdmin'

const ListUser = () => {

    const [currentPage, setCurrentPage] = useState(1); // Giả sử giá trị ban đầu là 1
    const [infoUser, setInfoUser] = useState([]);
    const [nextPage, setNextPage] = useState(1); // Giả sử giá trị ban đầu là 1
    const [pageTotal, setPageTotal] = useState(1); // Giả sử giá trị ban đầu là 1
    const [prevPage, setPrevPage] = useState(1); // Giả sử giá trị ban đầu là 1
    const [totalPages, setTotalPages] = useState([1]);
    const [page, setPage] = useState(1)
    const [title, setTitle] = useState(null)
    const [currPage, setCurrPage] = useState(null)

    useEffect(() => {
        const getListUser= async () => {
            try {
                const data = await adminApi.getListUser({page:page})
                setTitle(data.title)
                setCurrPage(data.currPage)
                setInfoUser(data.result)
                setPageTotal(data.pageTotal)
                setPrevPage(data.prevPage)
                setTotalPages(data.totalPages)
                setNextPage(data.nextPage)
                setCurrentPage(data.currentpage)
            } catch (err) {
                console.log(err)
            }
        }
        getListUser();
    }, []);


    const handleSwitchPage = async ({e,page}) =>{
        try {
            const data = await adminApi.getListUser({page:page})
            setInfoUser(data.result)
            setPageTotal(data.pageTotal)
            setPrevPage(data.prevPage)
            setTotalPages(data.totalPages)
            setNextPage(data.nextPage)
            setCurrentPage(data.currentpage)
            setPage(page)
        }
        catch (err) {
        console.log(err)
        }
    }

    return (
        <AdminLayout 
        title={title}
        currPage={currPage}
        add={
            <div className="admin-content-layout">
                <div className="admin-content-header">
                    <span className="admin-content-header-search">
                        <input type="text" className="admin-content-header-search-input" placeholder="Search user"/>
                        <svg className="admin-content-header-icon-search" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="14" height="14">
                            <path d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z"/>
                        </svg>
                    </span>
                </div>
                <div className="admin-content-table">
                    <div className="admin-content-table-content">
                        <div className="table-responsive">
                            <table className="table-admin">
                                <thead className="table-thead-admin">
                                    <tr>
                                        <th className="table-thead-admin-id">ID</th>
                                        <th className="table-thead-admin-user">User</th>
                                        <th className="table-thead-admin-phone">Full Name</th>
                                    </tr>
                                </thead>
                                {infoUser && infoUser.length !== 0 
                                ? 
                                infoUser.map((item,index) => (
                                    <tbody className="table-tbody" key={index}>
                                        <tr>
                                            <td className="table-tbody-td-id">{(currentPage - 1) * 10 + index + 1}</td>                                            
                                            <td className="table-tbody-td-info">
                                                <img src="https://preview.keenthemes.com/metronic8/demo15/assets/media/avatars/300-1.jpg" className="table-tbody-td-img" alt="Image"/>
                                                <div className="table-tbody-td-name-email">
                                                    <span className="table-tbody-td-name">{item.username}</span>
                                                    <span className="table-tbody-td-email">{item.email}</span>
                                                </div>
                                            </td>
                                            <td className="table-tbody-td-number">
                                                <span>{item.fullname}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                    ))
                                : null
                                }
                            </table>
                        </div>
                    </div>
                    <div className="admin-content-page">
                        <div className="admin-content-page-row">
                            <div className="admin-content-page-column-4"></div>
                            <div className="admin-content-page-column-8">
                                <div className="admin-content-makeup">
                                    <ul className="admin-content-makeup-list">
                                        <PaginationAdmin
                                            onclick = {handleSwitchPage}
                                            currentpage = {currentPage}
                                            prevP = {1}
                                            prevPage = {prevPage} 
                                            totalPages = {totalPages}
                                            nextP = {pageTotal ? pageTotal : 1}
                                            nextPage = {nextPage}
                                        />
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        }
        />
    )
};

export default ListUser;