import React from "react";

const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  nextPage,
  prevPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <nav>
      <ul className="mb-3 mt-4 flex justify-center">
        <li>
          <button
            onClick={prevPage}
            className={`page-link mx-2 rounded border border-teal-500 px-4 py-2 shadow-md ${currentPage === 1 ? "cursor-not-allowed text-gray-500" : "transform text-teal-500 transition hover:translate-y-1 hover:bg-teal-500 hover:text-white hover:shadow-lg"}`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        <li className="mx-2">
          <span className="page-link rounded border border-teal-500 bg-teal-500 px-4 py-2 text-white shadow-md">
            {currentPage}
          </span>
        </li>
        <li>
          <button
            onClick={nextPage}
            className={`page-link mx-2 rounded border border-teal-500 px-4 py-2 shadow-md ${currentPage === totalPages ? "cursor-not-allowed text-gray-500" : "transform text-teal-500 transition hover:translate-y-1 hover:bg-teal-500 hover:text-white hover:shadow-lg"}`}
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
