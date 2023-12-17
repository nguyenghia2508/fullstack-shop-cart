import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({id}) => {
  return (
    <nav id="navigation">
			<div className="container">
				<div id="responsive-nav">
					<ul className="main-nav nav navbar-nav">
						<li className={id === 0 ? `active` : ''}><Link to="/">Home</Link></li>
						<li className={id === 2 ? `active` : ''}><Link to="/store">Store</Link></li>
					</ul>
				</div>
			</div>
		</nav>
  );
};

export default Navigation;
