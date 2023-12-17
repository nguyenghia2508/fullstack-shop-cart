import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NavigationAdmin = ({ fullname }) => {
  const [navAdminVisible, setNavAdminVisible] = useState(false);

  useEffect(() => {
    const navAdmin = document.querySelector('.nav-admin');
    const headerResponsiveIconMenu = document.querySelector('.header-responsive-icon-menu');
    const navOverlay = document.querySelector('.nav-overlay');
    const jsItemsExtra = document.querySelector('.js-items-extra');
    const jsMenuItemsLink = document.querySelectorAll('.js-menu-items-link');
    const jsMenuItemsArrowicon1 = document.querySelector('.js-menu-items-arrowicon1');
    const jsMenuItemsArrowicon2 = document.querySelector('.js-menu-items-arrowicon2');

    const showNavAdmin = () => {
      setNavAdminVisible(true);
    };

    const hideNavAdmin = () => {
      setNavAdminVisible(false);
      hideMenuExtra(); // Hide the extra menu when hiding the navigation
    };

    const handleDocumentClick = (event) => {
      // Check if the click is outside of nav-admin and header-responsive-icon-menu
      if (navAdmin && !navAdmin.contains(event.target) &&
          headerResponsiveIconMenu && !headerResponsiveIconMenu.contains(event.target)) {
        hideNavAdmin();
        jsItemsExtra.classList.remove('active');
        jsMenuItemsArrowicon1.classList.remove('active');
        jsMenuItemsArrowicon2.classList.remove('active');
      }
    };

    const showMenuExtra = () => {
      jsItemsExtra.classList.toggle('active');
      jsMenuItemsArrowicon1.classList.toggle('active');
      jsMenuItemsArrowicon2.classList.toggle('active');
    };

    const hideMenuExtra = () => {
      jsItemsExtra.classList.add('active');
    };

    if (headerResponsiveIconMenu) {
      headerResponsiveIconMenu.addEventListener('click', showNavAdmin);
      navOverlay.addEventListener('click', hideNavAdmin);
      document.addEventListener('click', handleDocumentClick);
    }

    if (jsItemsExtra) {
      for (let i = 0; i < jsMenuItemsLink.length; i++) {
        jsMenuItemsLink[i].addEventListener('click', showMenuExtra);
      }
    }

    return () => {
      // Cleanup: Remove event listeners when the component unmounts
      if (headerResponsiveIconMenu) {
        headerResponsiveIconMenu.removeEventListener('click', showNavAdmin);
        navOverlay.removeEventListener('click', hideNavAdmin);
        document.removeEventListener('click', handleDocumentClick);
      }

      if (jsItemsExtra) {
        for (let i = 0; i < jsMenuItemsLink.length; i++) {
          jsMenuItemsLink[i].removeEventListener('click', showMenuExtra);
        }
      }
    };
  }, [navAdminVisible]);

  return (
    <>
      <nav className={`nav-admin ${navAdminVisible ? 'nav-admin-show' : ''}`}>
            <div className="nav-admin-content">
                <div className="nav-admin-info">
                    <img src="https://preview.keenthemes.com/metronic8/demo15/assets/media/avatars/300-1.jpg" alt="Image" className="nav-admin-info-img"/>
                    <span className="nav-admin-logo-name">
                        <h3>{fullname}</h3>
                    </span>
                    <h5 className="nav-admin-logo-role">Admin</h5>
                </div>
                <div className="nav-admin-menu">
                    <div className="nav-admin-menu-list">
                        <div className="nav-admin-menu-items">
                            <span className="nav-admin-menu-items-link js-menu-items-link">
                                <span className="nav-admin-menu-items-arrowicon">
                                    <svg className="js-menu-items-arrowicon1" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="14" height="14">
                                        <path d="M23.12,9.91,19.25,6a1,1,0,0,0-1.42,0h0a1,1,0,0,0,0,1.41L21.39,11H1a1,1,0,0,0-1,1H0a1,1,0,0,0,1,1H21.45l-3.62,3.61a1,1,0,0,0,0,1.42h0a1,1,0,0,0,1.42,0l3.87-3.88A3,3,0,0,0,23.12,9.91Z"/>
                                    </svg>
                                </span>
                                <span className="nav-admin-menu-items-title-icon">
                                    <span className="nav-admin-menu-items-name">Manage</span>
                                    <span className="nav-admin-menu-items-arrowicon">
                                        <svg className="js-menu-items-arrowicon2" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="8" height="8">
                                        <path d="M7,24a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l8.17-8.17a3,3,0,0,0,0-4.24L6.29,1.71A1,1,0,0,1,7.71.29l8.17,8.17a5,5,0,0,1,0,7.08L7.71,23.71A1,1,0,0,1,7,24Z"/>
                                        </svg>
                                    </span>
                                </span>
                            </span>
                            <div className="nav-admin-menu-items-extra js-items-extra">
                                <Link to="/admin/list-user" className="nav-admin-menu-items-link-extra">
                                    <span className="nav-admin-menu-items-dot-exra"></span>
                                    <span className="nav-admin-menu-items-name-extra">User</span>
                                </Link>
                                <Link to="/admin/list-product" className="nav-admin-menu-items-link-extra">
                                    <span className="nav-admin-menu-items-dot-exra"></span>
                                    <span className="nav-admin-menu-items-name-extra">Product</span>
                                </Link>
                                <Link to="/admin/list-type" className="nav-admin-menu-items-link-extra">
                                    <span className="nav-admin-menu-items-dot-exra"></span>
                                    <span className="nav-admin-menu-items-name-extra">Categories</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="nav-admin-logout">
                    <a href="#" className="nav-admin-logout-icon-title">
                        <span className="nav-admin-logout-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="16" height="16"><title>11-arrow</title>
                                <path d="M22.763,10.232l-4.95-4.95L16.4,6.7,20.7,11H6.617v2H20.7l-4.3,4.3,1.414,1.414,4.95-4.95a2.5,2.5,0,0,0,0-3.536Z"/>
                                <path d="M10.476,21a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V3A1,1,0,0,1,3,2H9.476a1,1,0,0,1,1,1V8.333h2V3a3,3,0,0,0-3-3H3A3,3,0,0,0,0,3V21a3,3,0,0,0,3,3H9.476a3,3,0,0,0,3-3V15.667h-2Z"/>
                            </svg>
                        </span>
                        <span className="nav-admin-logout-title">Log Out</span>
                    </a>
                    <span className="nav-admin-logout-icon"></span>
                </div>
            </div>
        </nav>
      </>
    );
  };
  

export default NavigationAdmin;