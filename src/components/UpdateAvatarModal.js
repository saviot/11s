import React, {useState, useEffect, useRef} from 'react';
import iconClose from '../images/icon_close.svg';
import Api from '../utils/api';

const UpdateAvatarModal = ({isOpen, onClose, setUserData}) => {
  const [formData, setFormData] = useState({
    avatar: '',
  });

  const [errors, setErrors] = useState({
    avatar: '',
  });

  const api = new Api();

  const linkGambarInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Clear previous errors when modal opens
      setErrors({
        avatar: '',
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
    if (name === 'avatar') {
      const isValid = linkGambarInputRef.current.checkValidity();
      setErrors((prevErrors) => ({
        ...prevErrors,
        avatar: isValid ? '' : linkGambarInputRef.current.validationMessage,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = linkGambarInputRef.current.checkValidity();

    if (isValid) {
      api
        .updateAvatar({
          avatar: formData.avatar,
        })
        .then((res) => {
          setUserData((prevUserData) => ({
            ...prevUserData,
            avatar: res.avatar,
          }));
          onClose();
        });
    } else {
      // Show all validation errors
      setErrors({
        avatar: linkGambarInputRef.current.validationMessage,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        !document.getElementById('modal_change_avatar').contains(e.target)
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
      <form className='modal__content form' id='modal_change_avatar'>
        <span className='modal__close' onClick={onClose}>
          <img src={iconClose} alt='close' />
        </span>
        <h3 className='modal__title'>Update Avatar</h3>
        <div className='modal__wrapper-input'>
          <div className='modal__input'>
            <input
              type='text'
              placeholder='Link tempat'
              className='input'
              name='avatar'
              value={formData.avatar}
              onChange={handleChange}
              ref={linkGambarInputRef}
              required
              pattern='https?://.+'
            />
          </div>
          <p style={{opacity: errors.avatar ? 1 : 0}} className='error-message'>
            {errors.avatar}
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

export default UpdateAvatarModal;
