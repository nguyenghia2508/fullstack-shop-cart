import Loading from "../../common/Loading"
import { resetUser, setUser } from '../../../redux/features/userSlice'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from "../../../utils/authUtils";
import NavigationAdmin from '../../admin/NavigationAdmin'
import HeaderAdmin from '../../admin/HeaderAdmin'
import FooterAdmin from "../../admin/FooterAdmin";
import ContainerAdmin from '../../admin/ContainerAdmin'
import { useDispatch } from 'react-redux'
import './AdminStyle.css';


const AdminLayout = ({
  id,
  currPage,
  title,
  add
}) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
          const user = await authUtils.isAuthenticated()
          if (user && user.role === 0) {
            setLoading(false)
          }
          else
          {
            navigate('/')
          }
        }
        checkAuth()
    }, [navigate])

    return (
        loading ? (
          <Loading fullHeight />
        ): ( 
            <div id="admin">
                <HeaderAdmin/>
                <NavigationAdmin/>
                <ContainerAdmin 
                currPage={currPage}
                title={title}
                add={add}
                />
                <FooterAdmin/>
            </div>
        )
    )
};

export default AdminLayout;