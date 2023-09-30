import React, { useState } from 'react';
import { BiSolidChevronDown } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const SidebarItem = ({ item }) => {
    const [open, setOpen] = useState(false);

    if (item.childrens) {
        return (
            <div className={open ? "sidebar-item open" : "sidebar-item"}>
                <div className="sidebar-title" onClick={() => setOpen(!open)}>
                    <span>
                        {item.icon}
                        {item.title}
                    </span>
                    <BiSolidChevronDown className="icon-dropdown" />
                </div>
                <div className="sidebar-content">
                    {item.childrens.map((child, index) => (
                        <div key={index} className="sidebar-link">
                            <Link to={child.path} className='link'>
                                {child.title}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        )
    } else {
        return (
            <Link to={item.path || "/"} className="sidebar-item plain link">
                {item.icon}
                {item.title}
            </Link>
        )
    }

}

export default SidebarItem