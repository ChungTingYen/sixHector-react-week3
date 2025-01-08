/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

const Modal = forwardRef((props, ref) => {
  const { modalBodyText, modalSize, modalImgSize,xxxx } = props;
  const modalDivRef = useRef(null);
  const modalRef = useRef(null);
  const imageRef = useRef(null);
  // const initRef = useRef(false);
  // const [imageSrc, setImageSrc] = useState("");
  // const restoreStyle = () => {
  //   // 清除 modal 陰影
  //   document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
  //   // 強制應用恢復滾動條的樣式
  //   document.body.style.overflow = "auto";
  //   console.log('restoreStyle');
  // };
  useEffect(() => {
    modalRef.current = new bootstrap.Modal(modalDivRef.current);
  }, []);
  //原本的寫法
  // useEffect(() => {
  //   modalRef.current = new bootstrap.Modal(modalDivRef.current);
  //   if (initRef.current) {
  //     openModal();
  //     document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
  //   }
  //   console.log('initRef.current=',initRef.current);
  //   const modalElement = document.getElementById("myModal");
  //   modalElement.addEventListener("hidden.bs.modal", null);
  //   return () => {
  //     modalElement.removeEventListener("hidden.bs.modal", restoreStyle);
  //   };
  // }, [imageSrc]);
  const closeModal = () => {
    modalRef.current.hide();
    // restoreStyle();
  };
  const openModal = () => {
    modalRef.current.show();
  };

  useImperativeHandle(ref, () => {
    return {
      //open close2種寫法
      open() {
        openModal();
      },
      close: closeModal,
      // setModalImage: setImage,
      // setModalImage(src){
      //   setImageSrc(src);
      //   initRef.current = true;
      // },
      toggleFooter(visible) {
        if (visible) {
          modalDivRef.current.querySelector(".modal-footer").style.display =
            "block";
        } else {
          modalDivRef.current.querySelector(".modal-footer").style.display =
            "none";
        }
      },
      setModalImage(src) {
        if (imageRef.current) { 
          imageRef.current.src = src; 
          // 直接修改圖像的 src 屬性 
        }
      },
      setImgAlt(text){
        if (imageRef.current) { 
          imageRef.current.alt = text; 
          // 直接修改圖像的 alt 屬性 
        }
      },
      //把modalDivRef傳出去給父層控制
      modalDivRef,
    };
  });
  return (
    <>
      <div
        className="modal fade"
        id="myModal"
        ref={modalDivRef}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog"
          // style={{ width: "600px", height: "600px" }}
          style={modalSize}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {/* 商品放大圖 */}
                {modalBodyText}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div
              className="modal-body d-flex justify-content-center align-items-center"
              style={modalImgSize}
              id="modalBody"
            >
              <img
                // src={imageSrc}
                ref={imageRef}
                className="img-fluid"
                alt=''
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                id="picture"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                // data-bs-dismiss="modal"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
export default Modal;
