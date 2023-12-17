import { Link } from "react-router-dom";

const HeaderAdmin = () => {
    return (
      <>
      <header className="header-responsive">
            <div className="nav-overlay"></div>
            <div className="header-responsive-icon">
                <svg className="header-responsive-icon-menu" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="22" height="22">
                    <rect y="11" width="24" height="2" rx="1"/>
                    <rect y="4" width="24" height="2" rx="1"/>
                    <rect y="18" width="24" height="2" rx="1"/>
                </svg>
            </div>
        </header>
      </>
    );
  };
  

export default HeaderAdmin;