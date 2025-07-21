import React, { useRef } from 'react';

export default function ResizableTable({ columns, columnWidths, setColumnWidths, data, renderRow }) {
    const resizingColumn = useRef(null);

    const handleMouseDown = (e, key, index) => {
        const startX = e.clientX;
        const startWidth = columnWidths[key];
        const nextKey = columns[index + 1]?.key;
        const nextStartWidth = nextKey ? columnWidths[nextKey] : null;

        resizingColumn.current = { startX, startWidth, nextStartWidth, key, nextKey, index };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = e => {
        if (!resizingColumn.current) return;

        const { startX, startWidth, nextStartWidth, key, nextKey } = resizingColumn.current;
        const deltaX = e.clientX - startX;

        const newWidth = Math.max(50, startWidth + deltaX);
        const newNextWidth = nextStartWidth !== null ? Math.max(50, nextStartWidth - deltaX) : null;

        setColumnWidths(prev => {
            const updated = { ...prev, [key]: newWidth };
            if (nextKey && newNextWidth !== null) {
                updated[nextKey] = newNextWidth;
            }
            return updated;
        });
    };

    const handleMouseUp = () => {
        resizingColumn.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <tr>
                {columns.map(({ label, key }, i) => (
                    <th
                        key={key}
                        style={{ width: columnWidths[key], border: '1px solid #ccc', padding: '8px', position: 'relative', userSelect: 'none' }}
                    >
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
                        {i < columns.length - 1 && (
                            <div
                                onMouseDown={e => handleMouseDown(e, key, i)}
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    height: '100%',
                                    width: '5px',
                                    cursor: 'col-resize',
                                    userSelect: 'none',
                                    zIndex: 10,
                                }}
                            />
                        )}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map(renderRow)}
            </tbody>
        </table>
    );
}
