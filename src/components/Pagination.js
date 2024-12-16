const Pagination = ({
    currentPage,
    totalPage,
    onPageChange
}) => {

    // No. of max page buttons
    const maxVisiblePage = 5;
    // for generating page no.
    const pageNumbers = [];

    // Calculate start and end pages for rendering
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePage / 2));
    let endPage = Math.min(totalPage, startPage + maxVisiblePage - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePage) {
        startPage = Math.max(1, endPage - maxVisiblePage + 1);
    }

    // for generating the page numbers
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
            <button
                key={i}
                onClick={() => { onPageChange(i) }}
                className={`
                    py-1 px-2 mr-2 text-white 
                    ${currentPage === i
                        ? 'bg-indigo-200'
                        : 'bg-indigo-500 hover:bg-indigo-600'}
                `}
            >
                {i}
            </button>
        )
    }

    return (
        <div className="flex justify-center items-center space-x-2">
            {/* Previous Button */}
            {currentPage > 1 && (
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className="py-1 px-3 bg-indigo-500 text-white"
                >
                    Prev
                </button>
            )}

            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="py-1 px-3 bg-indigo-500 text-white"
                    >
                        1
                    </button>
                    {startPage > 2 && <span>...</span>}
                </>
            )}

            {pageNumbers}

            {endPage < totalPage && (
                <>
                    {endPage < totalPage - 1 && <span>...</span>}
                    <button
                        onClick={() => onPageChange(totalPage)}
                        className="py-1 px-3 bg-indigo-500 text-white"
                    >
                        {totalPage}
                    </button>
                </>
            )}

            {/* Next Button */}
            {currentPage < totalPage && (
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    className="py-1 px-3 bg-indigo-500 text-white"
                >
                    Next
                </button>
            )}
        </div>
    );
};


export default Pagination;