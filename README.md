# Prueba Técnica Realizada para Alegra #
Para esta prueba, se desarrolló una REST API basada en microservicios, corriendo en la nube de AWS y usando DynamoDB para persistir los datos; se útlizo el patrón de diseño Model-View-Controller para gestiónar las rutas, lo controladores y los datos retonardos a los clientes de forma óptima y escalable

## Endpoints 💻 ##
La arquitectura de la REST API está basada en microservicios, que serán descritos posteriormente, estos son: **kitchen** y **warehouse**, los endpoints para cada uno de ellos se listan a continuación
### La cocina 🍳 [kitchen] ###
#### 🥩 **/api/kitchen/make-dish** ####
[GET] en este endpoint, el cliente puede realizar una petición para crear un plato (aleatorio) entre los disponibles en el menú para la jornada de almuerzos gratis, el controlador de la cocina realiza, *grosso modo* los siguientes pasos
1. Creación de plato aletorio
2. Petición al microservicio de la bodega de los ingredientes necesarios para cocinar el plato
3. Cocinar el plato con los ingredientes entregados por la bodega
4. Actualizar el estado del plato a entregado (delivered = true)
5. Retornar el plato escogido en el punto 1. al cliente

#### 🖨 **/api/kitchen/dish-history** ####
[GET] En este endpoint, el cliente puede hacer la petición para consultar en la base de datos todos los platos que la cocina ha recibido para preparar, para ello, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos por la entidad Dish
2. Retorna la lista al cliente

Nota: El parametro [limit] puede ser ingresado como un parametro query para limitar la cantidad de elementos mostrados, por defecto, ésta cantidad corresponde a los últimos 20 registros.

#### 🎡 **/api/kitchen/dish-queue** ####
[GET] En este endpoint, el cliente puede hacer la petición para consultar en la base de datos los platos que aun no han sido cocinados, para ello, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos de entidad Dish con atributo delivered = false
2. Retorna la lista al cliente



#### 🥧 **/api/kitchen/menu** ####
[GET] En este endpoint, el cliente puede hacer la petición para consultar en la base de datos el menu disponible, para ello, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos por la entidad menu
2. Retorna la lista al cliente

Nota: Para el cliente es transparente la división en microservicios de la cocina y la bodega

### La bodega 🏠 [warehouse] ###

#### 🍖 **/api/warehouse/get-ingredients** ####
[POST] Este es el endpoint que dispone el microservicio de la bodega para recibir las peticiones de los ingredientes que necesita la cocina, retornarndo la cantidad necesaria para preparar el plato, el controlador del microservicio realiza los siguientes pasos para llevar a cabo la petición
1. Consulta en la base de datos del stock disponible
2. Comparación entre el stock disponible y los ingredientes solicitados
3. En caso de haber défict en alguno de los ingredientes, el controlador inicia una orden de compra de dicho ingrediente a la plaza de mercado
4. Si la cantidad comprada es igual a cero, el controlador repite la petición las veces que sea necesaria (hasta que quantitySold sea diferente de cero)
5. Si la cantiadad comprada a la plaza de mercado es inferior a la cantidad requerida por el pedido, el controlador repite el punto 3. hasta que la cantidad comprada (acumulada) sea al menos igual a la cantidad requerida para preparar el plato
6. Si la cantidad comprada a la plaza de mercado es al menos igual a la requerida, se termina la orden de compra, marcandose como éxitosa y guardándose en la base de datos
5. Si la cantidad comprada es superior a la requerida, el controlador guarda en el stock el restante
7. Se actualiza la base de datos con la entidad Stock y el id="v1", que corresponde con el stock de la bodega en la base de datos
8. Retorna los ingredientes solicitados a la cocina

*Importante*: Este endpoint require una ApiKey para poder hacer la solicitud, cargada en los headers de la solicitud del microservicio de la cocina. Además, el microservicio de la bodega sólo recibira pedidos de los ingredientes registrados en el presente reto

