import React from 'react';

const Pagination = ({ 
    onclick,
    currentpage, 
    prevP, 
    prevPage, 
    totalPages, 
    nextP, 
    nextPage, 
}) => {
    const switchPageReview = ({e,page}) =>{
        onclick({e,page})
    }
    return (
    <React.Fragment>
        {currentpage !== 1 && (
        <React.Fragment>
            {prevP && 
                <li onClick={(e) => switchPageReview({e,page:prevP})}>
                    <a className="admin-content-makeup-items">
                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="10" height="10">
                            <path d="M12,24a1,1,0,0,1-.71-.29L3.12,15.54a5,5,0,0,1,0-7.08L11.29.29a1,1,0,1,1,1.42,1.42L4.54,9.88a3,3,0,0,0,0,4.24l8.17,8.17a1,1,0,0,1,0,1.42A1,1,0,0,1,12,24Z"/>
                            <path d="M22,24a1,1,0,0,1-.71-.29l-9.58-9.59a3,3,0,0,1,0-4.24L21.29.29a1,1,0,1,1,1.42,1.42l-9.59,9.58a1,1,0,0,0,0,1.42l9.59,9.58a1,1,0,0,1,0,1.42A1,1,0,0,1,22,24Z"/>
                        </svg>
                    </a>
                </li>
            }
            {prevPage && 
                <li onClick={(e) => switchPageReview({e,page:prevPage})}>
                    <a className="admin-content-makeup-items">
                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="10" height="10">
                            <path d="M17.17,24a1,1,0,0,1-.71-.29L8.29,15.54a5,5,0,0,1,0-7.08L16.46.29a1,1,0,1,1,1.42,1.42L9.71,9.88a3,3,0,0,0,0,4.24l8.17,8.17a1,1,0,0,1,0,1.42A1,1,0,0,1,17.17,24Z"/>
                        </svg>
                    </a>
                </li>
            }
        </React.Fragment>
        )}
        {totalPages && totalPages.map((page, index) => (
        <React.Fragment key={index}>
            {page === currentpage ? (
            <li>
              <a className="admin-content-makeup-items admin-content-makeup-items-active">{page}</a>
            </li>
            ) : (
            <>
                {typeof page === 'number' ? (
                <li onClick={(e) => switchPageReview({e,page:page})}>
                    <a className="admin-content-makeup-items admin-content-makeup-items">{page}</a>
                </li>
                ) : (
                <div style={{ display: 'inline-block', margin: '0 10px' }}>{page}</div>
                )}
            </>
            )}
        </React.Fragment>
        ))}
        {currentpage !== nextP && (
        <React.Fragment>
            {nextPage &&
                <li onClick={(e) => switchPageReview({e,page:nextPage})}>
                    <a className="admin-content-makeup-items">
                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="10" height="10">
                            <path d="M7,24a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l8.17-8.17a3,3,0,0,0,0-4.24L6.29,1.71A1,1,0,0,1,7.71.29l8.17,8.17a5,5,0,0,1,0,7.08L7.71,23.71A1,1,0,0,1,7,24Z"/>
                        </svg>
                    </a>
                </li>
            }
            {nextP && 
                <li onClick={(e) => switchPageReview({e,page:nextP})} className="arrow-pagination">
                    <a className="admin-content-makeup-items">
                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="10" height="10">
                            <path d="M11.83,24a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l8.17-8.17a3,3,0,0,0,0-4.24L11.12,1.71A1,1,0,1,1,12.54.29l8.17,8.17a5,5,0,0,1,0,7.08l-8.17,8.17A1,1,0,0,1,11.83,24Z"/>
                            <path d="M1.83,24a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l9.59-9.58a1,1,0,0,0,0-1.42L1.12,1.71A1,1,0,0,1,2.54.29l9.58,9.59a3,3,0,0,1,0,4.24L2.54,23.71A1,1,0,0,1,1.83,24Z"/>
                        </svg>
                    </a>
                </li>
            }
        </React.Fragment>
        )}
    </React.Fragment>
    );
};

export default Pagination;
