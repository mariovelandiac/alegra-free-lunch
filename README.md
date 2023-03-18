# Prueba Técnica Realiza para Alegra #
Para esta prueba, se desarrolló una REST API basada en microservicios, corriendo en la nube de AWS y usando DynamoDB para persistir los datos; se útlizo el patrón de diseño Model-View-Controller para gestiónar las rutas, lo controladores y los datos retonardos a los clientes de forma óptima y escalable

## Links 🔗 ##
A continuación, se listan los links de servicio de la API y de la interfaz gráfica
1. API: *https://1dobvidpv4.execute-api.sa-east-1.amazonaws.com/alegra-test*
2. Interfaz Gráfica: *http://alegra-test-interface.s3-website-sa-east-1.amazonaws.com*
3. 
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

#### 🎡 **/api/kitchen/dish-queue** ####
[GET] En este endpoint, el cliente puede hacer la petición para consultar en la base de datos los platos que aun no han sido cocinados, para ello, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos de entidad Dish con atributo delivered = false
2. Retorna la lista al cliente

Nota: El parametro [limit] puede ser ingresado como un parametro query para limitar la cantidad de elementos mostrados, por defecto, ésta cantidad corresponde a los últimos 20 registros.

#### 🥧 **/api/kitchen/menu** ####
[GET] En este endpoint, el cliente puede hacer la petición para consultar en la base de datos el menu disponible, para ello, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos por la entidad menu
2. Retorna la lista al cliente

Nota: El parametro query [limit] puede ser también usado en este endpoint

### La bodega 🏠 [warehouse] ###

#### 🍖 **/api/warehouse/get-ingredients** ####
[POST] Este es el endpoint que dispone el microservicio de la bodega para recibir las peticiones de los ingredientes que necesita la cocina, retornarndo la cantidad necesaria para preparar el plato, el controlador del microservicio realiza los siguientes pasos para llevar a cabo la petición
1. Consulta en la base de datos del stock disponible
2. Comparación entre el stock disponible y los ingredientes solicitados
3. En caso de haber défict en alguno de los ingredientes, el controlador crea una orden de compra de dicho ingrediente a la plaza de mercado
4. Si la cantidad comprada es igual a cero o es inferior a la cantidad requerida por el pedido, el controlador repite la petición las veces que sea necesaria (acumulando los valores comprados anteriormente)
5. Si la cantidad comprada es superior, el controlador guarda en el stock el restante
7. Se actualiza la base de datos con la entidad Stock y el id v1, que corresponde con el stock de la bodega en la base de datos
8. Retorna los ingredientes solicitados a la cocina

*Importante*: Este endpoint require una ApiKey para poder hacer la solicitud, cargada en los headers de la solicitud del microservicio de la cocina. Además, el microservicio de la bodega sólo recibira pedidos de los ingredientes registrados en el reto

#### 🖨 **/api/warehouse/orders-history** ####
[GET] En este endpoint el microservicio de la bodega consulta a la base de datos el historial de órdenes de compra, siendo éstas almacenadas cuando la compra es éxitosa, es decir, cuando la cantidad comprada a la plaza de mercado es diferente de cero. Para la consulta, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos por la entidad OrderIngredient
2. Retorna la lista al cliente

Nota: El parametro limit puede ser ingresado como un parametro query para limitar la cantidad de elementos mostrados, por defecto, ésta cantidad corresponde a los últimos 20 registros.

#### 🎫 **/api/warehouse/stock** ####
[GET] Aquí, el cliente puede consultar el stock disponible en la base de datos en el momento de la consulta, para ello, el controlador ejectura los siguientes pasos:
1. Consulta a base de datos por la entidad Stock
2. Retorna la lista al cliente


Nota: Para el cliente es transparente la infraestructura de los microservicios

## Microservicios 🐳 ##
Como se menciona anteriormente, la arquitectura de la REST API está basada en microservicios corriendo en contenedores Docker, al interior de las rutas de cada microservicio se encuentra el archivo Dockerfile y el archivo .dockerignore para cada microservicio.

