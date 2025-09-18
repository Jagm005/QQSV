const equipo2Questions = [
  // Pregunta 1
  {
    question: "¿Cuál de los siguientes obispos es el máximo canciller de la Universidad?",
    options: [
      "Monseñor Nelson Jair Cardona Ramírez",
      "Monseñor Rigoberto Corredor",
      "Monseñor Francisco Nel Jimenez",
      "Monseñor Rubén Darío Jaramillo Montoya", // Correcta (D, en tabla A=0, intercambiada con A)
    ],
    correct: 0,
  },
  // Pregunta 2
  {
    question: "¿En qué año se instaló el letrero La U. Católica de Pereira?",
    options: [
      "2010",
      "2016",
      "2020", // Correcta (C, en tabla D=3, intercambiada con D)
      "2018",
    ],
    correct: 3,
  },
  // Pregunta 3
  {
    question: "¿Quiénes fueron figuras claves elegidas por los estudiantes para la fundación de la Universidad?",
    options: [
      "Monseñor Francisco Arias y el Padre Francisco Nel Jiménez", // Correcta (B, en tabla A=0, intercambiada)
      "Monseñor Rigoberto Corredor Bermúdez y el doctor Ricardo Tribín",
      "Teresita Mejía Ocampo y Gonzalo Vallejo Restrepo",
      "Cardenal Darío Castrillón Hoyos e Isabel la Católica",
    ],
    correct: 0,
  },
  // Pregunta 4
  {
    question: "¿Con qué universidad se realizó el convenio para crear el programa de Ciencias Religiosas?",
    options: [
      "Universidad Pontificia Bolivariana",
      "Universidad Católica de Manizales", // Correcta (B, en tabla C=2, intercambiada con C)
      "Universidad San Buenaventura de Cali",
      "Universidad del Rosario Bogotá",
    ],
    correct: 2,
  },
  // Pregunta 5
  {
    question: "La Biblioteca pertenece a REUNIR ¿Qué es REUNIR?",
    options: [
      "Red Especializada en Universidades de Investigación Regional", // Correcta (B, posición 1, tabla B=1)
      "Red de Unidades de Información de Risaralda y Eje Cafetero",
      "Red Educativa Universitaria Nacional de Investigación y Recursos",
      "Registro de Bibliotecas Investigativas",
    ],
    correct: 1,
  },
  // Pregunta 6
  {
    question: "¿Qué país es conocido como la “tierra del sol naciente”?",
    options: [
      "Japón", // Correcta (B, tabla A=0, intercambiada)
      "China",
      "Corea del Sur",
      "Vietnam",
    ],
    correct: 0,
  },
  // Pregunta 7
  {
    question: "¿Qué río atraviesa la ciudad de Londres?",
    options: [
      "Támesis", // Correcta (C, tabla A=0, intercambiada)
      "Sena",
      "Rin",
      "Danubio",
    ],
    correct: 0,
  },
  // Pregunta 8
  {
    question: "¿Quién escribió Cien años de soledad?",
    options: [
      "Gabriel García Márquez", // Correcta (B, tabla A=0, intercambiada)
      "Julio Cortázar",
      "Mario Vargas Llosa",
      "Pablo Neruda",
    ],
    correct: 0,
  },
  // Pregunta 9
  {
    question: "¿En qué año se firmó la independencia de Estados Unidos?",
    options: [
      "1789",
      "1795", // Correcta (A, tabla C=2, intercambiada)
      "1776",
      "1810",
    ],
    correct: 2,
  },
  // Pregunta 10
  {
    question: "¿Qué ciudad fue capital del Imperio bizantino?",
    options: [
      "Jerusalén",
      "Atenas", // Correcta (B, tabla D=3, intercambiada)
      "Roma",
      "Constantinopla",
    ],
    correct: 3,
  },
  // Pregunta 11
  {
    question: "¿Quién pintó “La persistencia de la memoria”?",
    options: [
      "Picasso", // Correcta (A, tabla B=1, intercambiada)
      "Dalí",
      "Miró",
      "Monet",
    ],
    correct: 1,
  },
  // Pregunta 12
  {
    question: "¿Qué científico descubrió la radiactividad?",
    options: [
      "Marie Curie",
      "Antoine Becquerel", // Correcta (C, tabla B=1, intercambiada con B)
      "Pierre Curie",
      "Lavoisier",
    ],
    correct: 1,
  },
  // Pregunta 13
  {
    question: "¿Qué país fue campeón del Mundial de Fútbol 2014?",
    options: [
      "Alemania", // Correcta (B, tabla A=0, intercambiada)
      "Brasil",
      "España",
      "Argentina",
    ],
    correct: 0,
  },
  // Pregunta 14
  {
    question: "¿Cuál es la capital de Canadá?",
    options: [
      "Montreal", // Correcta (C, tabla C=2, intercambiada con A)
      "Toronto",
      "Ottawa",
      "Vancouver",
    ],
    correct: 2,
  },
  // Pregunta 15
  {
    question: "¿Quién fue el filósofo griego maestro de Alejandro Magno?",
    options: [
      "Aristóteles",
      "Platón",
      "Sócrates", // Correcta (C, tabla A=0, intercambiada)
      "Heráclito",
    ],
    correct: 0,
  },
  // Pregunta 16
  {
    question: "¿Qué escritor alemán es autor de Fausto?",
    options: [
      "Schiller", // Correcta (A, tabla C=2, intercambiada con C)
      "Molière",
      "Goethe",
      "Voltaire",
    ],
    correct: 2,
  },
  // Pregunta 17
  {
    question: "¿Cuál es la velocidad de la luz en el vacío?",
    options: [
      "300.000 km/s", // Correcta (A, tabla A=0)
      "150.000 km/s",
      "1.000 km/s",
      "30.000 km/s",
    ],
    correct: 0,
  },
  // Pregunta 18
  {
    question: "¿Qué compositor fue el creador de la ópera El anillo del nibelungo?",
    options: [
      "Puccini",
      "Mozart", // Correcta (C, tabla D=3, intercambiada con D)
      "Verdi",
      "Richard Wagner",
    ],
    correct: 3,
  },
  // Pregunta 19
  {
    question: "¿Cuál es la capital de Kazajistán?",
    options: [
      "Tashkent", // Correcta (B, tabla B=1)
      "Nursultán (Astaná)",
      "Bishkek",
      "Dusambé",
    ],
    correct: 1,
  },
  // Pregunta 20
  {
    question: "¿En qué año fue derribado el Muro de Berlín?",
    options: [
      "1989", // Correcta (B, tabla A=0, intercambiada)
      "1987",
      "1990",
      "1991",
    ],
    correct: 0,
  },


];

export default equipo2Questions;