#### 🖨 **/api/warehouse/orders-history** ####
[GET] En este endpoint el microservicio de la bodega consulta a la base de datos el historial de órdenes de compra, siendo éstas almacenadas cuando las compras son éxitosas, es decir, cuando la cantidad comprada a la plaza de mercado es diferente de cero. Para la consulta, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos por la entidad OrderIngredient
2. Retorna la lista al cliente

Nota: El parametro limit puede ser ingresado como un parametro query para limitar la cantidad de elementos mostrados, por defecto, ésta cantidad corresponde a los últimos 20 registros.

#### 🎫 **/api/warehouse/stock** ####
[GET] Aquí, el cliente puede consultar el stock disponible en la base de datos en el momento de la consulta, para ello, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos por la entidad Stock
2. Retorna la lista al cliente




## Microservicios 🐳 ##
Como se menciona anteriormente, la arquitectura de la REST API está basada en microservicios corriendo en contenedores Docker, al interior de las rutas de cada microservicio se encuentra el archivo Dockerfile y el archivo .dockerignore

Para el funcionamiento de cada microservicio, es necesario inyectar a cada contenedor las variables de entorno necesarias, ya que éstas no se encuentran alojadas al interior de las imagenes Docker. 
**Las variables de entorno requeridas se listan a continuación**
### 🧪 kitchen ###
1. PORT=*Puerto donde va a estar escuchando peticiones el contenedor*
2. WAREHOUSE_URL=*URL del microservicio de la bodega*
3. WAREHOUSE_KEY=*ApiKey de la bodega para poder hacer las peticiones al endpoint /get-ingredientes*
4. MENU_MAX=*Máximo número de platos ofrecidos en el menu. Para el presente reto la cantidad es 6*
5. AWS_ACCESS_KEY_ID=*Identificador de un rol de AWS con políticas de acceso a DynamoDB*
6. AWS_SECRET_ACCESS_KEY=*Clave del rol para realizar las peticiones a la base de datos*
7. AWS_TABLE_NAME=*Nombre de la tabla de DynamoDB*
8. AWS_REGION=*Región de AWS en donde se encuentra la base de datos*

### 🧪 warehouse ###
1. PORT=*Puerto donde va a estar escuchando peticiones el contenedor*
2. WAREHOUSE_API_KEY=*Clave de la API del microservicio*
3. MARKETPLACE_URL=*URL de la plaza de mercado*
4. INGREDIENTS_MAX=*Máximo número de ingredientes utilizados, para el caso del reto la cantidad es de 10*
5. AWS_ACCESS_KEY_ID=*Identificador de un rol de AWS con políticas de acceso a DynamoDB*
6. AWS_SECRET_ACCESS_KEY=*Clave del rol para realizar las peticiones a la base de datos*
7. AWS_TABLE_NAME=*Nombre de la tabla de DynamoDB*
8. AWS_REGION=*Región de AWS en donde se encuentra la base de datos*

## Base de Datos ⚙ ##
La base de datos escogida para llevar a cabo el reto fue DynamoDB, una base de datos administrada por AWS, NoSQL de tipo clave-valor, que proporciona alto rendimiento, escalabilidad y disponibilidad.
En esta base de datos su clave única está compuesta por una Partition Key [PK] y una Sort Key [SK], en conjunto, forman un valor único, al cual se le atribuye una serie de atributos, que no necesariamente son consistentes entre items de la tabla (es decir, los atributos pueden ser diferentes para cada item).

Para el presente reto, la arquitectura de la base de datos es la siguiente
#### 🗝 Partition Key ####
La patition key escogida es llamada [entity] y corresponse con cualquier entidad que pueda existir en la lógica de negocio, en este caso, la entidades disponibles son:
1. Dish: corresponde a las solicitudes de platos generadas a la cocina
2. OrderIngredient: corresponde a las órdenes de compra exitosas realizadas a la plaza de mercado
3. Stock: corresponde al stock de la bodega
4. menu: corresponde a los platos disponibles en el menu

