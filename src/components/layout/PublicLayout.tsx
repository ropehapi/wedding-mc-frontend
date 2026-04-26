import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-pub-bg font-lato">
      <Outlet />
    </div>
  )
}
