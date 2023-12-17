import Footer from "../../common/Footer";
import Header from "../../common/Header"
import Navigation from "../../common/Navigation"
import Loading from "../../common/Loading"
import { resetUser, setUser } from '../../../redux/features/userSlice'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from "../../../utils/authUtils";
import { useDispatch } from 'react-redux'
import './MainStyle.scss';


const MainLayout = ({id,add}) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
          const user = await authUtils.isAuthenticated()
          if (user) {
            // save user
            dispatch(setUser(user))
          }
          else
          {
            dispatch(resetUser())
          }
          setLoading(false)
        }
        checkAuth()
    }, [navigate])

    return (
        loading ? (
          <Loading fullHeight />
        ): (
            <div className="mainPage">
                <Header/>
                <Navigation id={id}/>
                {add}
                <Footer/>
            </div>
        )
    )
};

export default MainLayout;