La PK es de tipo String

#### 🗝 Sort Key ####
Junto con la PK, la SK hace de cada item un elemento único en la base de datos. La sort key escogida para el presente reto es: [id]
Además, la SK es de tipo String

#### 🎨 Local Secundary Index ####
El local secundary index en una base de datos DynamoDB permite cambiar la sort key por un atributo deseado, para el presente caso, se crea un local secundary index que apunta hacia el atributo [delivered], con el fin de hacer querys eficientes al momento de consultar por los platos aún no entregados

#### 🧲 Conexión a Base de Datos ####
La conexión a la base de datos se lleva a cabo mediante el el paquete de AWS Software Development Kit (SDK), en su versión 3, concretamente con la librería de DynamoDBClient, librería que permite la gestión de bases de datos de DynamoDB desde Node.js

#### 🚦 Inicializar base de datos ####
Para poder recrear el reto con cualquier otra base de datos de tipo Dynamo DB es necesario inicializar las entidades Stock y menu, en las cuales se va a alojar el Stock inicial y los platos que se van a ofrecer en el menú, respectivamente. A continuación se muestra un JSON para inicializar el Stock y un molde de un plato del menú (los demás seguirán el mismo patrón, siendo los ingredientes y su cantidad arbitrarios y según las condiciones del reto)

##### Stock #####
{
  "entity": {
    "S": "Stock"
  },
  "id": {
    "S": "v1"
  },
  "stock": {
    "M": {
      "cheese": {
        "N": "5"
      },
      "chicken": {
        "N": "5"
      },
      "ketchup": {
        "N": "5"
      },
      "lemon": {
        "N": "5"
      },
      "lettuce": {
        "N": "5"
      },
      "meat": {
        "N": "5"
      },
      "onion": {
        "N": "5"
      },
      "potato": {
        "N": "5"
      },
      "rice": {
        "N": "5"
      },
      "tomato": {
        "N": "5"
      }
    }
  }
}

##### menu #####

{
  "entity": {
    "S": "menu"
  },
  "id": {
    "S": "0"
  },
  "ingredients": {
    "M": {
      "cheese": {
        "N": "2"
      },
      "chicken": {
        "N": "1"
      },
      "onion": {
        "N": "1"
      },
      "potato": {
        "N": "2"
      }
    }
  },
  "name": {
    "S": "Pollo al Gratín"
  }
}

## Deploy 🎇 ##
Para realizar el Deploy de la API REST y la Interfaz gráfica se llevaron a cabo lo siguientes pasos, a saber
1. Build de las imagenes Docker a desplegar por cada microservicio
2. Registro de dichas imagenes en AWS ECR, el registro de imagenes docker de AWS, en un repositorio privado
3. Creación de un Cluster en ECS, el servicio de contenedores elásticos de AWS
4. Asignación de tareas para cada imagen registrada en ECR (cada tarea corresponde con un microservicio)
5. Creación de servicios en el Cluster creado anteriormente, asignado a cada servicio una nueva tarea. Cada servicio aloja a 2 replicas de cada tarea, para garatizar disponibildad de los microservicios. Dichos servicios utilizan AWS Fargate para su funcionamiento
6. Asignación de un Application Load Balancer [ALB] para los servicios, con el fin de garantizar escalabilidad y funcionamiento de la REST API
7. Creación y asignación de un Network Load Balancer [NLB] para recibir las peticiones entrantes desde internet. El NLB se conecta directamente con el ALB
8. Creación y asignación de una REST API de enrutamiento en AWS API Gateway. Esta API se conecta directamente con el NLB, con el fin de direccionar las peticiones entrantes desde la web al NLB y posteriormente a los microservicios de la REST API
9. Deploy de la interfaz gráfica en AWS S3

# Fin #
*mariovelandiac*
