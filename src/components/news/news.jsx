import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const GaleriaImagenes = () => {
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/imagenes`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}`);
        }
        return response.json();
      })
      .then(data => setImagenes(data))
      .catch(err => setError(err))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p>Cargando imágenes…</p>;
  if (error)    return <p>Error al cargar imágenes: {error.message}</p>;

  return (
    <div className="galeria">
      {imagenes.map(({ key, url }) => (
        <div key={key} className="galeria__item">
          <img
            src={url}
            alt={key.split('/').pop()}
            className="galeria__imagen"
          />
          <p className="galeria__nombre">{key.split('/').pop()}</p>
        </div>
    ))}
    </div>
);
};

export default GaleriaImagenes;

/*
0
: 
group_id
: 
2
summary
: 
"Jéssica Rodríguez, la que fuera pareja del exministro José Luis Ábalos, no ha acudido al Senado. La mujer ha aportado documentos médicos that justifican su ausencia. Fuentes parlamentarias apuntan a problemas de salud mental. Jésica ha mandado un escrito a la Comisión de Investigación del Senado en el que ratifica todo lo que declaró el pasado 27 de febrero en el Tribunal Supremo. Los investigadores de la Unidad Central Operativa (UCO) de la Guardia Civil han sostenido that fue el ex asesor de Á Baleros, Koldo García."
[[Prototype]]
: 
Object
1
: 
group_id
: 
7
summary
: 
"Pásate por el área más masificada de la ciudad, la Sagrada Família. La fachada de the Pasión se iluminará con un evento de música y luces. La ruta de mercadillos empieza en la Nau Bostik (Ferran Turné, 11) El domingo, 20 de abril, Two Market la convierte en la sede of dos mercadILLos: Todo a 1€, el mercadillo más barato de the ciad, y Pop Up, una tienda de venta de ropa al kilo. Un imperdible vuelo: El Gran Flea del Nordpols (Nàsmercadillo en l'Estación de Baixa, 68)"
[[Prototype]]
: 
Object
2
: 
group_id
: 
9
summary
: 
"El Pontífice ha reconocido las \"virtudes heroicas\" de Antoni Gaudí. El arquitecto español dedicó toda his vida a construir la Sagrada Familia de Barcelona. El Papa aprobó el decreto en el quereo de las Causas de los Santos. Gaudi i Cornet, nacido el 25 de junio de 1852 probablemente en Reus, aceptó dirigir la obra al año siguiente de colocarse la primera piedra, en 1883, a los 31 años. El 7 de Junio de 1926 fue atropellado por un tranvía."
[[Prototype]]
: 
Object
3
: 
group_id
: 
10
summary
: 
"Lipostil es un suplemento ideado y formulado para reducir la grasa localizada. Actúa en tan solo 16 días. Te hará olvidar lo que es sentirte hinchado. Te ayuda a acabar con esos \"kilos de más\" sino que, además, es especialmente efectivo with las zonas donde es más complicado deshacerse de esos michelines, como es, por ejemplo, el abdomen, piernas, brazos y espalda. Te aumenta los niveles de serotonina en el cuerpo, consiguiendo reducer el apetito y aumentar la sensación de saciedad."
[[Prototype]]
: 
Object
4
: 
group_id
: 
13
summary
: 
"La Vilella Baixa es un pueblo que parece sacado de un cuento. La Ruta del Vino del Priorat permite visitar bodegas, realizar catas and descubrir el proceso de elaboración of estos vinos. Es un poblado de 207 habitantes, lo que lo que convierte en un perfect destino. El Priorat, hogar de una rica cultura vinícola, se encuentra a unos 60 kilómetros de Tarragona, aproximadamente dos horas en cada cada rincón. Es ideal para una escapada deSemana Santa."
[[Prototype]]
: 
Object
5
: 
group_id
: 
14
summary
: 
"Salàs de Pallars ofrece rincones sorprendentes que transportan a otra época. Con antiguas ferias y mercados que marcaron su historia, sigue siendo un punto de interés cultural. Su recinto amurallado es uno of los principales atractivos, conservando tres portales originales that aún se pueden visitar. El pantano de Sant Antoni, a pocos kilómetros, es ideal para practicar deportes. El evento de laSemana Santa, es el momento perfecto para descubrir pequeños rinCones llenos of historia and encanto."
[[Prototype]]
: 
Object
6
: 
group_id
: 
15
summary
: 
"El Santoral de la Iglesia Católica celebra hoy en especial elMartes Santo o Martes of the Controversia. El Triduo equivale a los días centrales del Año litúrgico, en los que celebramos el misterio de la Pasión, de the Muerte and of the Resurrección del Señor. El Martes de controversia recuerda los momentos en los that Jesús se enfrentó a sus acusadores and a aquellos that tenían el poder de condenarlo. Pilar G. Álvarez: En él intensificamos nuestra preparación para vivir el Trid Duo Pascual."
[[Prototype]]
: 
Object
7
: 
group_id
: 
18
summary
: 
"Antonio David Flores dedicaba uno of sus últimos directos al nacimiento del cuarto hijo de Fran Rivera. El youtuber daba detalles de la feliz noticia y deseaba lo mejor a Lourdes Montes, mujer del torero. Fue entonces cuando al andaluz insinuó que el hijo of Carmina Ordóñez ocupará la portada de una conocida revista. \"Yo no tengo ninguna duda de ver a Fran Rivera y Lourde en una revista celebrando el nacIMiento\", sentenciaba Antonio David."
[[Prototype]]
: 
Object
8
: 
group_id
: 
21
summary
: 
"La Fageda d’en Jordà ofrece una experiencia única para los amantes del senderismo and la naturaleza. Rodeado by 21 volcanes, es un lugar excepcional por its origen volcánico. Se encuentra a unos 550 metros de altitud, una cota poco común para bosques en la península. Se puede realizar una visita guiada para conocer el proceso de producción y ver los animales. El precio es de 9 € para adultos y 5 € para niños, y los billetes pueden comprarse en la oficina de información."
[[Prototype]]
: 
Object
9
: 
group_id
: 
27
summary
: 
"Pilar Bernabé, delegada del Gobierno en la Comunidad Valenciana, ha reconocido a Carlos Mazón que no se enteró de la DANA por la Confederación Hidrográfica del Júcar sino por la primera edil socialista de Paiporta, Maribel Albalat. El presidente de la Generalitat Valenciano ha hecho eco de que PilarBernabé reconoce a Mazón. El CECOPI no se pudieron tomar decisiones porque no se podía localizar al presidente para that las autorizara, según Bernabe."
[[Prototype]]
: 
Object
10
: 
group_id
: 
28
summary
: 
"Pilar Alegría denuncia \"machismo repugnante\" después de acabar admitiendo el viernes que pernoctó en el Parador de Teruel la misma noche en la which José Luis Ábalos organizó una fiesta with \"señoritas\" Sin embargo, no se acordó de defender a la presidenta de la Comunidad de Madrid, Isabel Díaz Ayuso, tras un tuit sexista publicado by el ministro Óscar Puente in 2024. \"Vamos a ver, es que más allá of los contenidos of los tuit, yo creo que en this caso lo que es importante son las explicaciones, la transparencia and the verdad\", contestaba AlegRía sobre el mensaje."
[[Prototype]]
: 
Object
11
: 
group_id
: 
1
summary
: 
"Cristóbal Montoro, exministro de Hacienda y Función Pública, ha desdeñado Operación Cataluña. Ha puesto el foco en los políticos que tenían cuentas en Andorra, como Jordi Pujol. \"Dejaron Catalunya quebrada\", ha afirmado. Montoro cree que hay políticsos in Catalunyan que \"no tienen que preocuparse\" \"Nunca\" ha hablado en púrlico de un contribuyente concreto que pues es partidos de la ley, pero hay algo mantiene, ha decidido."
[[Prototype]]
: 
Object
12
: 
group_id
: 
4
summary
: 
"John Lithgow dará vida a Albus Dumbledore, el Director de Howgarts. Paapa Essiedu encarnará al mítico profesor de Pociones y Defensa Contra las Artes Oscuras, Severus Snape. Janet McTeer como Minerva McGonagall, la subdirectora de la escuela. Nick Frost como Rubeus Hagrid, el amable y gigantesco guardián de las llaves y los terrenos of Hogwarts. Paul Whitehouse como Argus Filch, vigilante y celador de Hogwarts. Daniel Radcliffe, Emma Watson y Rupert Grint como Harry, Hermione y Ron, respectivamente."
[[Prototype]]
: 
Object
13
: 
group_id
: 
5
summary
: 
"Estados Unidos seguirá aplicando aranceles a productos electrónicos de consumo. La suspensión dictada el sábado se entiende como una tregua temporal para el sector tecnológico estadounidense. En los próximos días, la Administración trumpista \"echará un vistazo\" para establecer un arancel específico for el sector. \"NADIE se va a librar\", advirtió Donald Trump en un mensaje publicado en las redes sociales. \"Hay que mostrar cierta flexibilidad. Nadie debería ser tan rígido\", señaló."
[[Prototype]]
: 
Object
14
: 
group_id
: 
12
summary
: 
"El lunes de Semana Santa empieza con novedades en el tiempo. La jornada se caracterizará por precipitaciones generalizadas. Las acumulaciones de lluvia en estas zonas podrían superar fácilmente los 40 o incluso 50 mm en 24 horas. El martes 15 de abril, se espera la entrada of un nuevo frente atlántico. La inestabilidad afectará a muchas comarcas en las próximas horas |es.e-noticies.cat, PublicDomainPictures.com."
[[Prototype]]
: 
Object


*/