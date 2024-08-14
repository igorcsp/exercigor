import ReactPaginate from "react-paginate";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IconContext } from "react-icons";

const Pagination = ({ pageCount, onPageChange, forcePage }) => {
  return (
    <ReactPaginate
      containerClassName={"pagination"}
      pageClassName={"page-item"}
      activeClassName={"active"}
      onPageChange={onPageChange}
      pageCount={pageCount}
      forcePage={forcePage}
      breakLabel="..."
      previousLabel={
        <IconContext.Provider value={{ color: "#3CFFDC", size: "36px" }}>
          <IoIosArrowBack />
        </IconContext.Provider>
      }
      nextLabel={
        <IconContext.Provider value={{ color: "#3CFFDC", size: "36px" }}>
          <IoIosArrowForward />
        </IconContext.Provider>
      }
    />
  );
};

export default Pagination;
