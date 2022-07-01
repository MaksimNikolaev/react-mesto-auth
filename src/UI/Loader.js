import LoaderImg from '../images/loader.svg'

function Loader() {
  return (
    <div>
      <img src={LoaderImg} alt="Loader" className="loader"></img>
      <h2 style={{display: "flex", justifyContent:"center", color: "white"}}>Идет загрузка...</h2>
    </div>    
  )
}

export default Loader;