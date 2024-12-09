ESTAS SON LAS OBSERVACIONES QUE FUI TENIENDO DURANTE EL PROCESO DE CREACIÓN DEL PROYECTO:

- Error en la ruta de iniciar sesión: Debido a que tuve un error de CORS en la ruta de: https://dummyjson.com/docs/auth, no pude usarla, por ende implementé el sistema de autenticación de Firebase. Todo el inicio de sesión, registro y cerrar sesión, se trabaja con Firebase. Una última cosa que noté, es que firebase, no me devuelve un usuario cuando se trabaja con el sistema de autenticación de correo y contraseña, solo me devuelve el email, por ende solo muestro el email en el perfil.

- Problema de CORS y campos null: Con respecto a las de https://www.thecocktaildb.com/api.php, en algunas ocaciones me presentaba error de cors pero son contadas con la mano a diferencia de la ruta de https://dummyjson.com/docs/auth, que simplemente no me dejaba hace nada.
  Con respecto a los campos null, al listar ingredientes, en algunas ocaciones venían null los campos, por ende puede que en el listado de 4 ingredientes, vean 3, debido a que un ingrediente vino null.

- solucción de problemas para ingredientes y cócteles aleatorios y populares: Debido que solo se podría obtener un cóctel aleatorio a la vez, tocó hacer un ciclo para traer los campos un número de veces deseada (8 veces). En el caso de ingredientes, utilicé la función math.random para darle un número aleatorio a la ruta de traer un ingrediente, así traigo un ingrediente aleatorio, en el caso de populares, como la ruta es premium, usé los mismos datos de lo aleatorio tanto de ingredientes y cócteles, por ende dividide el array, dándole 4 datos por lista:

  - 4 datos para cócteles populares
  - 4 datos para cócteles aleatorios
  - 4 datos para ingredientes populares
  - 4 datos para ingredientes aleatorios

- Filtros: En el tema de los filtros, noté que en algunas ocaciones si unes varios filtros al tiempo, el resultado no cambia los datos que se traen, no sé como se está manejando en el backend, pero los filtros funcionan perfectamente, y utilizo los params de url para setearlos en la lista. Pueden hacer pruebas con cada filtro y con varios, algunos filtros juntos funcionan, otras no cambian los datos, pueden verificar en el network que se estén enviando correctamente.

- Paginación: Como hay bastante datos, utilicé paginación para separar los datos y se vea más presentable.

- Detalles: En el detalle tanto de un cóctel, no se páginan los ingredientes debido a que un cóctel no suele tener muchos ingredientes. Pero en el caso del detalle del igrediente, si se páginan los cócteles, ya que un ingrediente si puede estár en muchos cócteles.

- CSS: Use Bootstrap para los estilos y componentes.

Eso es todo, estoy atento a cualquier respuesta o retroalimentación. Espero y les guste el proyecto!
