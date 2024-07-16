import React from 'react';

const Pagination = ({ itemsPerPage, totalItems, currentPage, nextPage, prevPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <nav>
            <ul className="flex justify-center mt-4 mb-3">
                <li>
                    <button
                        onClick={prevPage}
                        className={`page-link mx-2 px-4 py-2 rounded shadow-md border border-teal-500 ${currentPage === 1 ? 'cursor-not-allowed text-gray-500' : 'text-teal-500 hover:text-white hover:bg-teal-500 transition transform hover:translate-y-1 hover:shadow-lg'}`}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                </li>
                <li className="mx-2">
                    <span className="page-link px-4 py-2 rounded shadow-md border border-teal-500 bg-teal-500 text-white">
                        {currentPage}
                    </span>
                </li>
                <li>
                    <button
                        onClick={nextPage}
                        className={`page-link mx-2 px-4 py-2 rounded shadow-md border border-teal-500 ${currentPage === totalPages ? 'cursor-not-allowed text-gray-500' : 'text-teal-500 hover:text-white hover:bg-teal-500 transition transform hover:translate-y-1 hover:shadow-lg'}`}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
