import axios from "axios"
import routes from "../routes"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'))

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` }
  }
  return {}
}

export const Main = () => {
  const navigate = useNavigate()
  const header = getAuthHeader()

  useEffect(() => {
    if (!header.Authorization) {
      navigate('/login')
    }
  }, [])
  
  return (
    <>
      <div className="container-fluid m-0">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-4">
            <div className="card mt-2">
              <div className="card-body">
              </div>
              <div className="card-footer"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
