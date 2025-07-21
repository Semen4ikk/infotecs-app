import React from 'react';
import '../styles/user.modal.css';

export default function UserModal({ user, onClose }) {
    if (!user) return null;


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <img
                    src={user.image}
                    alt="Avatar"
                    className="modal-avatar"
                />
                <h3 className="modal-name">{`${user.firstName} ${user.lastName}`}</h3>

                <div className="modal-info-block">
                    <div className="modal-info-item">
                        <p><strong>Возраст:</strong> {user.age}</p>
                    </div>
                    <div className="modal-divider"></div>

                    <div className="modal-info-item">
                        <p><strong>Пол:</strong> {user.gender}</p>
                    </div>
                    <div className="modal-divider"></div>

                    <div className="modal-info-item">
                        <p><strong>Рост:</strong> {user.height} см</p>
                    </div>
                    <div className="modal-divider"></div>

                    <div className="modal-info-item">
                        <p><strong>Вес:</strong> {user.weight} кг</p>
                    </div>
                    <div className="modal-divider"></div>

                    <div className="modal-info-item">
                        <p><strong>Телефон:</strong> {user.phone}</p>
                    </div>
                    <div className="modal-divider"></div>

                    <div className="modal-info-item">
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                    <div className="modal-divider"></div>

                    <div className="modal-info-item">
                        <p><strong>Адрес:</strong> {`${user.address?.address}, ${user.address?.city}`}</p>
                    </div>
                </div>

                <button onClick={onClose} className="modal-close-btn">
                    Закрыть
                </button>
            </div>
        </div>
    );
}