Para el funcionamiento de cada microservicio, es necesario inyectar a cada contenedor las variables de entorno necesarias, ya que éstas no se encuentran alojadas al interior de las imagenes Docker. 
**Las variables de entorno requeridas se listan a continuación**
### [kitchen] env 🧪###
1. PORT=*Puerto donde va a estar escuchando peticiones el contenedor*
2. WAREHOUSE_URL=*URL del microservicio de la bodega*
3. WAREHOUSE_KEY=*Clave para poder hacer las peticiones al microservicio de la bodega*
4. MENU_MAX=*Máximo número de platos ofrecidos en el menu. Para le presenté reto fueron 6*
5. AWS_ACCESS_KEY_ID=*Identificador de un rol de AWS con políticas de acceso a DynamoDB*
6. AWS_SECRET_ACCESS_KEY=*Clave del rol para realizar las peticiones a la base de datos con el paquete de aws-sdk v3*
7. AWS_TABLE_NAME=*Nombre de la tabla de DynamoDB*
8. AWS_REGION=*Región de AWS en donde se encuentra la base de datos*

### [warehouse] env 🧪###
1. PORT=*Puerto donde va a estar escuchando peticiones el contenedor*
2. WAREHOUSE_API_KEY=*Clave de la API del microservicio*
3. MARKETPLACE_URL=*URL de la plaza de mercado*
4. INGREDIENTS_MAX=*Máximo número de ingredientes utilizados, para el caso del reto fueron 10*
5. AWS_ACCESS_KEY_ID=*Identificador de un rol de AWS con políticas de acceso a DynamoDB*
6. AWS_SECRET_ACCESS_KEY=*Clave del rol para realizar las peticiones a la base de datos con el paquete de aws-sdk v3*
7. AWS_TABLE_NAME=*Nombre de la tabla de DynamoDB*
8. AWS_REGION=*Región de AWS en donde se encuentra la base de datos*

## Base de Datos ⚙ ##
La base de datos escogida para llevar a cabo el reto fue DynamoDB, base de datos administrada por AWS. DynamoDB es una base de datos NoSQL de tipo clave-valor, que proporciona alto rendimiento, escalabilidad y disponibilidad.
Esta base de datos su clave única está compuesta por una Partition Key [PK] y una Sort Key [SK], en conjunto, forman un valor único, al cual se le atribuye una serie de atributos, que no necesariamente son consistentes entre items de la tabla.
Para el presente reto, la arquitectura de la base de datos es la siguiente
#### Partition Key ####
La patition key escogida es llamada [entity] y corresponse con cualquier entidad que pueda existir en la lógica de negocio, en este caso, la entidades disponibles son:
1. Dish: corresponde a las solicitudes de platos generadas a la cocina
2. OrderIngredient: corresponde a las órdenes de compra exitosas realizadas a la plaza de mercado
3. Stock: corresponde al stock de la bodega
4. menu: corresponde a los platos disponibles en el menu
5. Es de tipo String

#### Sort Key ####
Junto con la partition key, la sort key hace de cada item un elemento único en la base de datos. La sort key escogida para el presente reto es: [id]
1. Debe ser único para todas las entidades
2. Es de tipo String

#### Local Secundary Index ####
El local secundary index en una base de datos DynamoDB permite cambiar la sort key por un atributo deseado, para el presente caso, se crea un local secundary index que apunta hacia el atributo [delivered], con el fin de hacer querys eficientes al momento de consultar por los platos aún no entregados
#### Inicializar base de datos ####
Para poder recrear el reto con cualquier otra base de datos de tipo Dynamo DB es necesario inicializar las entidades Stock y menu, en las cuales se va a alojar el Stock inicial y los platos que se van a ofrecer en el menú, respectivamente. A continuación se muestra un JSON para inicializar el Stock y para inicializar un plato del menú (los demás seguirán el mismo patrón)
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
8. Creación y asignación de una REST API de enrutamiento en AWS API Gateway. Este API se conecta directamente con el NLB, con el fin de direccionar las peticiones entrantes desde la web al NLB
9. Deploy de la interfaz gráfica en AWS S3

# Fin #
*mariovelandiac*
