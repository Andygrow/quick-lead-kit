// Centralized data for the testimonials section.
// Having per-testimonial `objectPosition` lets us fine-tune face framing per photo.

// Import testimonial images
import caroBatlle from "@/assets/testimonials/caro-batlle.jpeg";
import magalyAyelef from "@/assets/testimonials/magaly-ayelef.jpeg";
import raulSaavedra from "@/assets/testimonials/raul-saavedra.jpeg";
import juanCarlosToro from "@/assets/testimonials/juan-carlos-toro.jpeg";
import gustavoMaulen from "@/assets/testimonials/gustavo-maulen.jpeg";
import juanFranciscoSainz from "@/assets/testimonials/juan-francisco-sainz.jpeg";
import fabiolaToutin from "@/assets/testimonials/fabiola-toutin.jpeg";
import katherineKrause from "@/assets/testimonials/katherine-krause.jpeg";
import victorYanez from "@/assets/testimonials/victor-yanez.jpeg";

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  image?: string;
  /** CSS object-position value, e.g. "50% 12%" (x y). Lower y% = crop higher (usually better for faces). */
  objectPosition?: string;
}

// Default y% - higher = show more from top of image (faces)
const DEFAULT_OBJECT_POSITION = "50% 25%";

export const testimonials: Testimonial[] = [
  {
    quote:
      "Constanza me ayudó en mi posicionamiento de marca de LinkedIn, desde definir mi propuesta de valor, optimizar mi perfil hasta lograr ejecutar una estrategia que me servirá para lograr los resultados que estoy buscando.",
    author: "Caro Batlle",
    role: "Especialista en Visual Merchandising",
    company: "Studio Caro Batlle",
    rating: 5,
    image: caroBatlle,
    objectPosition: "50% 47%",
  },
  {
    quote:
      "Ha sido realmente interesante el curso 'Eleva tu marca', muy educativo, me ayudó de forma importante a profesionalizar mi perfil y poder sacar el máximo de provecho para mi negocio, muchas gracias.",
    author: "Magaly Ayelef",
    role: "Corredora de Propiedades Comerciales",
    company: "Independiente",
    rating: 5,
    image: magalyAyelef,
    objectPosition: "50% 50%",
  },
  {
    quote:
      "Tuve la suerte de recibir una mentoría de Constanza sobre cómo potenciar mi perfil de LinkedIn, y fue una experiencia realmente valiosa. Me ayudó a identificar con claridad cómo destacar mi propuesta de valor, ordenar mi trayectoria y conectar mejor con mi público objetivo.",
    author: "Raúl Saavedra Astete",
    role: "Gerente de Cuentas Clave",
    company: "Experiencia de Clientes",
    rating: 5,
    image: raulSaavedra,
    objectPosition: "50% 50%",
  },
  {
    quote:
      "Constanza en su trabajo fue una visionaria, en lo puntual su asesoría tuvo elementos diferenciadores para mi gestión que, sin duda han sido un aporte. Claramente recomiendo su propuesta y gestión.",
    author: "Juan Carlos Toro Olave",
    role: "Jefe Comercial y Sucursal",
    company: "Desarrollador de Negocios B2B & B2C",
    rating: 5,
    image: juanCarlosToro,
    objectPosition: "50% 51%",
  },
  {
    quote:
      "Tuve una muy buena experiencia en el curso que realiza Constanza. Me ha dado muy buenas bases para gestionar mi marca personal y además me ayudó a encontrar una adecuada línea editorial de publicaciones. Muy recomendada, su generosidad ha sido de enorme ayuda.",
    author: "Gustavo Maulén Contreras",
    role: "Asesor de Inversiones",
    company: "Optimización Financiera",
    rating: 5,
    image: gustavoMaulen,
    objectPosition: "50% 54%",
  },
  {
    quote:
      "Excelente experiencia, super empática y clara, totalmente recomendable. Estoy totalmente satisfecho y seguro de que continuaré trabajando con Constanza. No importa si manejas un negocio personal o si eres ejecutivo de una gran corporación, totalmente aplicable lo aprendido.",
    author: "Juan Francisco Sainz",
    role: "Senior Account Executive",
    company: "OutSystems",
    rating: 5,
    image: juanFranciscoSainz,
    objectPosition: "50% 54%",
  },
  {
    quote:
      "Coni tiene una mirada estratégica, actualizada y muy práctica, que combina perfectamente con su cercanía y capacidad de escuchar. Recomiendo a Coni sin dudarlo a cualquier profesional que quiera trabajar seriamente su marca personal.",
    author: "Fabiola Toutin Cornejo",
    role: "Ejecutiva Comercial",
    company: "Antalis Abitek SPA",
    rating: 5,
    image: fabiolaToutin,
    objectPosition: "50% 50%",
  },
  {
    quote:
      "Constanza nos ha ayudado a entender la importancia de potenciar nuestras habilidades, no solo como profesionales sino como personas íntegras. Es una profesional sólida con tremenda experiencia en empresas internacionales como Antalis, gracias a su enseñanza hemos podido emprender en LinkedIn.",
    author: "Katherine Krause",
    role: "Directora de Recursos Humanos",
    company: "Antalis Latinoamérica",
    rating: 5,
    image: katherineKrause,
    objectPosition: "50% 50%",
  },
  {
    quote:
      "Constanza es una excelente Mentor de LinkedIn quien te prepara de manera exitosa para tener un perfil ejecutivo y enfocado al área de trabajo que te desempeñas, agradezco toda la información obtenida en nuestra capacitación. Recomiendo el trabajo de Constanza para personas o empresas que necesiten mejorar su red de LinkedIn.",
    author: "Victor Yañez Mellado",
    role: "Ejecutivo de Ventas Integral",
    company: "Coopeuch",
    rating: 5,
    image: victorYanez,
    objectPosition: "50% 48%",
  },
];

export const companyLogos = [
  "Santander",
  "Laborum",
  "Legrand",
  "U de Chile",
  "Antalis",
  "Papa John's",
  "Kibernum",
  "OutSystems",
];
