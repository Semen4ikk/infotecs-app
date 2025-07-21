import React, { useEffect, useState, useRef } from 'react';
import UserModal from "./user.modal.jsx";
import '../styles/user.table.css';

export default function UsersTable() {
    const [users, setUsers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filterQuery, setFilterQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const pageSize = 10;

    const [columnWidths, setColumnWidths] = useState({
        lastName: 100,
        firstName: 100,
        maidenName: 100,
        age: 100,
        gender: 100,
        phone: 100,
        email: 150,
        country: 100,
        city: 100
    });

    const tableRef = useRef(null);
    const resizingInfo = useRef(null);

    useEffect(() => {
        fetch('https://dummyjson.com/users')
            .then(res => res.json())
            .then(data => setUsers(data.users));
    }, []);

    const filteredAndSortedUsers = React.useMemo(() => {
        let filtered = [...users];
        if (filterQuery.trim() !== '') {
            const query = filterQuery.toLowerCase();
            filtered = filtered.filter(user => {
                const fullName = `${user.firstName} ${user.lastName} ${user.maidenName}`.toLowerCase();
                const gender = user.gender.toLowerCase();
                const phone = user.phone.toLowerCase();
                const email = user.email.toLowerCase();
                const city = user.address?.city?.toLowerCase() || '';
                const country = user.address?.country?.toLowerCase() || '';

                return (
                    fullName.includes(query) ||
                    gender.includes(query) ||
                    phone.includes(query) ||
                    email.includes(query) ||
                    city.includes(query) ||
                    country.includes(query)
                );
            });
        }
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                if (typeof aValue === 'string') aValue = aValue.toLowerCase();
                if (typeof bValue === 'string') bValue = bValue.toLowerCase();
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [users, filterQuery, sortConfig]);

    const paginatedUsers = React.useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredAndSortedUsers.slice(startIndex, startIndex + pageSize);
    }, [filteredAndSortedUsers, currentPage]);

    const totalPages = Math.ceil(filteredAndSortedUsers.length / pageSize);

    const requestSort = key => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handlePageChange = newPage => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filterQuery, sortConfig]);

    const handleMouseDown = (e, key) => {
        e.preventDefault();
        const keysOrder = ['lastName', 'firstName', 'maidenName', 'age', 'gender', 'phone', 'email', 'country', 'city'];
        const index = keysOrder.indexOf(key);
        if (index === -1 || index === keysOrder.length - 1) return;

        const rightKey = keysOrder[index + 1];

        resizingInfo.current = {
            startX: e.clientX,
            leftKey: key,
            rightKey,
            leftStartWidth: columnWidths[key],
            rightStartWidth: columnWidths[rightKey],
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = e => {
        if (!resizingInfo.current) return;
        const { startX, leftKey, rightKey, leftStartWidth, rightStartWidth } = resizingInfo.current;
        const deltaX = e.clientX - startX;

        let newLeftWidth = leftStartWidth + deltaX;
        let newRightWidth = rightStartWidth - deltaX;

        if (newLeftWidth < 50) {
            newLeftWidth = 50;
            newRightWidth = leftStartWidth + rightStartWidth - newLeftWidth;
        } else if (newRightWidth < 50) {
            newRightWidth = 50;
            newLeftWidth = leftStartWidth + rightStartWidth - newRightWidth;
        }

        setColumnWidths(prev => ({
            ...prev,
            [leftKey]: newLeftWidth,
            [rightKey]: newRightWidth,
        }));
    };

    const handleMouseUp = () => {
        resizingInfo.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const renderHeaderCell = (label, key) => (
        <th
            className="resizable-header"
            style={{ width: columnWidths[key] }}
            onClick={() => requestSort(key)}
            key={key}
        >
            {label} {sortConfig.key === key ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            {key !== 'city' && (
                <div
                    className="resizer"
                    onMouseDown={e => handleMouseDown(e, key)}
                />
            )}
        </th>
    );

    return (
        <div className="users-table-container">
            <h2>Список пользователей</h2>

            <input
                type="text"
                id="user-filter"
                name="userFilter"
                placeholder="Фильтр по ФИ, полу, телефону, email, городу или стране"
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                className="filter-input"
            />

            <div className="table-wrapper">
                <table ref={tableRef}>
                    <thead>
                    <tr>
                        {renderHeaderCell('Фамилия', 'lastName')}
                        {renderHeaderCell('Имя', 'firstName')}
                        {renderHeaderCell('Д. Фамилия', 'maidenName')}
                        {renderHeaderCell('Возраст', 'age')}
                        {renderHeaderCell('Пол', 'gender')}
                        {renderHeaderCell('Телефон', 'phone')}
                        {renderHeaderCell('Email', 'email')}
                        {renderHeaderCell('Страна', 'country')}
                        {renderHeaderCell('Город', 'city')}
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedUsers.map(user => (
                        <tr
                            key={user.id}
                            onClick={() => {
                                setSelectedUser(user);
                                setShowModal(true);
                            }}
                            className="user-row"
                        >
                            <td>{user.lastName}</td>
                            <td>{user.firstName}</td>
                            <td>{user.maidenName}</td>
                            <td>{user.age}</td>
                            <td>{user.gender}</td>
                            <td>{user.phone}</td>
                            <td>{user.email}</td>
                            <td>{user.address?.country}</td>
                            <td>{user.address?.city}</td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {filteredAndSortedUsers.length === 0 && <p>Ничего не найдено</p>}

            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Предыдущая
                </button>
                <span>Страница {currentPage} из {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Следующая
                </button>
            </div>

            {showModal && (
                <UserModal
                    user={selectedUser}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedUser(null);
                    }}
                />
            )}
        </div>
    );
}
