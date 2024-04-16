import React, {useState, useEffect, useRef} from 'react';
import iconClose from '../images/icon_close.svg';
import Api from '../utils/api';

const CreateCardModal = ({isOpen, onClose, setCardData}) => {
  const api = new Api();

  const [formData, setFormData] = useState({
    nama_tempat: '',
    link_gambar: '',
  });

  const [errors, setErrors] = useState({
    nama_tempat: '',
    link_gambar: '',
  });

  const namaTempatInputRef = useRef(null);
  const linkGambarInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Clear previous errors when modal opens
      setErrors({
        nama_tempat: '',
        link_gambar: '',
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset validation error
    setErrors({
      ...errors,
      [name]: '',
    });

    // Validate input
    if (name === 'nama_tempat') {
      const isValid = namaTempatInputRef.current.checkValidity();
      setErrors((prevErrors) => ({
        ...prevErrors,
        nama_tempat: isValid
          ? ''
          : namaTempatInputRef.current.validationMessage,
      }));
    } else if (name === 'link_gambar') {
      const isValid = linkGambarInputRef.current.checkValidity();
      setErrors((prevErrors) => ({
        ...prevErrors,
        link_gambar: isValid
          ? ''
          : linkGambarInputRef.current.validationMessage,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid =
      namaTempatInputRef.current.checkValidity() &&
      linkGambarInputRef.current.checkValidity();

    if (isValid) {
      api.createNewCard(formData).then((res) => {
        setCardData((prevData) => [res, ...prevData]);
        onClose();
        setFormData({
          nama_tempat: '',
          link_gambar: '',
        });
      });
    } else {
      // Show all validation errors
      setErrors({
        nama_tempat: namaTempatInputRef.current.validationMessage,
        link_gambar: linkGambarInputRef.current.validationMessage,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        !document.getElementById('modal_content_card').contains(e.target)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`modal ${isOpen ? 'modal-show' : ''}`}
      style={{display: isOpen ? 'flex' : 'none'}}
    >
      <form className='modal__content form' id='modal_content_card'>
        <span className='modal__close' onClick={onClose}>
          <img src={iconClose} alt='close' />
        </span>
        <h3 className='modal__title'>Tambah tempat</h3>
        <div className='modal__wrapper-input'>
          <div className='modal__input'>
            <input
              type='text'
              placeholder='Nama tempat'
              name='nama_tempat'
              className='input'
              value={formData.nama_tempat}
              onChange={handleChange}
              ref={namaTempatInputRef}
              required
              minLength='2'
              maxLength='100'
            />
          </div>
          <p
            style={{opacity: errors.nama_tempat ? 1 : 0}}
            className='error-message'
          >
            {errors.nama_tempat}
          </p>
        </div>
        <div className='modal__wrapper-input'>
          <div className='modal__input'>
            <input
              type='text'
              placeholder='Link tempat'
              className='input'
              name='link_gambar'
              value={formData.link_gambar}
              onChange={handleChange}
              ref={linkGambarInputRef}
              required
              pattern='https?://.+'
            />
          </div>
          <p
            style={{opacity: errors.link_gambar ? 1 : 0}}
            className='error-message'
          >
            {errors.link_gambar}
          </p>
        </div>
        <button
          type='submit'
          className='modal__button button'
          onClick={handleSubmit}
        >
          Simpan
        </button>
      </form>
    </div>
  );
};

export default CreateCardModal;
