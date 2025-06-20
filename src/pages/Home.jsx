import CardProducto from '../components/CardProducto';
import CerrarSesion from "../components/CerrarSesion";


function Home() {
return (
<div>
<h2>Bienvenido a EcoFood</h2>
<CerrarSesion /> 
<CardProducto nombre="Pan Integral" precio="$500" />

</div>
);
}


export default Home;


