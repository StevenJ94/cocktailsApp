import logo from '../../assets/img/logo.png'
import appFirebase from '../../credenciales'

import { getAuth, signOut } from 'firebase/auth'

const auth = getAuth(appFirebase);

export const Home = ({correoUsuario}) => {
  return (
    <>
    <div className="contenedor">
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
  <img src={logo} alt="" width={70}/>

    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle fw-semibold" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Perfil
          </a>
          <ul className="dropdown-menu p-3">
            <li><p className="mb-0 fw-semibold">
              <span className='text-primary'>
              Correo:
              </span> {correoUsuario}</p></li>
            <li className='d-flex justify-content-center mt-2'><button className="btn btn-primary" onClick={() => {signOut(auth)}}>Cerrar sesión</button></li>
          </ul>
        </li>

      </ul>
      <div className="d-flex">

      </div>
      <form className="d-flex" role="search">
        <input className="form-control me-2" type="search" placeholder="Buscar cóctel..." aria-label="Search" />
      </form>
    </div>
  </div>
</nav>
    </div>
    </>
  )
}
