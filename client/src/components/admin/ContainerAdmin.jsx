import { Link } from "react-router-dom";

const ContainerAdmin = ({
    currPage,
    title,
    add
}) => {
    return (
      <>
       <div className="admin-container">
            <div className="admin-container-header">
                <div className="admin-header">
                    <h1 className="admin-header-title">{currPage}</h1>
                    <h5 className="admin-header-path">
                        <span>{title}</span>
                        <span>{currPage}</span>
                    </h5>
                </div>
            </div>

            <div className="admin-container-content">
                <div className="admin-content">
                    {add}
                </div>
            </div>
        </div>
      </>
    );
  };
  

export default ContainerAdmin;