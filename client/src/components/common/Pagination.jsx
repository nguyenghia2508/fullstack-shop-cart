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
            {prevP && <li onClick={(e) => switchPageReview({e,page:prevP})} className="arrow-pagination"><i className="fa fa-angle-double-left"></i></li>}
            {prevPage && <li onClick={(e) => switchPageReview({e,page:prevPage})} className="arrow-pagination"><i className="fa fa-angle-left"></i></li>}
        </React.Fragment>
        )}
        {totalPages && totalPages.map((page, index) => (
        <React.Fragment key={index}>
            {page === currentpage ? (
            <li className="active">{page}</li>
            ) : (
            <>
                {typeof page === 'number' ? (
                <li onClick={(e) => switchPageReview({e,page:page})}>{page}</li>
                ) : (
                <div style={{ display: 'inline-block', margin: '0 10px' }}>{page}</div>
                )}
            </>
            )}
        </React.Fragment>
        ))}
        {currentpage !== nextP && (
        <React.Fragment>
            {nextPage && <li onClick={(e) => switchPageReview({e,page:nextPage})} className="arrow-pagination"><i className="fa fa-angle-right"></i></li>}
            {nextP && <li onClick={(e) => switchPageReview({e,page:nextP})} className="arrow-pagination"><i className="fa fa-angle-double-right"></i></li>}
        </React.Fragment>
        )}
    </React.Fragment>
    );
};

export default Pagination;
