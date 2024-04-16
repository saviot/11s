import React, {useState, useEffect, useRef} from 'react';
import iconClose from '../images/icon_close.svg';
import Api from '../utils/api';

const EditProfileModal = ({isOpen, onClose, nama, title, setUserData}) => {
  const [formData, setFormData] = useState({
    nama: nama,
    title: title,
  });

  const [errors, setErrors] = useState({
    nama: '',
    title: '',
  });

  const api = new Api();

  const namaInputRef = useRef(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Clear previous errors when modal opens
      setErrors({
        nama: '',
        title: '',
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
    if (name === 'nama') {
      const isValid = namaInputRef.current.checkValidity();
      setErrors((prevErrors) => ({
        ...prevErrors,
        nama: isValid ? '' : namaInputRef.current.validationMessage,
      }));
    } else if (name === 'title') {
      const isValid = titleInputRef.current.checkValidity();
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: isValid ? '' : titleInputRef.current.validationMessage,
      }));
    }
  };

  const handleEditProfileClick = () => {
    const isValid =
      namaInputRef.current.checkValidity() &&
      titleInputRef.current.checkValidity();

    if (isValid) {
      api
        .setUserInfo({
          nama: formData.nama,
          title: formData.title,
        })
        .then((res) => {
          setUserData({
            nama: res.name,
            title: res.about,
            avatar: res.avatar,
          });
          onClose();
        });
    } else {
      // Show all validation errors
      setErrors({
        nama: namaInputRef.current.validationMessage,
        title: titleInputRef.current.validationMessage,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        !document.getElementById('modal__content_profile').contains(e.target)
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
      <form className='modal__content form' id='modal__content_profile'>
        <span className='modal__close' onClick={onClose}>
          <img src={iconClose} alt='close' />
        </span>
        <h3 className='modal__title'>Edit Profile</h3>
        <div className='modal__wrapper-input'>
          <div className='modal__input'>
            <input
              type='text'
              placeholder='Nama'
              className='input'
              name='nama'
              value={formData.nama}
              onChange={handleChange}
              ref={namaInputRef}
              minLength='2'
              maxLength='40'
              required
            />
          </div>
          <p style={{opacity: errors.nama ? 1 : 0}} className='error-message'>
            {errors.nama}
          </p>
        </div>
        <div className='modal__wrapper-input'>
          <div className='modal__input'>
            <input
              type='text'
              placeholder='Title'
              className='input'
              name='title'
              value={formData.title}
              onChange={handleChange}
              ref={titleInputRef}
              minLength='2'
              maxLength='200'
              required
            />
          </div>
          <p style={{opacity: errors.title ? 1 : 0}} className='error-message'>
            {errors.title}
          </p>
        </div>
        <button
          type='button'
          className='modal__button button'
          onClick={handleEditProfileClick}
        >
          Simpan
        </button>
      </form>
    </div>
  );
};

export default EditProfileModal;
