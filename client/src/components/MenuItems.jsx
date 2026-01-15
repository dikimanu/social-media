import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const MenuItems = ({ setSidebarOpen }) => {
  return (
    <div className="px-5 space-y-1 font-medium
                    text-slate-600">
      {menuItemsData.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `
            group flex items-center gap-3 px-4 py-2.5 rounded-xl
            transition-all duration-300
            ${
              isActive
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md'
                : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 hover:text-indigo-600'
            }
          `
          }
        >
          <Icon
            className={`
              w-5 h-5 transition-transform duration-300
              group-hover:scale-110
            `}
          />
          <span className="relative">
            {label}
            <span
              className={`
                absolute left-0 -bottom-0.5 h-0.5 rounded-full
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                transition-all duration-300
                ${to === '/' ? '' : 'group-hover:w-full w-0'}
              `}
            />
          </span>
        </NavLink>
      ))}
    </div>
  )
}

export default MenuItems
